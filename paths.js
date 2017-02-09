// Node `path` module, for resolving directories
const path = require('path');

module.exports = {
  // Source path; where we'll put our application files
  src: path.join(__dirname, 'src'),

  // Entry points.  This is where webpack will look for our browser.js,
  // server.js and vendor.js files to start building
  entry: path.join(__dirname, 'src', 'entry'),

  // Static files.  HTML, images, etc that can be processed by Webpack
  // before being moved into the final `dist` folder
  static: path.join(__dirname, 'static'),

  // Dist path; where bundled assets will wind up
  dist: path.join(__dirname, 'dist'),

  // Public.  This is where our web server will start looking to serve
  // static files from
  public: path.join(__dirname, 'dist', 'public'),
};
