/*
eslint
import/no-extraneous-dependencies: ["error", {"devDependencies": true}],
no-unused-vars: 0
*/

// Third-party vendors.  Listing the 'bare' imports here helps Webpack move
// these packages into a separate `vendor.js` bundle (even if/when you later
// use them in your own code).
//
// Since vendors likely change more infrequently than your own code, this
// can help to speed up hot reloading and leverage browser caching.

// ----------------------
// IMPORTS

// This is required by babel-preset-env to dynamically add the right
// polyfills to our client bundle
import 'babel-polyfill';

// React UI library
import 'react';

// React DOM, for browsers
import 'react-dom';

// React Router, for browsers
import 'react-router-dom';

// Build the Observable based on the features we use.  We do this instead
// of loading the whole library, to save 100kb+ in the final bundle size
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';

if (SERVER) {
  require('rxjs/add/operator/take');
}

// ----------------------
// ADD YOUR OWN VENDORS BELOW
