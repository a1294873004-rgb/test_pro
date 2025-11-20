// SvgBatchPlugin.js
const path = require("path");
const merge = require("deepmerge");
const spriteFactory = require("svg-baker/lib/sprite-factory");

const { RawSource } = require("webpack-sources");
const { normalize } = require("path");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const Sprite = require("svg-baker/lib/sprite");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { interpolateName, getOptions } = require("loader-utils");
const urlSlug = require("url-slug");
const SVGCompiler = require("svg-baker");
const NormalModule = require("webpack/lib/NormalModule");

// const { NAMESPACE } = require('./config');
const NAMESPACE = "CUSTOM__SvgBatchPlugin";
const configure = require("svg-sprite-loader/lib/configurator");
const Exceptions = require("svg-sprite-loader/lib/exceptions");

let svgCompiler = new SVGCompiler();

/**
 * 覆盖 svg sprite loader 的 extract 逻辑，
 * 使用自定义的 NAMESPACE ，配合 SvgBatchPlugin
 * @param {*} content
 */
function svgSpriteLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const done = this.async();
  const loaderContext = this;
  const { resourcePath, loaderIndex } = loaderContext;
  // webpack 1 compat
  const resourceQuery = loaderContext.resourceQuery || "";
  const compiler = loaderContext._compiler;
  const isChildCompiler = compiler.isChild();
  const parentCompiler = isChildCompiler
    ? compiler.parentCompilation.compiler
    : null;
  const matchedRules = getOptions(loaderContext);

  if (!content.includes("<svg")) {
    throw new Exceptions.InvalidSvg(content, matchedRules);
  }

  const configObj = { context: loaderContext };

  configObj.config = matchedRules;
  configObj.target = loaderContext.target;

  /**
   * @type {SVGSpriteLoaderConfig}
   */
  const config = configure(configObj);

  if (config.extract) {
    const plugin = parentCompiler
      ? parentCompiler.options.plugins.find(
          (p) => p.NAMESPACE && p.NAMESPACE === NAMESPACE
        )
      : this[NAMESPACE];

    if (typeof plugin === "undefined") {
      throw new Exceptions.ExtractPluginMissingException();
    }

    if (loaderIndex > 0) {
      this.emitWarning(new Exceptions.RemainingLoadersInExtractModeException());
    }

    svgCompiler = plugin.svgCompiler;
  }

  let runtimeGenerator;
  try {
    runtimeGenerator = require(config.runtimeGenerator); // eslint-disable-line import/no-dynamic-require,global-require
  } catch (e) {
    throw new Exceptions.InvalidRuntimeException(e.message);
  }

  let id;
  if (typeof config.symbolId === "function") {
    id = config.symbolId(resourcePath, resourceQuery);
  } else {
    const idPattern =
      config.symbolId + (resourceQuery ? `--${urlSlug(resourceQuery)}` : "");
    id = interpolateName(loaderContext, idPattern, {
      content,
      context: compiler.context,
      regExp: config.symbolRegExp,
    });
  }
  svgCompiler
    .addSymbol({ id, content, path: resourcePath + resourceQuery })
    .then((symbol) => {
      // 输出空占位 module，batch JS 由 SvgBatchPlugin 统一生成
      done(null, `// extracted by svg-batch-plugin\nexport default {};`);
    })
    .catch(done);
}

/**
 * @param {string} request
 */
function isSvgRequest(request) {
  return request && /\.svg(\?.*)?$/.test(request);
}

function factory({ symbols }) {
  const opts = merge.all([spriteFactoryOptions, { symbols }]);
  return spriteFactory(opts);
}
const template = `(function(window){
  // SVG 内容由 webpack 插件注入
  var svgString = "%%SVG_CONTENT%%";

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
const crypto = require("crypto");

function getContentHash(content) {
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
}
const groupSize = 500 * 1024; //bytes
async function splitSVGBySize(compiler) {
  const all = compiler.getAll(); // [{name, content}, ...]

  let group = [];
  let size = 0;
  let index = 0;
  const spritesContent = [];
  for (const item of all) {
    const s = Buffer.byteLength(item.content);

    if (size + s > groupSize && group.length > 0) {
      const res = await writeGroup(group, index++, outputDir);
      spritesContent.push(res);
      group = [];
      size = 0;
    }

    group.push(item);
    size += s;
  }

  if (group.length > 0) {
    const res = await writeGroup(group, index++, outputDir);
    spritesContent.push(res);
  }

  return spritesContent;
}

async function writeGroup(svgList, index, outputDir) {
  const symbols = svgList.map(
    (svg) =>
      new Symbol({
        id: svg.name,
        content: svg.content,
      })
  );

  const sprite = Sprite.create({
    symbols,
    factory,
  });

  // render() 返回 { result: '<svg>...</svg>' }
  const content = await sprite.render();

  //   const file = `${outputDir}/sprite-${index}.svg`;
  //   fs.writeFileSync(file, result, "utf8");
  //   console.log("生成 sprite:", file);

  return template.replace("%%SVG_CONTENT%%", content);
}

module.exports = svgSpriteLoader;
