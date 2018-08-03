<img src="https://reactql.org/reactql/logo.svg" alt="ReactQL" width="278" height="77" />

![license](https://img.shields.io/github/license/leebenson/reactql.svg?style=flat-square) [![Twitter Follow](https://img.shields.io/twitter/follow/reactql.svg?style=social&label=Follow)](https://twitter.com/reactql)

Front-end React + GraphQL starter kit, written in Typescript.

Clone, and make your own.

## Features

### Front-end stack

- [React v16](https://facebook.github.io/react/) for UI.
- [Apollo Client 2.0 (React)](http://dev.apollodata.com/react/) for connecting to GraphQL.
- Fully typed [Styled Components](https://www.styled-components.com/), with inline `<style>` tag generation that contains only the CSS that needs to be rendered, and full theming.
- [Sass](https://sass-lang.com/), [Less](http://lesscss.org/) and [PostCSS](https://postcss.org/) when importing `.css/.scss/.less` files.
- [React Router 4](https://github.com/ReactTraining/react-router/tree/v4) for declarative browser + server routes.
- [Apollo Link State](https://www.apollographql.com/docs/link/links/state.html) for local flux/store state management (automatically re-hydrated from the server.)
- Declarative/dynamic `<head>` section, using [react-helmet](https://github.com/nfl/react-helmet).

### Server-side rendering

- Built-in [Koa 2](http://koajs.com/) web server, with async/await routing.
- Full route-aware server-side rendering (SSR) of initial HTML.
- Universal building - both browser + Node.js web server compile down to static files, for fast server re-spawning.
- Per-request GraphQL local state. Store state is dehydrated via SSR, and rehydrated automatically on the client.
- Full page React via built-in SSR component - every byte of your HTML is React.
- SSR in both development and production, even with hot-code reload.

### Real-time

- Hot code reloading; zero refresh, real-time updates in development
- Development web server that automatically sends patches on code changes, and restarts the built-in Web server for SSR renders that reflect what you'd see in production

### Code optimisation

- [Webpack v4](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/) (dead code paths are automatically eliminated
- Asynchronous code loading when `import()`'ing inside a function
- Aggressive code minification
- CSS code is combined, minified and optimised automatically - even if you use SASS, LESS and CSS together!

### Styles

- [Styled Components](https://www.styled-components.com/), for writing CSS styles inline and generating the minimal CSS required to properly render your components. Full type inference on themes, too.
- [PostCSS v6](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and automatic vendor prefixing when importing `.css`, `.scss` or `.less` files
- [SASS](http://sass-lang.com) and [LESS](http://lesscss.org/) support (also parsed through PostCSS)
- Automatic vendor prefixing - write modern CSS, and let the compiler take care of browser compatibility
- Mix and match SASS, LESS and regular CSS - without conflicts!
- CSS modules - your classes are hashed automatically, to avoid namespace conflicts
- Compatible with Foundation, Bootstrap, Material and more. Simply configure via a `.global.(css|scss|less)` import to preserve class names

### Production-ready

- Production bundling via `npm run production`, that generates optimised server and client code
- [Static compression](https://webpack.js.org/plugins/compression-webpack-plugin/) using the [Zopfli Gzip](https://en.wikipedia.org/wiki/Zopfli) and [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) algorithms for the serving of static assets as pre-compressed `.gz` and `.br` files (default `vendor.js.bz` goes from 346kb -> 89kb!)
- Automatic HTTP hardening against common attack vectors via [Koa Helmet](https://github.com/venables/koa-helmet) (highly configurable)

### Developer support

- Written in [Typescript](https://www.typescriptlang.org/) with full type support, out the box (all external `@types/*` packages installed)
- Heavily documented code

## Usage

Clone the repo, edit `package.json` with your project name and version, then run `npm i` to install the latest packages.

The important folder is `src`. Everything happens in there.

Here's a quick run-through of each folder and what you'll find in there:

* [src/components](src/components) - React components. Follow the import flow at [root.tsx](src/components/root.tsx) to figure out the component render chain. I've included an [example](src/components/example) component that shows off some Apollo GraphQL features, including incrementing a local counter and pulling top news stories from Hacker News (a live GraphQL server endpoint.)

* [src/data](src/data) - Data used throughout your app. You'll find [routes.ts](src/data/routes.ts), which defines your React Router routes (currently, just the home page -- but you can easily extend this.)

* [src/entry](src/data) - The client and server entry points, which call on [src/components/root.tsx](src/components/root.tsx) to isomorphically render the React chain in both environments.

* [src/global](src/global) - A good place for anything that's used through your entire app, like global styles. I've started you off with a [styles.ts](src/global/styles.ts) that sets globally inlined Styled Components CSS, as well as pulls in a global `.scss` file -- to show you how both types of CSS work.

* [src/graphql](src/graphql) - GraphQL initialisation goes here. There's an [apollo.ts](src/graphql/apollo.ts) which builds a universal Apollo Client and enables local state, and [state.ts](src/graphql/state.ts) which sets up default state (automatically rehydrated on the client) and some mutation handlers, for incrementing a local counter.

* [src/lib](src/lib) - Library functions to handle hot-code reloading, finding the the right `main.js` / `main.css` in production (which is automatically hashed for versioning), Webpack stats and Styled Components.

* [src/mutations](src/mutations) - Your GraphQL mutations. Out-the-box, you'll find the query to increment the local state counter.

* [src/queries](src/queries) - Your GraphQL queries. There are two by default - one that grabs the local counter state, another that pulls the top stories from Hacker News to display in the example component.

* [src/runner](src/runner) - Development and production runners that spawn the Webpack build process in each environment.

* [src/themes](src/themes) - A sample [interface](src/themes/interface.ts) type for defining a Styled Components theme, and a [default theme](src/themes/default.ts) that's used in the example component to add an orange hover to Hacker News links.

* [src/views](src/views) - View components that fall outside of the usual React component chain, for use on the server. In here, [ssr.tsx](views/ssr.tsx) takes care of rendering the root HTML that's sent down the wire to the client. Note this is also a React component - your whole app will render as React!

* [src/webpack](src/webpack) - The Webpack 4 configuration files that do the heavy lifting to transform our Typescript code, images and CSS into optimised and minified assets that wind up in the `dist` folder at the root. Handles both the client and server environments.

You'll also find some other useful goodies in the [root]()...

* [types](types) - Some basic types that allow you to import fonts, images, CSS/SASS/LESS files, and allow use of the global `SERVER` boolean in your IDE.

* Typescript configuration via [tsconfig.json](tsconfig.json) and [tslint.json](tslint.json)

* A sample [Dockerfile](Dockerfile) for quickly deploying your code base to production.

## Development mode

Development mode offers a few useful features:

* Hot code reloading. Make a change anywhere in your code base (outside of the Webpack config), and changes will be pushed down the browser automatically - without page reloads. This happens for React, Styled Components, SASS - pretty much anything.

* Full source maps for Javascript and CSS

* Full server-side rendering, with automatic Koa web server restarting on code changes. This ensures the initial HTML render will always reflect your latest code changes

To get started, simply run:

```
npm start
```

A server will be started on [http://localhost:3000](http://localhost:3000)

## Production mode

In production mode, the following happens:

* All assets are optimised and minified. Javascript, CSS, images, are all compiled down to static files that will appear in `dist`.

* Assets are also compressed into `.gz` (Gzip) and `.br` (Brotli) versions, which are served automatically if the browser can handle them (all modern browsers can.)

* If files have been generated in a previous run, they will be re-used on subsequent runs. This ensures really fast server start-up times after the initial build.

To build and run for production, use:

```
npm run production
```

Files will be generated in `./dist`, and a server will also be spawned at [http://localhost:3000](http://localhost:3000)

Clean the cached production build with `npm run clean`, or run `npm run clean-production` to both clean and re-run the production build.

# Follow @reactql for updates

Get the latest updates by following us on Twitter: https://twitter.com/reactql

[![Twitter Follow](https://img.shields.io/twitter/follow/reactql.svg?style=social&label=Follow)](https://twitter.com/reactql)

# New to GraphQL? Need help?

<img src="https://reactql.org/assets/ext/slack_mark.png" alt="ReactQL" width="70" />

[Join the ReactQL slack channel here.](https://join.slack.com/t/reactql/shared_invite/enQtMjU0MjUzNDEzNzY0LWIyY2MzOGNlYmE1ZjI5ZDZhZTI2ODdiYzM2NjczYzJhZDgxYmJmYzE1NDYzZjRkYmVmNmQ3MzM0NzM3N2M5ODM)

Watch my free [45 minute YouTube video](https://www.youtube.com/watch?v=DNPVqK_woRQ), for a live coding walk-through of putting together a GraphQL server with a database. Learn how to write queries, mutations and handle nested/related data.

# Hire me

I'm a full-stack developer with 20+ years experience. As well as 9 years hands-on dev with Node.js, I'm fluent in Python, Go, SQL and NoSQL. I specialise in building robust, scalable products from scratch, and helping you deploy fast (usually to Kubernetes!)

If you're looking for a senior developer who can help you get your product out the door quickly, reach me at [lee@leebenson.com](mailto:lee@leebenson.com). I'm occasionally available to take on remote contracts when I'm not working on my own products.