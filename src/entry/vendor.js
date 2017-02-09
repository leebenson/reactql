/*
eslint
import/no-extraneous-dependencies: ["error", {"devDependencies": true}],
no-unused-vars: 0
*/

// This is required by babel-preset-env to dynamically add the right
// polyfills to our client bundle
import 'babel-polyfill';

// React UI library
import 'react';

// React DOM, for browsers
import 'react-dom';

// React Router, for browsers
import 'react-router-dom';
