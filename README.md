<img src="/kit/repo/reactnow@2x.png" alt="ReactNow" width="500" />

# WIP: Don't use yet

# Universal React starter kit

The starter kit I use for all my React projects. Browser + server-side rendering.

Maintained and updated regularly.

## Features

- [Webpack 2](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/)
- [React Router 4](https://github.com/ReactTraining/react-router/tree/v4); browser + server compatible routes
- [RxJS](http://reactivex.io/) reactive extensions, with a custom `@connect` decorator for passing Observable values to React component props
- [PostCSS](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and inline  [@imports](https://github.com/postcss/postcss-import)
- [SASS](http://sass-lang.com) support (also parsed through PostCSS)
- Full route-aware server-side rendering (SSR) of initial HTML
- Universal building - both browser + Node.js server
- Dev + [React hot reloading](http://gaearon.github.io/react-hot-loader/); zero refresh, real-time updates
- Built-in [Koa 2](http://koajs.com/) web server
- HTTP header hardening with [Helmet](https://github.com/venables/koa-helmet)
- Easily extendable [webpack-config](https://fitbit.github.io/webpack-config/) files
- Separate vendor + client bundles, for better browser caching/faster builds
- Dynamic polyfills, courtesy of [babel-preset-env](https://github.com/babel/babel-preset-env)
- Aggressive code minification with [Uglify](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)
- [GIF/JPEG/PNG/SVG crunching](https://github.com/tcoopman/image-webpack-loader)
- [Gzip compression](https://webpack.js.org/plugins/compression-webpack-plugin/) and serving of static assets as pre-compressed `.gz` files
- [ESLint](http://eslint.org/)ing based on a tweaked [Airbnb style guide](https://github.com/airbnb/javascript)
- Tons of comments (too many) to fill you in on what's happening under the hood

# System requirements

This starter kit is built primarily for OS X, but should work with most flavours of \*nix and Windows (hopefully.)

You'll need [Node.js](https://nodejs.org) installed.

## Starting a new project

For now, simply clone the starter kit:

`git clone --depth 1 https://github.com/leebenson/reactnow <project_folder>`

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

Git folder.  By default, this points to the _ReactNow_ starter kit, so you can safely delete this if you want to initialise your own git repo and start contributing to it.

### `kit`

The bulk of _ReactNow_ is found in `./kit`.  If you need to dive into the Webpack config or change the vendor packages used in your project, this is where you'd do it.

For the most part though, you probably won't need to touch this stuff.

### `kit/entry`

This is where Webpack looks for entry points for building the browser, server and vendor bundles.

### `kit/lib`

Custom libraries built for _ReactNow_.  You'll find the RxJS `@connect` decorator in here, that lets you feed Observable values into your React components.

### `kit/repo`

Non-code files specific to the starter kit.  For example, the _ReactNow_ logo that github pulls.  You can safely delete this folder, if you want.

### `kit/webpack`

Webpack configuration files, notably:

- `base.js`: Base configuration that all others inherit from
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

- `.gitignore`: Files to ignore when checking in your code.  This is built around the _ReactNow_ starter kit, but you will probably want to use it as a base for your own code since it ignores the usual Node stuff, along with `dist` and some of the caching folders used by Webpack.

- `package.json`: NPM packages used in this starter kit.  When you're extending this kit with your own code, you'll probably want to gut out the name, description and repo links and replace with your own. Just keep `dependencies` and `devDependencies` intact for the kit to continue to work.

- `paths.js`: File paths to different parts of the kit. Used by Webpack to determine what lives where.

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

You don't need to do anything for this to happen- _ReactNow_ takes care of it for you.

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

## RxJS - Reactive extensions

(If you're new to RxJS, [read this](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) for a primer on its awesomeness.)

This starter kit comes with [RxJS v5](https://github.com/ReactiveX/rxjs) pre-loaded, along with a custom `@connect` Higher-Order Component that lets you easily pass observers to your component and get the  eventual values passed along as `props`.

An example is shown in the [`src/app.js`](https://github.com/leebenson/reactnow/blob/master/src/app.js) file, simplified here:

```jsx
// The @connect HOC
import connect from 'lib/connect';

// Start with a pure functional component that takes a 'now' prop
const CurrentTime = ({ now }) => (
  <h1>Current time is: {now.toTimeString()}</h1>
);

// `now` will always be an instance of Date
CurrentTime.propTypes = {
  now: React.PropTypes.instanceOf(Date),
};

// By default, we'll start with the current date.  That will 'seed' the
// `props` value that our component can display
CurrentTime.defaultProps = {
  now: new Date(),
};

// Wrap the <Stats> component in a Higher-Order Component (HOC) to 'listen'
// to passed in observables.  The keys we pass here will become props to the
// underlying component, and will re-render whenever we get another value
const CurrentTimeObserved = connect({
  now: Observable.interval(1000).map(() => new Date()),
})(CurrentTime);
```

In the above example, when `<CurrentTimeObserved />` is mounted, it will automatically receive a new observed value every second, which will implicitly cause the underlying `<CurrentTime />` component to refresh and display the latest time.

You can pass in any number of observers into the `connect()` HOC as an object of key/Observer pairs, and the key name will be the prop key used on the underlying component.

`connect` can be used as a decorator too:

```jsx
import React from 'react';
import connect from 'lib/connect';

@connect({ now: Observable.interval(1000).map(() => new Date()) })
class CurrentTime extends React.Component {
  render() {
    return (
      <h1>Current time is: {this.props.now.toTimeString()}</h1>
    );
  }
}

CurrentTime.defaultProps = {
  now: new Date(),
};
```

### How do RxJS events work on the server?

To avoid long-running observers, when `connect` is used on the server-side it will automatically add a `take(1)` parameter to your Observable, which emits the 'completed' event once the first value has been returned.

Since the server can't render more than once per request, this means the server side will do no further processing.

The server will only render the final React markup back to the client once all events have entered a completed state, so another benefit this serves is signalling back to our server that we're ready to dump the final HTML back to the visitor.

In effect, this allows you to await the first asynchronous result of ANY data stream -- meaning you can pull data from a third-party DB, make `fetch()` calls off-site or do other things that require you to synchronise the completion of multiple disparate observers.

This would traditionally be quite difficult to do without managing complex Promise chains or writing lots of custom logic to handle special cases on the server, but with RxJS and the `connect` decorator, it's much simpler.

## FAQ

### Why should I use ReactNow?

This starter kit is the product of over 2 years working with React.

IMO, this represents the best available tooling for web apps in 2017. I use this stuff every day in production, so you can be confident it'll be maintained and updated regularly.

Use ReactNow if you want to skip the set-up, and get your next project up in record time.

### Is this production ready?

Some of the third-party packages in my stack may be in alpha or beta stages, so it's up to you to evaluate if they're a good fit for your application.

I personally use this starter kit for every new React project I undertake, many of which are running successfully under heavy production load -- so I'm quite comfortable with the tech choices.

### What kind of projects is ReactNow a good starter for?

Anything 'front end', that also needs to render well on the server.  I typically break my projects down into a few pieces:

- **Front end**, with a built-in web server that serves public traffic. This usually sits behind an Nginx proxy/load balancer and compiles and dumps back the UI. **This is basically ReactNow**.

- **API server**. This could be Node.js, Python, Go, etc. But it's usually separate to the front-end code base, and is something the front-end talks to directly. _I generally don't use ReactNow for this_ unless there's a good reason to build a monolithic app (e.g. speed, the back-end not doing a whole lot, etc.)

- **Microservices**.  Smaller pieces of the stack that do one thing, and do it well. The API server is responsible for talking to this stuff.  Again, _ReactNow_ doesn't really get a look in.

I'd generally recommend a similar layout to keep your code light and maintainable. With that said, if you want Node.js to handle both your front and back-office concerns, there's no reason you couldn't write that stuff here too, and keep it scoped to the server. I just prefer to keep it separate.

### Will this work on Windows?

Hopefully. I haven't tested it. But there's no OS X/Linux specific commands that are used to build stuff, so it _should_ work.

### What's missing?

There's currently no test library, so feel free to add your own.

Data fetching libs are also an exercise left to the user. Use REST, [Apollo GraphQL](http://www.apollodata.com/) or whatever else you want to talk to your server or API.

## Where do I start coding?

`src/app.js` is the main React component, that both the browser and the serve will look to. Overwrite it with your own code.

When you start using [npm packages](https://www.npmjs.com/) that aren't part of this starter kit, append them to `kit/entry/vendor` to have them compile

If you need to edit the build defaults, you can start digging into the `kit` dir which contains the 'under the hood' build stuff.  But that generally comes later.

### **TL;DR:** I haven't got time to read the set-up guide. How can I get this running _now_?

- Step 1: Start a new project with `git clone --depth 1 https://github.com/leebenson/reactnow <project_folder>`
- Step 2: `cd` into the folder, then install packages with `npm i`
- Step 3: Run `npm start`

This will spawn a dev server on [http://localhost:8080](http://localhost:8080)

To build in production, do steps 1-2 above then run `npm run build-run`
