/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// ----------------------
// IMPORTS

// Built-in file system library.  We'll use this to check the `node_modules`
// modules so we can transpile properly
import fs from 'fs';

import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';

import PATHS from '../paths';

// ----------------------

// Figure out which modules are third-party
const nodeModules = Object.assign({}, ...fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .map(mod => ({ [mod]: `commonjs ${mod}` }),
));

export default new Config().extend({
  '[root]/base.js': config => {
    // Prevent file emission, since the browser bundle will already have
    // done it
    for (const loader of config.module.loaders) {
      if (loader.loader === 'file') {
        loader.query.emitFile = false;
      }
    }

    return config;
  },
}).merge({

  // Set the target to Node.js, since we'll be running the bundle on the server
  target: 'node',

  // Output to the `dist` folder
  output: {
    path: PATHS.dist,
    filename: 'server.js',
  },

  entry: {
    javascript: [
      // Server entry point
      path.join(PATHS.app, 'server.js'),
    ],
  },

  // Make __dirname work properly
  node: {
    __dirname: true,
  },

  module: {
    loaders: [
      // .css files should make the classnames available to our Node code,
      // but shouldn't emit anything
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'css-loader/locals',
            query: {
              modules: true,
            },
          },
          'postcss-loader',
        ],
      },
      // Do the same with SASS files-- get the classnames, but don't emit
      {
        test: /\.s(c|a)ss$/,
        loaders: [
          {
            loader: 'css-loader/locals',
          },
          'sass-loader',
        ],
      },
      // .js(x) files can use the `.babelrc` file at the root of the project
      // (which was used to spawn Webpack in the first place), because that's
      // exactly the same polyfill config we'll want to use for this bundle
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // We're running on the Node.js server, so set `SERVER` to true
      SERVER: true,
    }),
  ],
  // No need to transpile `node_modules` files, since they'll obviously
  // still be available to Node.js when we run the resulting `server.js` entry
  externals: nodeModules,
});
