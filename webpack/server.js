import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';

import PATHS from '../paths';

const nodeModules = Object.assign({}, ...fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .map(mod => ({ [mod]: `commonjs ${mod}` }),
));

export default new Config().extend({
  '[root]/base.js': config => {
    for (const loader of config.module.loaders) {
      if (loader.loader === 'file') {
        loader.query.emitFile = false;
      }
    }

    // config.resolve.mainFields = config.resolve.mainFields.filter(val => val !== 'browser');
    return config;
  },
}).merge({
  target: 'node',

  output: {
    path: PATHS.dist,
    filename: 'server.js',
  },

  entry: {
    javascript: [
      // 'babel-polyfill',
      path.join(PATHS.app, 'server.js'),
    ],
  },

  node: {
    __dirname: true,
  },

  module: {
    loaders: [
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
      {
        test: /\.s(c|a)ss$/,
        loaders: [
          {
            loader: 'css-loader/locals',
          },
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: [
            'react',
            'node7',
          ],
          plugins: [
            'transform-decorators-legacy',
          ],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER: true,
    }),
  ],
  externals: nodeModules,
});
