"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var MiniCssExtractPlugin = require("mini-css-extract-plugin");

var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var TerserPlugin = require("terser-webpack-plugin");

var _require = require("clean-webpack-plugin"),
    CleanWebpackPlugin = _require.CleanWebpackPlugin;

var Preprocess = require("svelte-preprocess");

var mode = process.env.NODE_ENV || "development";
var prod = mode === "production";

var path = require("path");

var sveltePath = path.resolve("node_modules", "svelte");
/**
 * Should source maps be generated alongside your production bundle? This will expose your raw source code, so it's
 * disabled by default.
 */

var sourceMapsInProduction = false;
/**
 * Should we run Babel on builds? This will transpile your bundle in order to work on your target browsers (see the
 * `browserslist` property in your package.json), but will impact bundle size and build speed.
 */

var useBabel = true;
/**
 * Should we run Babel on development builds? If set to `false`, only production builds will be transpiled. If you're
 * only testing in modern browsers and don't need transpiling in development, it is recommended to keep this disabled
 * as it will greatly speed up your builds.
 */

var useBabelInDevelopment = false;
/**
 * One or more stylesheets to compile and add to the beginning of the bundle. By default, SASS, SCSS and CSS files are
 * supported. The order of this array is important, as the order of outputted styles will match. Svelte component
 * styles will always appear last in the bundle.
 */

var stylesheets = ["./src/styles/index.scss"];
module.exports = {
  entry: {
    bundle: [// Note: Paths in the `stylesheets` variable will be added here automatically
    "./src/js/translations.js", "./src/main.ts"]
  },
  resolve: {
    alias: {
      // Note: Additional aliases will be loaded automatically from `tsconfig.compilerOptions.paths`
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"]
  },
  output: {
    publicPath: "/build/",
    path: __dirname + "/public/build",
    filename: "[name].js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [{
      test: /\.svelte$/,
      use: {
        loader: "svelte-loader-hot",
        options: {
          dev: !prod,
          emitCss: prod,
          hotReload: !prod,
          hotOptions: {
            // List of options and defaults: https://www.npmjs.com/package/svelte-loader-hot#usage
            noPreserveState: false,
            optimistic: true
          },
          preprocess: Preprocess({
            scss: true,
            postcss: {
              plugins: [require("autoprefixer")]
            }
          })
        }
      }
    }, {
      test: /\.(scss|sass)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: !prod,
          sourceMap: !prod || sourceMapsInProduction
        }
      }, "css-loader", {
        loader: "postcss-loader",
        options: {
          plugins: [require("autoprefixer")]
        }
      }, "sass-loader"]
    }, {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: !prod,
          sourceMap: !prod || sourceMapsInProduction
        }
      }, "css-loader"]
    }, {
      test: /\.ts$/,
      use: "ts-loader",
      exclude: /node_modules/
    }]
  },
  devServer: {
    hot: true,
    stats: "minimal",
    contentBase: "public",
    watchContentBase: true
  },
  mode: mode,
  plugins: [new MiniCssExtractPlugin({
    filename: "[name].css"
  })],
  optimization: {
    minimizer: []
  },
  devtool: prod && !sourceMapsInProduction ? false : "source-map"
}; // Add stylesheets to the build

if (Array.isArray(stylesheets) || typeof stylesheets === "string") {
  if (!Array.isArray(stylesheets)) {
    stylesheets = (_readOnlyError("stylesheets"), [stylesheets]);
  }

  module.exports.entry.bundle.unshift.apply(module.exports.entry.bundle, stylesheets);
} // Load path mapping from tsconfig


var tsconfigPath = path.resolve(__dirname, "tsconfig.json");
var tsconfig = require("fs").existsSync(tsconfigPath) ? require(tsconfigPath) : {};

if ("compilerOptions" in tsconfig && "paths" in tsconfig.compilerOptions) {
  var aliases = tsconfig.compilerOptions.paths;

  for (var alias in aliases) {
    var paths = aliases[alias].map(function (p) {
      return path.resolve(__dirname, p);
    });

    if (!(alias in module.exports.resolve.alias) && paths.length) {
      module.exports.resolve.alias[alias] = paths.length > 1 ? paths : paths[0];
    }
  }
} // These options should only apply to production builds


if (prod) {
  // Clean the build directory for production builds
  module.exports.plugins.push(new CleanWebpackPlugin()); // Minify CSS

  module.exports.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      map: sourceMapsInProduction ? {
        inline: false,
        annotation: true
      } : false
    },
    cssProcessorPluginOptions: {
      preset: ["default", {
        discardComments: {
          removeAll: !sourceMapsInProduction
        }
      }]
    }
  })); // Minify and treeshake JS

  module.exports.optimization.minimizer.push(new TerserPlugin({
    sourceMap: sourceMapsInProduction,
    extractComments: false
  }));
} // Add babel if enabled


if (useBabel && (prod || useBabelInDevelopment)) {
  module.exports.module.rules.unshift({
    test: /\.(?:svelte|m?js)$/,
    include: [path.resolve(__dirname, "src"), path.dirname(sveltePath)],
    use: {
      loader: "babel-loader",
      options: {
        exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
        sourceType: "unambiguous",
        presets: [["@babel/preset-env", {
          targets: "> 0.25%, not dead",
          useBuiltIns: "entry",
          corejs: 3,
          loose: true
        }]],
        plugins: ["@babel/plugin-syntax-dynamic-import", ["@babel/plugin-transform-runtime", {
          useESModules: true
        }]]
      }
    }
  });
}