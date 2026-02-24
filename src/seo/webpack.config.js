const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const rimraf = require('rimraf');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { SvgBatchPlugin } = require('./webpack-utils/svg-batch/SvgBatchPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SvgSpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const PrerenderPlugin = require('@prerenderer/webpack-plugin');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';
  const isOnline = !!env.online;
  const isAnalyzer = !!env.analyzer;
  let mode = 'development';

  if (isOnline) {
    // 线上
    mode = 'online';
  } else if (argv.mode === 'production') {
    // dev 线上
    mode = 'dev-online';
  }
  console.log(
    'env',
    `
      isOnline: ${isOnline}
      isAnalyzer: ${isAnalyzer}
      isDev: ${isDev}
      mode: ${argv.mode}
      `,
  );

  if (!isDev) {
    if (isOnline) {
      rimraf.sync(path.join(__dirname, 'online-dist'));
    } else {
      rimraf.sync(path.join(__dirname, 'dist'));
    }
  }

  let config = {
    // mode: isDev ? 'development' : 'production',
    mode: 'development',
    context: __dirname,
    entry: './index.tsx',
    resolve: {
      extensions: ['.ts', '.js', '.json', '.tsx'], // 修改解析扩展名的顺序
      fallback: {
        path: require.resolve('path-browserify'),
      },
      alias: {
        src: path.resolve(__dirname, 'src'),
        '@styles': path.resolve(__dirname, 'src/styles'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(woff2?|eot|ttf|otf)$/,
          type: 'asset/resource', // 会把字体单独打包成文件，并返回 URL
        },
        {
          test: /\.(frag|vert|glsl|obj)$/,
          use: 'raw-loader',
        },
        {
          test: /\.js$/, // 匹配所有 .js 文件
          include: [
            /src/, // 默认你自己源码
            /node_modules\/@yidooo/, // ⭐ 这里加你要 watch 的 package
          ],
          use: {
            loader: 'babel-loader', // 使用 babel-loader,
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...(isDev
                  ? {
                      cacheDirectory: true,
                      cacheCompression: false,
                    }
                  : {}),
                presets: [
                  '@babel/preset-env', // 转换现代 JS 到兼容版本
                  ['@babel/preset-react', { runtime: 'automatic' }], // 支持 JSX
                ],
                plugins: [
                  '@lingui/babel-plugin-lingui-macro',
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  declaration: false,
                  skipLibCheck: true,
                },
                configFile: path.resolve(__dirname, 'tsconfig.json'),
              },
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif|mp4|webm|ogg|avi)$/i,
          type: 'asset/resource', // ✅ 始终生成文件（不会转成 base64）
          generator: {
            filename: 'assets/[name][hash][ext]', // ✅ 控制输出文件名和路径
          },
        },
        {
          test: /\.svg$/i,
          oneOf: [
            // 命中 ?icon 的 svg → sprite 模式
            !isDev
              ? {
                  resourceQuery: /icon/,
                  use: [
                    {
                      loader: path.join(__dirname, 'webpack-utils/svg-batch/svg-batch-loader'),
                      options: {
                        symbolId: filePath => {
                          const name = path.basename(filePath, '.svg');
                          return `IconSVG-${name}`;
                        },
                        extract: true,
                      },
                    },
                    'svg-transform-loader',
                    'svgo-loader',
                  ],
                }
              : {
                  resourceQuery: /icon/,
                  use: [
                    {
                      loader: 'svg-sprite-loader',
                      options: {
                        symbolId: filePath => {
                          const name = path.basename(filePath, '.svg');
                          return `IconSVG-${name}`;
                        },
                        extract: false,

                        // symbolId: "icon-[name]",
                        runtimeCompat: true, // 让 import 后能拿到 SpriteLoaderRuntime
                      },
                    },
                    'svg-transform-loader',
                    'svgo-loader',
                  ],
                },
            ,
            // ?react → React 组件模式
            {
              resourceQuery: /react/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    icon: true,
                  },
                },
              ],
            },
            // 普通 svg → asset 模式
            {
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10 * 1024, // 10 KB 以下转 base64
                },
              },
              generator: {
                filename: 'assets/svg/[name][hash][ext]',
              },
            },
          ].filter(Boolean),
        },

        // {
        //   test: /\.svg$/i,
        //   resourceQuery: { not: [/icon/] },
        //   type: 'asset',
        //   parser: {
        //     dataUrlCondition: {
        //       maxSize: 10 * 1024, // 10 KB 以下内联为 Base64，超过输出为文件
        //     },
        //   },
        //   generator: {
        //     filename: 'assets/svg/[name][hash][ext]', // 输出路径
        //   },
        // },

        // {
        //   test: /\.svg$/i,
        //   resourceQuery: /icon/,
        //   use: [
        //     {
        //       loader: 'svg-sprite-loader',
        //       options: {
        //         symbolId: filePath => {
        //           const name = path.basename(filePath, '.svg');
        //           return `IconSVG-${name}`;
        //         },
        //         extract: false,
        //       },
        //     },
        //     'svg-transform-loader',
        //     'svgo-loader',
        //   ],
        // },
        {
          // .less / .css 文件不开启 css module
          test: /\.(le|c)ss$/,
          exclude: /\.module\.(le|c)ss$/, // 排除 css module 文件
          use: [
            {
              loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap: true,
                modules: false,
                esModule: true,
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                sourceMap: true,
                lessOptions: {
                  sourceMap: false,
                  javascriptEnabled: true,
                  math: 'always',
                  paths: [path.resolve(__dirname, 'src/styles')],
                },
              },
            },
          ],
        },
        {
          // xxxx.module.less / .css 文件开启 css module
          test: /\.module\.(le|c)ss$/,
          use: [
            {
              loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap: true,
                modules: {
                  mode: 'local',
                  localIdentName: '[local]_[hash:base64]',
                  localIdentHashDigestLength: 10,
                  namedExport: false,
                  exportGlobals: true,
                },
                esModule: true,
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                sourceMap: true,
                lessOptions: {
                  sourceMap: false,
                  javascriptEnabled: true,
                  math: 'always',
                },
              },
            },
          ],
        },
      ],
    },
    stats: {
      warningsFilter: [
        /export .* was not found in/,
        /webpack\.cache\.PackFileCacheStrategy/, // ✅ 忽略缓存 big strings 警告
      ],
    },
    // optimization: {
    //   usedExports: true, // 启用 Tree Shaking
    // },
    optimization: {
      // chunkIds: 'named',
      splitChunks: isDev ? false : { chunks: 'all' },
      splitChunks: false,
      // : {
      //     cacheGroups: {
      //       defaultVendors: {
      //         name: 'vendor',
      //         minSize: 0,
      //         minChunks: 1,
      //         test: /[\\/]node_modules[\\/]/,
      //         chunks: 'all',
      //         priority: 1000,
      //         reuseExistingChunk: true,
      //         enforce: true,
      //       },
      //       default: {
      //         name: 'main',
      //         minSize: 0,
      //         minChunks: 1,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //         enforce: true,
      //         chunks: 'all',
      //       },
      //       // default: false,
      //       styles: {
      //         name: 'styles',
      //         test: /\.(c|le)ss$/,
      //         chunks: 'all',
      //         enforce: true,
      //       },
      //     },
      //   },
      // minimize: false,
      // minimizer: [
      //   new TerserPlugin({
      //     extractComments: false,
      //   }),
      // ],
    },

    devServer: {
      port: 8090,
      hot: true,
      historyApiFallback: true,
      open: true,
      client: {
        overlay: false,
      },
    },
    // 关闭 hrm
    // devServer: {
    //   port: 8090,
    //   hot: false, // ❌ 关闭 HMR
    //   liveReload: true, // ✅ 开启整页刷新
    //   historyApiFallback: true,
    //   open: true,
    //   client: {
    //     overlay: false,
    //   },
    // },
    plugins: [
      isAnalyzer &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'server', // 会生成一个 HTML 文件
          openAnalyzer: true, // 构建完成自动打开报告
          analyzerPort: 9888,
        }),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
      isDev &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        CONFIG: JSON.stringify({
          dev: isDev,
          online: isOnline,
          mode,
        }),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, 'src/assets/IMG/logo1.png'),
        mode: 'webapp',
        devMode: 'webapp',
        inject: true,
      }),
      // 注入 env 环境变量
      new Dotenv({
        path: isOnline ? './.env.prod' : './.env',
        // path: './.env.prod',
        safe: false,
      }),
      !isDev && new SvgBatchPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              'src/assets/seo/baidu/baidu_verify_codeva-Rhb5buw4fq.html',
            ),
            to: path.resolve(__dirname, isOnline ? 'online-dist' : 'dist'),
            noErrorOnMissing: false,
          },
          {
            from: path.resolve(__dirname, 'src/assets/seo/robots.txt'),
            to: path.resolve(__dirname, isOnline ? 'online-dist' : 'dist'),
            noErrorOnMissing: false,
          },
        ],
      }),
      isOnline &&
        new PrerenderPlugin({
          // 必须指向你编译后的文件夹
          staticDir: path.join(__dirname, 'online-dist'),

          // 填入你 routes.js 里的所有路径
          routes: ['/', '/pricing', '/preloading-inspiration'],

          renderer: new PuppeteerRenderer({
            // 这一行非常重要：告诉插件等到 React 渲染完再抓取
            renderAfterDocumentEvent: 'render-event',
            // 调试时可以设为 false 看到浏览器弹出来，发布时设为 true
            headless: true,
            maxConcurrentRoutes: 1,
            renderAfterTime: 1000 * 10,
            injectProperty: '__PRERENDER_INJECTED',
            inject: {
              ssgRender: 'true',
            },
          }),
        }),
    ].filter(Boolean),
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, isOnline ? 'online-dist' : 'dist'),
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'assets/[name][ext]',
    },
  };

  if (isDev) {
    config.devtool = 'eval-cheap-module-source-map';

    config = {
      ...config,
      watchOptions: {
        ignored: ['**/node_modules/!(@yidooo)/**'],
        aggregateTimeout: 300,
        poll: 1000,
      },
      cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename], // webpack 配置文件变化会自动失效缓存
        },
        name: 'yidooo-webpack-cache', // 可选，缓存名
        compression: false, // dev 下不压缩更快
        version: '1',
      },
    };
  } else if (isAnalyzer) {
    config.output = {
      ...config.output,
      filename: 'js/[name].js', // 原始入口名
      chunkFilename: 'js/[name].chunk.js', // 原始 chunk 名
    };

    const miniCss = config.plugins.find(p => p instanceof MiniCssExtractPlugin);
    if (miniCss) {
      miniCss.options.filename = 'css/[name].css';
      miniCss.options.chunkFilename = 'css/[name].chunk.css';
    }
  } else if (isOnline) {
    config.devtool = false;
    config.optimization.minimizer = [
      new TerserPlugin({
        extractComments: false, // 不生成 LICENSE.txt
        // terserOptions: {
        //   compress: {
        //     drop_console: true, // ✅ 删除所有 console.*
        //     drop_debugger: true, // ✅ 删除 debugger
        //     pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.debug'],
        //   },
        // },
      }),
    ];
    config.mode = 'development'; // ⭐⭐⭐ 核心
    config.devtool = 'source-map';
    config.optimization.minimize = false;
    delete config.optimization.minimizer;
  }

  return config;
};
