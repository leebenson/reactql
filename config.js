// ----------------------
// IMPORTS

import path from 'path';

// ----------------------

export const APOLLO = {
  uri: 'https://api.graph.cool/simple/v1/cinomw2r1018601o42x5z69uc',
};

export const PATHS = {
  // Root project folder.  This is the current dir.
  root: __dirname,

  // Kit.  ReactQL starter kit code.  You can edit these files, but be
  // aware that upgrading your starter kit could overwrite them
  kit: path.join(__dirname, 'kit'),

  // Entry points.  This is where webpack will look for our browser.js,
  // server.js and vendor.js files to start building
  entry: path.join(__dirname, 'kit', 'entry'),

  // Webpack configuration files
  webpack: path.join(__dirname, 'kit', 'webpack'),

  // Source path; where we'll put our application files
  src: path.join(__dirname, 'src'),

  // Static files.  HTML, images, etc that can be processed by Webpack
  // before being moved into the final `dist` folder
  static: path.join(__dirname, 'static'),

  // Dist path; where bundled assets will wind up
  dist: path.join(__dirname, 'dist'),

  // Public.  This is where our web server will start looking to serve
  // static files from
  public: path.join(__dirname, 'dist', 'public'),
};
