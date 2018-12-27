// Webpack (server)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as path from "path";

/* NPM */
import { mergeWith } from "lodash";
import * as webpack from "webpack";
import * as nodeModules from "webpack-node-externals";

/* Local */
import common, { defaultMerger, files } from "./common";
import css from "./css";

// ----------------------------------------------------------------------------

const isProduction = process.env.NODE_ENV === "production";

// Base server config
const base: webpack.Configuration = {

  entry: [path.resolve(__dirname, "..", "entry", "server.tsx")],

  // External modules that we avoid transpiling
  externals: nodeModules(),

  module: {
    rules: [
      ...css(false),
      // Images
      {
        test: files.images,
        use: [
          {
            loader: "file-loader",
            query: {
              emitFile: false,
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
              emitFile: false,
              name: `assets/fonts/[name]${isProduction ? ".[hash]" : ""}.[ext]`,
            },
          },
        ],
      },
    ],
  },

  // Name
  name: "server",

  // Set output
  output: {
    filename: "../server.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "..", "..", "dist", "public"),
    publicPath: "/",
  },

  // Plugins
  plugins: [
    // Only emit a single `server.js` chunk
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    // Add source map support to the server-side bundle
    new webpack.BannerPlugin({
      banner: `require("source-map-support").install();`,
      entryOnly: false,
      include: [
        "server.js",
      ],
      raw: true,
    }),

    // Add global variables
    new webpack.DefinePlugin({
      GRAPHQL: JSON.stringify(process.env.GRAPHQL),
      SERVER: true,
      WS_SUBSCRIPTIONS: JSON.stringify(process.env.WS_SUBSCRIPTIONS),
    }),
  ],

  resolve: {
    modules: [
      path.resolve(__dirname, "..", "..", "node_modules"),
    ],
  },

  // Target
  target: "node",
};

// Development config
const dev: webpack.Configuration = {
  devtool: "eval-source-map",
};

// Production config
const prod: webpack.Configuration = {
  devtool: "source-map",
};

export default mergeWith({},
  common(true),
  base,
  process.env.NODE_ENV === "production" ? prod : dev,
  defaultMerger,
);
