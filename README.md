![reactql](https://raw.githubusercontent.com/leebenson/reactql/master/kit/repo/reactql%402x.png)

# WIP: Don't use yet

# Universal React+GraphQL starter kit

React for UI. Apollo for GraphQL. Redux for stores. Browser + server-side rendering.

Maintained and updated regularly.

## Features

- [React](https://facebook.github.io/react/) for UI
- [React Apollo](http://dev.apollodata.com/react/) for GraphQL
- [React Router 4](https://github.com/ReactTraining/react-router/tree/v4) for declarative browser + server routes
- [Redux](http://redux.js.org/) for flux/store state management
- [Webpack 2](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/)
- [PostCSS](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and inline  [@imports](https://github.com/postcss/postcss-import)
- [SASS](http://sass-lang.com) support (also parsed through PostCSS)
- Full route-aware server-side rendering (SSR) of initial HTML
- Universal building - both browser + Node.js server
- Dev + [React hot reloading](http://gaearon.github.io/react-hot-loader/); zero refresh, real-time updates
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
- Tons of comments (too many) to fill you in on what's happening under the hood

# System requirements

This starter kit is built primarily for OS X, but should work with most flavours of \*nix and Windows (hopefully.)

You'll need [Node.js](https://nodejs.org) installed.

## Starting a new project

For now, simply clone the starter kit:

`git clone --depth 1 https://github.com/leebenson/reactql <project_folder>`

... then install the required packages:

`cd <project_folder>`

`npm i`

... and start writing over it.

In future, you'll be able to install globally via NPM and generate projects with a few other goodies such as code generation, deletion of the `.git` folder, etc.

## Running in development

Simply run:

`npm start`

... and a server will spawn (by default) on [http://localhost:8080](http://localhost:8080)

Changes to your React components/styles will update in the browser in real-time, with no refreshes. Changes to other code may require a refresh.

## Running a web server (server-side rendering)

This starter kit includes a `server.js` entry point, that spawns a [Koa 2](http://koajs.com/) web server.

To run it, you first need to build both the server and client bundles with:

`npm run build`

Then, simply run:

`npm run server`

... which (by default) spawns a server at [http://localhost:4000](http://localhost:4000)

Or, you can run the short-cut: `npm run build-run`, which has the same effect as running the above two commands separately.

## Project structure

This starter has been designed to provide you with a few skeletal pieces to get you going, and make it easier to layer in your own code.

Here's the folder layout:

### `.git`

Git folder.  By default, this points to the _reactql_ starter kit, so you can safely delete this if you want to initialise your own git repo and start contributing to it.

### `kit`

The bulk of _reactql_ is found in `./kit`.  If you need to dive into the Webpack config or add some custom functionality to your web server or browser instantiation, you'd do it here.

For the most part though, you probably won't need to touch this stuff.

### `kit/entry`

This is where Webpack looks for entry points for building the browser and the server.

Note: There's no separate entry for 'vendors', since the bundle is built automatically by testing whether packages reside in `node_modules`

### `kit/lib`

Custom libraries built for _reactql_.  You'll find custom helpers for Redux and Apollo for creating new stores, and building connections to your GraphQL endpoint via Apollo.

### `kit/repo`

Non-code files specific to the starter kit.  For example, the _reactql_ logo that github pulls.  You can safely delete this folder, if you want.

### `kit/webpack`

Webpack configuration files, notably:

- `base.js`: Base configuration that all others inherit from
- `eslint.js`: Entry point for the linter, to properly follow local module folders and avoid false positives
- `browser.js`: Base configuration for the browser.  Inherits from base, and is extended by browser_dev and browser_prod
- `browser_dev.js`: Config for the browser spawned at [http://localhost:8080](http://localhost:8080) when running `npm start`
- `browser_prod.js`: Production browser bundling.  Minifies and crunches code and images, gzips assets, removes source maps and debug flags, builds your browser bundles ready for production.  This is automatically served back to the client when you run `npm run build-run`
- `server.js`: Node.js web server bundle.  Even though we're running this through Node, Webpack still gets involved and properly handles inline file and CSS loading, and generates a build that works with your locally installed Node.js. You can build the server with `npm run build-server` or build and run with `npm run build-run`

### `src`

This is where all of your own code will live. By default, it contains the `<App>` component in `app.js` which demonstrates a few of the concepts that this starter kit offers you, along with styles defined in `app.css`.

You can overwrite these files directly with your own code and use this as a starter point.

### `static`

Put static files here that you want to wind up serving in production.

Webpack will automatically crunch any of your GIF/JPEG/PNG/SVG images it finds in here, as well as generate pre-compressed `.gz` versions of every file so that your Koa web server on [http://localhost:4000](http://localhost:4000) (after running `npm run build-run`) can serve up the compressed versions instead of the full-sized originals.

## Root files

There are various configuration files that you'll find in the root:

- `.babelrc`:  This exists solely to transpile the ES6 Webpack config into something Node.js can natively run. It has no bearing on the [Babel](http://babeljs.io/) config that's used to transpile your Webpack code, so you can safely this leave alone.

- `.eslint.js`: [ESLint](http://eslint.org/) configuration. If your editor/IDE has ESLint installed, it will use this file to lint your code.  See _Tweaked Airbnb style guide_ below to see the rules set for this starter kit.

- `.eslintignore`: Files the linter can safely ignore.

- `.gitignore`: Files to ignore when checking in your code.  This is built around the _reactql_ starter kit, but you will probably want to use it as a base for your own code since it ignores the usual Node stuff, along with `dist` and some of the caching folders used by Webpack.

- `package.json`: NPM packages used in this starter kit.  When you're extending this kit with your own code, you'll probably want to gut out the name, description and repo links and replace with your own. Just keep `dependencies` and `devDependencies` intact for the kit to continue to work.

- `config.js`: Project configuration file.  You can edit this to point to your own custom GraphQL endpoint, modify system paths, etc.  You can extend this with your own configuration options, for example SMTP details or other API endpoints.  This is written in ES6 style with no defaults, so you can import select configuration options from the client side without exposing credentials thanks to automatic tree-shaking/dead code elimination.

- `webpack.config.babel.js`: The Webpack entry point.  This will invoke the config found in `kit/webpack` per the `npm run...` command that spawned it.

## Tweaked Airbnb style guide

If you're using an editor to write code against this starter kit with [ESLint](http://eslint.org/) powers, you might notice squiggly red lines under perfectly innocent blocks of Javascript code.

That's because this starter kit's eslinting is based on [Airbnb style guide](https://github.com/airbnb/javascript), which enforces consistently across your code base.

I've made a few tweaks based on personal preference:

* `async/await` is perfectly valid - go nuts!
* Generators are allowed
* `for/of` loops are legal syntax (Airbnb forbids them in favour of functional programming; I happen to think they have a valid place alongside generators or Promise where serial `await`s are a feature, not a bug)
* Multiple React components per .js file are fine (sometimes the file is the logical separator, not the component)
* React `propTypes` should be a known shape-- 'any' is forbidden
* Fat-arrow parameters need only be wrapped in parentheses when there's more than one of them
* Line-break style can be either \*nix (\n) or Windows (\r\n)
* Unary operators `++` and `--` are allowed as the final statement in a `for` loop
* JSX can be written in both `.js` or `.jsx` files
* Global `require` statements are allowed.  Since we're targeting a universal code base in dev and production, there may be code you need to import conditionally
* Module resolution first looks in our project root folder, and _then_ `node_modules` (so we can write `import x from 'src/someLocalFile'` instead of requiring paths relative from the caller)
* React line breaks for self-enclosing tags should be on the same line as the final prop, e.g.:

```js
<Component
  someAttribute={true} />
```

(I just think it looks neater)

## Stylesheets

CSS can be written and placed anywhere. A common pattern I use is to write the `.css` alongside regular `.js` files, so they 'live' in the same place.

You can import and use styles in your code like regular Javascript:

Inside your CSS:

**someCssFile.css**
```css
.someClass {
  font-weight: bold;
  text-align: center;
  color: red;
}
```

**someJsFile.js**
```js
import css from './someCssFile.css';

// .someClass will get transformed into a hashed, 'local' name, to avoid
// collisions with the global namespace
export default props => (
  <div>
    <p className={css.someClass}>Hello world</p>
  </div>
)
```

.css stylesheets are parsed through [CSSNext]((http://cssnext.io/)) using [PostCSS](http://postcss.org/), using the default settings for cssnext.

That means you can use things like nested statements out-the-box:

```css
.anotherClassName {
  & h1 {
    text-size: 2em;
  }
  & p {
    color: green;
  }
}
```

As well as variable names, and other goodies:

```css
:root {
  --mainColor: red;
}

a {
  color: var(--mainColor);
}
```

Vendor prefixes will automatically be added, so you can write the bare CSS and let PostCSS worry about polyfilling browsers.

SASS code is also compiled through PostCSS in the same way. Simply use `.sass`/`.scss` files instead, and your stylesheets will pass through [node-sass](https://github.com/sass/node-sass) first.

### Local modules

By default, class styles in your CSS/SASS files will be exported as _local_ modules. Class names will be hashed to prevent bleeding out to your global namespace, and those same class names are then injected into the React code that is bundled for you. e.g:

![CSS local classnames](http://imgh.us/classnames.png)

The benefit to this is tight coupling of style logic with your components.  You don't have to worry that you've used globally unique class names, because Webpack will transpile your names into garbled, hashed versions to avoid conflicts.

### Global styles

If you want to override the 'local by default' classnames, simply prefix `:global` before the rule and it'll be made available across your entire app:

```css
:global (.thisClassWontRename) {
  font-color: blue;
}
```

In this case, `.thisClassWontRename` will be the exact name used in the output to your final .css file, so you can use this class name wherever you want the style to apply - anywhere in your code.

### Bundling styles

In development, your styles will be bundled with full source maps into the resulting Javascript that's generated by Webpack Dev Server. No external CSS file is created or called.

In production, code is extracted out into a final `style.css` file that is automatically minified and included in the first-page HTML via a `<link>` tag that's sent from the server-side.  Webpack will do the heavy lifting and match up your React names with the CSS localised styles, so it'll work exactly the same way as in dev.

You don't need to do anything for this to happen- _reactql_ takes care of it for you.

## Can I use styles on the server-side too?

Yes! In the server bundle, styles are extracted out and use the same local names as your hashed classes, so you can import styles on the server in exactly the same way.

## Module resolution

When you `import` or `require` modules, Webpack (and ESLint) will first look in your root project folder before checking `node_modules`.

This allows you to short-hand writing long, relative path names.

e.g. instead of writing:

```js
import x from '../../../components/some/file.js';
```

... you can instead simply write:

```js
import x from 'src/components/some/file.js';
```

The same is true of any filetype that Webpack recognises- .jpg, .css, .sass, .json, etc:

```js
// If, say, you wish to put all CSS code in a `styles` folder in the project root
import style from 'styles/some/file.css';
```

## Creating GraphQL enabled components + server-side rending

When running `npm start`, you'll see an example of GraphQL talking to a live server end-point hosted at [graph.cool/](https://www.graph.cool/)

Check out [src/app.js](https://github.com/leebenson/reactql/blob/master/src/app.js) to see this working in action.

The cool thing is, if you run the component on the server via `npm run build-run` and navigate to [http://localhost:4000](http://localhost:4000), you'll see the GraphQL response directly in the source code, too!

That's because ReactQL automatically requests data from GraphQL _before_ rendering the resulting HTML back to the browser.

Furthermore, it will send back the initial Redux state with the HTML, too, ensuring that the browser doesn't re-request data it already has.

Here's a blow-by-blow of how it works:

First, set the GraphQL API endpoint.  By default, I've included a sample to a [graph.cool/](https://www.graph.cool/) service I created for this starter kit -- change this to your own GraphQL server in production:

**[root]/config.js**
```js
export const APOLLO = {
  uri: 'https://api.graph.cool/simple/v1/cinomw2r1018601o42x5z69uc',
};
```

Both the browser and server entry points will create an Apollo client based on the above config.

Then, in your [src/app.js](https://github.com/leebenson/reactql/blob/master/src/app.js) file, we define the GraphQL query to grab the data we need:

**src/app.js**
```js
// First, create the GraphQL query that we'll use to request data from our
// sample endpoint
const query = gql`
  query {
    allMessages(first:1) {
      text
    }
  }
`;
```

We use Apollo's `gql` template function to specify the data we require.

Next, we'll create the 'plain' component that will ultimately take the data in via props. Note: This doesn't have any 'special' GraphQL related syntax. It's just a plain React component that will take in GraphQL data via plain props:

```js
const Message = ({ data }) => {
  // `data` will initially be blank before GraphQL has returned with data, so test it exists
  const message = data.allMessages && data.allMessages[0].text;
  const isLoading = data.loading ? 'yes' : 'nope';
  return (
    <div>
      <h2>Message from GraphQL server: <em>{message}</em></h2>
      <h2>Currently loading?: {isLoading}</h2>
    </div>
  );
};
```

Now, for use in development, we can add custom `propTypes` to the component so that React knows what to expect.

In [kit/lib/apollo.js](https://github.com/leebenson/reactql/blob/master/kit/lib/apollo.js), we have a custom `mergeData()` helper that will provide us with the `data.loading` boolean, and allow us to merge in expected data.

In this example, we're expecting an `allMessages` array which will contain an object with `text` property, containing our message received from our GraphQL endpoint.

```js
// Add propTypes for React to expect data from GraphQL
Message.propTypes = {
  data: mergeData({
    allMessages: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        text: React.PropTypes.string.isRequired,
      }).isRequired,
    ),
  }),
};
```

Finally, we create a higher-order component that wraps our plain component, and gives it GraphQL listening powers:

```js
const GraphQLMessage = graphql(query)(Message);
```

Now, we can use `<GraphQLMessage />` inside any other React component, and it'll automatically update with props when data has been retrieved or is updated.

## How can I prevent data loading on the server?

Server-side rendering is an awesome feature that will bolster your SEO strategy, and generally improve the user experience by making the full page available on initial render.

However, sometimes you don't want or need all of the data to load at once. At times, this may slow down the user experience because the time-to-first-byte will be delayed until ALL GraphQL data is available.

At those times, you can tell Apollo _not_ to load on the server, by specifying options on your `graphql()` HOC:

```js
const GraphQLMessage = graphql(query, {
  options: { ssr: false }, // won't be called during SSR
})(Message);
```

See ["Skipping queries for SSR"](http://dev.apollodata.com/react/server-side-rendering.html#skip-for-ssr) in the official Apollo docs for info.

## FAQ

### Why should I use ReactQL?

This starter kit is the product of over 2 years working with React, and GraphQL since its initial public release.

IMO, this represents the best available tooling for web apps in 2017. I use this stuff every day in production, so you can be confident it'll be maintained and updated regularly.

Use ReactQL if you want to skip the set-up, and get your next project up in record time.

### Is this production ready?

Some of the third-party packages in my stack may be in alpha or beta stages, so it's up to you to evaluate if they're a good fit for your application.

I personally use this starter kit for every new React project I undertake, many of which are running successfully under heavy production load -- so I'm quite comfortable with the tech choices.

### What kind of projects is ReactQL a good starter for?

Anything 'front end' that's backed by a GraphQL server. I typically break my projects down into a few pieces:

- **Front end**, with a built-in web server that serves public traffic. This usually sits behind an Nginx proxy/load balancer and compiles and dumps back the UI. **This is basically ReactQL**.

- **GraphQL API**. This could be Node.js, Python, Go, etc. But it's usually separate to the front-end code base, and is something the front-end talks to directly via the Apollo GraphQL client. _I generally don't use ReactQL for this_ unless there's a good reason to build a monolithic app (e.g. speed, the back-end not doing a whole lot, etc.)

- **Microservices**.  Smaller pieces of the stack that do one thing, and do it well. The API server is responsible for talking to this stuff.  Again, _ReactQL_ doesn't really get a look in.

I'd generally recommend a similar layout to keep your code light and maintainable. With that said, if you want Node.js to handle both your front and back-office concerns, there's no reason you couldn't write that stuff here too, and keep it scoped to the server. I just prefer to keep it separate.

### Will this work on Windows?

Hopefully. I haven't tested it. But there's no OS X/Linux specific commands that are used to build stuff, so it _should_ work.

### What's missing?

There's currently no test library, so feel free to add your own.

## Where do I start coding?

`src/app.js` is the main React component, that both the browser and the serve will look to. Overwrite it with your own code.

If you need to edit the build defaults, you can start digging into the `kit` dir which contains the 'under the hood' build stuff.  But that generally comes later.

### **TL;DR:** I haven't got time to read the set-up guide. How can I get this running _now_?

- Step 1: Start a new project with `git clone --depth 1 https://github.com/leebenson/reactql <project_folder>`
- Step 2: `cd` into the folder, then install packages with `npm i`
- Step 3: Run `npm start`

This will spawn a dev server on [http://localhost:8080](http://localhost:8080)

To build in production, do steps 1-2 above then run `npm run build-run`
