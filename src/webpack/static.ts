// Webpack (static bundling)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import { mergeWith } from "lodash";
import * as webpack from "webpack";

// Plugin for generating `index.html` file for static hosting
import * as HtmlWebpackPlugin from "html-webpack-plugin";

/* Local */

// Common config
import { defaultMerger } from "./common";

// Get the client-side config as a base to extend
import client from "./client";

// ----------------------------------------------------------------------------

// Augment client-side config with HtmlWebPackPlugin
const base: webpack.Configuration = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "src/views/static.html",
      title: "ReactQL app",
    }),
  ],
};

export default mergeWith({}, client, base, defaultMerger);
