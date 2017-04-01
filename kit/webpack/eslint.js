/* eslint-disable */
import Config, { environment } from 'webpack-config';

environment.setAll({
  root: () => __dirname,
});

// ----------------------

// Helper function that'll take the name of the config file, and throw back a
// fully-formed object that webpack will take as the final config to bundle
function load(file) {
  return new Config().extend(`[root]/${file}.js`).toObject();
}

export default load('base');
