<img src="https://reactql.org/docs/images/reactql-logo.svg" alt="ReactQL" width="278" height="77" />

# Universal React+GraphQL starter kit CLI

React for UI. Apollo for GraphQL. Redux for stores. Browser + server-side rendering.

Easy CLI tool for Mac/Windows/Linux. Just `npm i -g reactql` and run `reactql new` to start your next project.

Maintained and updated regularly.

## Features

- CLI for quickly starting a new project
- [React](https://facebook.github.io/react/) for UI
- [Apollo Client (React)](http://dev.apollodata.com/react/) for GraphQL
- [React Router 4](https://github.com/ReactTraining/react-router/tree/v4) for declarative browser + server routes
- [Redux](http://redux.js.org/) for flux/store state management
- [Webpack 2](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/)
- [PostCSS](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and inline  [@imports](https://github.com/postcss/postcss-import)
- [SASS](http://sass-lang.com) and [LESS](http://lesscss.org/) support (also parsed through PostCSS)
- Full route-aware server-side rendering (SSR) of initial HTML
- Universal building - both browser + Node.js server
- Dev + [React-compatible hot code reloading](http://gaearon.github.io/react-hot-loader/); zero refresh, real-time updates
- Built-in [Koa 2](http://koajs.com/) web server, with async/await routing
- HTTP header hardening with [Helmet for Koa](https://github.com/venables/koa-helmet)
- Declarative/dynamic `<head>` section, using [react-helmet](https://github.com/nfl/react-helmet)
- Easily extendable [webpack-config](https://fitbit.github.io/webpack-config/) files
- Separate local + vendor bundles, for better browser caching/faster builds
- Dynamic polyfills, courtesy of [babel-preset-env](https://github.com/babel/babel-preset-env)
- Aggressive code minification with [Uglify](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)
- [GIF/JPEG/PNG/SVG crunching](https://github.com/tcoopman/image-webpack-loader) for images
- [Gzip compression](https://webpack.js.org/plugins/compression-webpack-plugin/) and serving of static assets as pre-compressed `.gz` files
- [ESLint](http://eslint.org/)ing based on a tweaked [Airbnb style guide](https://github.com/airbnb/javascript)
- Tons of commentary/documentation to fill you in on what's happening under the hood

# Quick start

Install the ReactQL command-line tool on Mac/Windows/Linux:

```bash
npm i -g reactql
```

Then run `reactql` for help, or `reactql new` to start a new project.

# Documentation

## See **[https://reactql.org](https://reactql.org)** for full features + documentation.
