// Webpack (client)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as path from "path";

/* NPM */
import BrotliCompression = require("brotli-webpack-plugin");
import * as CompressionPlugin from "compression-webpack-plugin";
import { mergeWith } from "lodash";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as webpack from "webpack";

/* Local */
import common, { defaultMerger, files } from "./common";
import css, { rules } from "./css";

// ----------------------------------------------------------------------------

const isProduction = process.env.NODE_ENV === "production";

// Base client config
const base: webpack.Configuration = {

  // Entry
  entry: [path.resolve(__dirname, "..", "entry", "client.tsx")],

  // Name
  name: "client",

  // Use `MiniCssExtractPlugin` in both dev and production, because
  // the server will need access to it in its initial render
  module: {
    rules: [
      ...css(),
      // Images
      {
        test: files.images,
        use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/img/[name]${isProduction ? ".[hash]" : ""}.[ext]`,
            },
          },
        ],
      },

      // Fonts
      {
        test: files.fonts,
        use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/fonts/[name]${isProduction ? ".[hash]" : ""}.[ext]`,
            },
          },
        ],
      },
    ],
  },

  // Set-up some common mocks/polyfills for features available in node, so
  // the browser doesn't balk when it sees this stuff
  node: {
    console: true,
    fs: "empty",
    net: "empty",
    tls: "empty",
  },

  // Output
  output: {
    path: path.resolve(__dirname, "..", "..", "dist", "public"),
    // publicPath: "/",
  },

  // The client bundle will be responsible for building the resulting
  // CSS file; ensure compilation is dumped into a single chunk
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          chunks: "all",
          enforce: true,
          name: "main",
          test: new RegExp(
            `\\.${rules.map(rule => `(${rule.ext})`).join("|")}$`,
          ),
        },
      },
    },
  },

  // Add `MiniCssExtractPlugin`
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "assets/css/[id].css",
      filename: `assets/css/[name]${isProduction ? ".[contenthash]" : ""}.css`,
    }),

    // Add global variables
    new webpack.DefinePlugin({
      GRAPHQL: JSON.stringify(process.env.GRAPHQL),
      SERVER: false,
      WS_SUBSCRIPTIONS: process.env.WS_SUBSCRIPTIONS,
    }),
  ],
};

// Development client config
const dev: webpack.Configuration = {
  devtool: "inline-source-map",

  // Output
  output: {
    chunkFilename: "[name].js",
    filename: "[name].js",
  },
};

// Production client config
const prod: webpack.Configuration = {
  // Output
  output: {
    chunkFilename: "assets/js/[name].[chunkhash].js",
    filename: "assets/js/[name].[chunkhash].js",
  },

  plugins: [
    new CompressionPlugin({
      cache: true,
      minRatio: 0.99,
    }),
    new BrotliCompression({
      minRatio: 0.99,
    }),
  ],
};

export default mergeWith({},
  common(false),
  base,
  process.env.NODE_ENV === "production" ? prod : dev,
  defaultMerger,
);
