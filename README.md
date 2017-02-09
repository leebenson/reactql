![ReactNow](http://imgh.us/reactnow2.svg)

# WIP: Don't use yet

# Universal React starter kit

The starter kit I use for all my React projects. Browser + server-side rendering.

Maintained and updated regularly.

## Features

- [Webpack 2](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/)
- [PostCSS](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and inline  [@imports](https://github.com/postcss/postcss-import)
- [SASS](http://sass-lang.com) support (also parsed through PostCSS)
- Full route-aware server-side rendering (SSR) of initial HTML
- Universal building - both browser + Node.js server
- Dev + [React hot reloading](http://gaearon.github.io/react-hot-loader/); zero refresh, real-time updates
- Built-in [Koa 2](http://koajs.com/) web server
- Easily extendable [webpack-config](https://fitbit.github.io/webpack-config/) files
- Separate vendor + client bundles, for better browser caching/faster builds
- Dynamic polyfills, courtesy of [babel-preset-env](https://github.com/babel/babel-preset-env)
- Aggressive code minification with [Uglify](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)
- [ESLint](http://eslint.org/)ing based on a tweaked [Airbnb style guide](https://github.com/airbnb/javascript)
- Tons of comments (too many) to fill you in on what's happening under the hood

# System requirements

This starter kit is built primarily for OS X, but should work with most flavours of \*nix and Windows (hopefully.)

You'll need [Node.js](https://nodejs.org) installed.

## Starting a new project

The easiest way to use this starter kit (on OS X/Linux) is install one-time with:

`curl https://raw.githubusercontent.com/leebenson/react-now/master/scripts/install | sh`

This will make a `/usr/local/bin/reactnow` script, that you can then use to create any new project like so:

`reactnow <project_folder>`

Note: `reactnow` will always clone the latest version of the starter kit into your project folder, so you shouldn't need to run the installer more than once.

The starter script offers the following benefits:

- You don't need to clone the repo every time
- It only downloads the latest version, not the full git history
- `.git` is deleted automatically, so you're starting with a clean slate
- It's an easy one-liner

If you're using Windows, you can simply clone this repo and start writing over it.

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
* Module resolution first looks in our `src` folder, and _then_ `node_modules` (so we can write `import x from 'someLocalFile'` instead of requiring paths relative from the caller)
* React line breaks for self-enclosing tags should be on the same line as the final prop, e.g.:

```js
<Component
  someAttribute={true} />
```

(I just think it looks neater)

## Running in development

Simply run:

`npm start`

... and a server will spawn (by default) on [http://localhost:3000](http://localhost:3000)

Changes to your React components/styles will update in the browser in real-time, with no refreshes. Changes to other code may require a refresh.

## Running a web server (server-side rendering)

This starter kit includes a `server.js` entry point, that spawns a [Koa 2](http://koajs.com/) web server.

To run it, you first need to build both the server and client bundles with:

`npm run build`

Then, simply run:

`npm run server`

... which (by default) spawns a server at [http://localhost:4000](http://localhost:4000)

Or, you can run the short-cut: `npm run build-run`, which has the same effect as running the above two commands separately.

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

## Module resolution

When you `import` or `require` modules, Webpack (and ESLint) will first look in your `src` folder before checking `node_modules`.

This allows you to short-hand writing long, relative path names.

e.g. instead of writing:

```js
import x from '../../components/some/file.js';
```

... you can instead simply write:

```js
import x from 'components/some/file.js';
```

The same is true of any filetype that Webpack recognises- .jpg, .css, .sass, .json, etc:

```js
// If, say, you wish to put all CSS code in `src/styles`
import style from 'styles/some/file.css';
```
