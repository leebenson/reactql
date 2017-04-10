/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Browser webpack config.  This will provide the foundation settings for
// configuring our source code to work in any modern browser

// ----------------------
// IMPORTS

// Node's built-in `path` module.  We'll use this to determine the entry
// `browser.js` entry point
import path from 'path';

// Webpack 2 is our bundler of choice.
import webpack from 'webpack';

// We'll use `webpack-config` to extend the base config we've already created
import WebpackConfig from 'webpack-config';

// other plug-ins
// import CopyWebpackPlugin from 'copy-webpack-plugin';

// Our local path configuration, so webpack knows where everything is/goes
import PATHS from '../../config/paths';

// ----------------------

// Extend the 'base' config
export default new WebpackConfig().extend('[root]/base.js').merge({

  // This is where webpack will start crunching our source code
  entry: {
    // Client specific source code.  This is the stuff we write.
    browser: [
      // Entry point for the browser
      path.join(PATHS.entry, 'browser.js'),
    ],
  },

  // Set-up some common mocks/polyfills for features available in node, so
  // the browser doesn't balk when it sees this stuff
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Modules specific to our browser bundle
  module: {
    loaders: [
      // .js(x) loading
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              // Ignore the .babelrc at the root of our project-- that's only
              // used to compile our webpack settings, NOT for bundling
              babelrc: false,
              presets: [
                ['env', {
                  // Enable tree-shaking by disabling commonJS transformation
                  modules: false,
                  // By default, target only modern browsers
                  targets: {
                    browsers: 'last 3 versions',
                  },
                }],
                // Transpile JSX code
                'react',
              ],
              plugins: [
                'syntax-dynamic-import',
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // Separate our third-party/vendor modules into a separate chunk, so that
    // we can load them independently of our app-specific code changes
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
         // this assumes your vendor imports exist in the node_modules directory
         module.context && module.context.indexOf('node_modules') !== -1
      ),
    }),

    // Create a `SERVER` constant that's false in the browser-- we'll use this to
    // determine whether we're running on a Node server and set this to true
    // in the server.js config
    new webpack.DefinePlugin({
      SERVER: false,
    }),

    // new CopyWebpackPlugin([
    //   {
    //     from: PATHS.public,
    //     force: true, // This flag forces overwrites
    //   },
    // ], {
    //   ignore: [
    //     '*.html', // Ignore static HTML (which we'll use to bootstrap webpack)
    //   ],
    // }),
  ],
});
