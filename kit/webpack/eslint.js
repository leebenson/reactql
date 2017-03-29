/* eslint-disable */
require('babel-register');

const webpackConfig = require('webpack-config');
const WebpackConfigDefault = config.default;

webpackConfig.environment.setAll({
  root: () => __dirname,
});

// ----------------------

// Helper function that'll take the name of the config file, and throw back a
// fully-formed object that webpack will take as the final config to bundle
function load(file) {
  return new WebpackConfigDefault().extend(`[root]/${file}.js`).toObject();
}

module.exports = load('base');
