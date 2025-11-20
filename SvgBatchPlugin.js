// SvgBatchPlugin.js
const merge = require("deepmerge");
const spriteFactory = require("svg-baker/lib/sprite-factory");
const { RawSource } = require("webpack-sources");
const Sprite = require("svg-baker/lib/sprite");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SVGCompiler = require("svg-baker");
const NormalModule = require("webpack/lib/NormalModule");
const crypto = require("crypto");
// const Sprite = require('svg-baker/lib/sprite');

const NAMESPACE = "CUSTOM__SvgBatchPlugin";
const groupSize = 500 * 1024; //bytes
const spriteFactoryOptions = {
  attrs: {},
};
function factory({ symbols }) {
  const opts = merge.all([spriteFactoryOptions, { symbols }]);
  return spriteFactory(opts);
}
const template = `(function(window){
  // SVG 内容由 webpack 插件注入
  var svgString = %%SVG_CONTENT%%;

  if (!svgString) return;

  function injectSVG() {
    try {
      var div = document.createElement("div");
      div.innerHTML = svgString;

      var svg = div.getElementsByTagName("svg")[0];
      if (!svg) return;

      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.overflow = "hidden";

      var body = document.body;
      if (!body) return;

      if (body.firstChild) {
        body.insertBefore(svg, body.firstChild);
      } else {
        body.appendChild(svg);
      }
    } catch (e) {
      console && console.error("SVG chunk inject failed:", e);
    }
  }

  // 如果文档已经 ready，则直接注入
  if (document.readyState === "complete" ||
      document.readyState === "interactive") {
    setTimeout(injectSVG, 0);
  } else {
    document.addEventListener("DOMContentLoaded", injectSVG);
  }

})(window);`;

function getContentHash(content) {
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
}
async function splitSVGBySize(compiler) {
  const all = compiler.symbols; // [{name, content}, ...]

  let group = [];
  let size = 0;
  let index = 0;
  const spritesContent = [];
  for (const item of all) {
    const s = Buffer.byteLength(item.render());

    if (size + s > groupSize && group.length > 0) {
      const res = await writeGroup(group);
      spritesContent.push(res);
      group = [];
      size = 0;
    }

    group.push(item);
    size += s;
  }

  if (group.length > 0) {
    const res = await writeGroup(group);
    spritesContent.push(res);
  }

  return spritesContent;
}

async function writeGroup(symbols, index, outputDir) {
  const sprite = await Sprite.create({
    symbols,
    factory,
  });

  // render() 返回 { result: '<svg>...</svg>' }
  //   const content = sprite.render();

  //   const file = `${outputDir}/sprite-${index}.svg`;
  //   fs.writeFileSync(file, result, "utf8");
  //   console.log("生成 sprite:", file);

  return template.replace("%%SVG_CONTENT%%", JSON.stringify(sprite.render()));
}
class SvgBatchPlugin {
  filenamePrefix = "svg-sprite";
  generatedFiles = [];
  constructor(options = {}) {
    this.svgCompiler = new SVGCompiler();
    this.size = options.size || 10; // 每个 chunk 包含多少个 svg
    this.virtualEntryName = "__svg_entry_virtual__.js";
  }
  /**
   * 兼容 svg sprite loader 使用
   */
  get NAMESPACE() {
    return NAMESPACE;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("SvgBatchPlugin", (compilation) => {
      // 添加引用到 loader
      NormalModule.getCompilationHooks(compilation).loader.tap(
        NAMESPACE,
        (loaderContext) => (loaderContext[NAMESPACE] = this)
      );

      compilation.hooks.additionalAssets.tapPromise(NAMESPACE, async () => {
        const svgContents = await splitSVGBySize(this.svgCompiler);
        for (const jsContent of svgContents) {
          const hash = getContentHash(jsContent);
          const filename = `${this.filenamePrefix}.${hash}.js`;
          this.generatedFiles.push(filename);
          compilation.emitAsset(filename, new RawSource(jsContent));
        }
      });

      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(
        "SvgChunkPlugin",
        (assets) => {
          this.generatedFiles.forEach((file) => {
            assets.bodyTags.push({
              tagName: "script",
              voidTag: false,
              attributes: { src: file, async: true },
            });
          });
        }
      );
      //
      // 2. 在 processAssets 阶段生成 chunk 文件 + 虚拟入口
      //
      compilation.hooks.processAssets.tap(
        {
          name: "SvgBatchPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          return;

          if (svgModules.length === 0) {
            return;
          }

          // 批量拆分
          const chunks = [];
          for (let i = 0; i < svgModules.length; i += this.size) {
            chunks.push(svgModules.slice(i, i + this.size));
          }

          //
          // 3. Emit chunk js 文件
          //
          const chunkFileNames = [];

          chunks.forEach((chunkSvgs, index) => {
            const fileName = `svg-chunk-${index}.js`;
            chunkFileNames.push(fileName);

            const exportContent = chunkSvgs
              .map(
                (svg, idx) =>
                  `export const svg_${index}_${idx} = ${JSON.stringify(
                    svg.content
                  )};`
              )
              .join("\n");

            const chunkJS = `
              // Auto-generated SVG Chunk ${index}
              ${exportContent}

              export default {
                ${chunkSvgs.map((_, idx) => `svg_${index}_${idx}`).join(",")}
              };
            `;

            assets[fileName] = new RawSource(chunkJS);
          });

          //
          // 4. Emit 虚拟入口模块
          //
          const virtualEntryContent = `
            // Auto-generated virtual entry for SVG batch loader

            export const svgLoaders = [
              ${chunkFileNames
                .map(
                  (file, idx) =>
                    `() => import(/* webpackChunkName: "svg-chunk-${idx}" */ "./${file}")`
                )
                .join(",")}
            ];
          `;

          assets[this.virtualEntryName] = new RawSource(virtualEntryContent);
        }
      );

      //
      // 5. 把虚拟入口注入到 Webpack 入口依赖
      //
      //   compilation.hooks.additionalChunkAssets.tap("SvgBatchPlugin", () => {
      //     const entryPath = "./" + this.virtualEntryName;

      //     new SingleEntryPlugin(
      //       compiler.context,
      //       entryPath,
      //       "__svg_virtual_entry__"
      //     ).apply(compiler);
      //   });
    });
  }
}

module.exports = {
  SvgBatchPlugin,
};
