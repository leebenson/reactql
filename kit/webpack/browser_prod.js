/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// This config generates a production-grade browser bundle.  It minifies and
// optimises all Javascript source code, and extracts and processes CSS before
// dumping it in a finished `styles.css` file in the `dist` folder

// ----------------------
// IMPORTS

import webpack from 'webpack';
import WebpackConfig from 'webpack-config';

// In dev, we inlined stylesheets inside our JS bundles.  Now that we're
// building for production, we'll extract them out into a separate .css file
// that can be called from our final HTML.  This plugin does the heavy lifting
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// Compression plugin for generating `.gz` static files
import CompressionPlugin from 'compression-webpack-plugin';

// ----------------------

// The final CSS file will wind up in `dist/assets/css/style.css`
const extractCSS = new ExtractTextPlugin({
  filename: 'assets/css/style.css',
  allChunks: true,
});

// CSS loader
const cssLoader = {
  loader: 'css-loader',
  query: {
    // Enable CSS modules spec.  This makes our styles :local by
    // default, so they won't bleed out to the global scope
    modules: true,
  },
};

// Extend the `browser.js` config
export default new WebpackConfig().extend({
  '[root]/browser.js': config => {
    // Optimise images
    config.module.loaders.find(l => l.test.toString() === /\.(jpe?g|png|gif|svg)$/i.toString())
      .loaders.push({
        loader: 'image-webpack-loader',
        // workaround for https://github.com/tcoopman/image-webpack-loader/issues/88
        options: {},
      });

    return config;
  },
}).merge({
  module: {
    loaders: [
      // .css loading
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          use: [
            // CSS loader -- see above for options
            cssLoader,
            // Pass through postcss first, which will minify, optimise and
            // parse through cssnext
            {
              loader: 'postcss-loader',
            },
          ],
          // As a fallback, use the style loader
          fallback: 'style-loader',
        }),
      },
      // As a secondary option to postcss, we'll also allow SASS files that
      // have a .sass/.scss extension.  They will get routed through postcss
      // in just the same way, and @import should also work fine
      {
        test: /\.s(c|a)ss$/,
        loader: extractCSS.extract({
          use: [
            // CSS loader -- see above for options
            cssLoader,
            'postcss-loader',
            'resolve-url-loader',
            'sass-loader?sourceMap',
          ],
          fallback: 'style-loader',
        }),
      },
      // LESS processing.  Parsed through `less-loader` first
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          cssLoader,
          'less-loader',
        ],
      },
    ],
  },
  // Minify, optimise
  plugins: [

    // Set NODE_ENV to 'production', so that React will minify our bundle
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    // Check for errors, and refuse to emit anything with issues
    new webpack.NoEmitOnErrorsPlugin(),

    // Minimize
    new webpack.optimize.UglifyJsPlugin(),

    // Optimise chunk IDs
    new webpack.optimize.OccurrenceOrderPlugin(),

    // A plugin for a more aggressive chunk merging strategy
    new webpack.optimize.AggressiveMergingPlugin(),

    // Compress assets into .gz files, so that our Koa static handler can
    // serve those instead of the full-sized version
    new CompressionPlugin({
      // Overwrite the default 80% compression-- anything is better than
      // nothing
      minRatio: 0.99,
    }),

    // Fire up CSS extraction
    extractCSS,
  ],
});
