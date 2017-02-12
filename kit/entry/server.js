/* eslint-disable no-param-reassign, no-console */

// Server entry point, for Webpack.  This will spawn a Koa web server
// and listen for HTTP requests.  Clients will get a return render of React
// or the file they have requested
//
// Note:  No HTTP optimisation is performed here (gzip, http/2, etc).  Node.js
// will nearly always be slower than Nginx or an equivalent, dedicated proxy,
// so it's usually better to leave that stuff to a faster upstream provider

// ----------------------
// IMPORTS

// React UI
import React from 'react';

// React utility to transform JSX to HTML (to send back to the client)
import ReactDOMServer from 'react-dom/server';

// Koa 2 web server.  Handles incoming HTTP requests, and will serve back
// the React render, or any of the static assets being compiled
import Koa from 'koa';

// HTTP header hardening
import koaHelmet from 'koa-helmet';

// Koa Router, for handling URL requests
import KoaRouter from 'koa-router';

// Static file handler
import koaStatic from 'koa-static';

// High-precision timing, so we can debug response time to serve a request
import ms from 'microseconds';

// Embedded Javascript views -- we'll use this to inject React and other
// data into the HTML that is rendered back to the client
import ejs from 'ejs';

// React Router HOC for figuring out the exact React hierarchy to display
// based on the URL
import { StaticRouter } from 'react-router';

// Initial view to send back HTML render
import view from 'kit/views/ssr.ejs';

// App entry point
import App from 'src/app';

// Import paths.  We'll use this to figure out where our public folder is
// so we can serve static files
import PATHS from 'paths';

// ----------------------

// Port to bind to.  Takes this from the `PORT` environment var, or assigns
// to 4000 by default
const PORT = process.env.PORT || 4000;

// Run the server
(async function server() {
  // Set up routes
  const router = (new KoaRouter())
    // Set-up a general purpose /ping route to check the server is alive
    .get('/ping', async ctx => {
      ctx.body = 'pong';
    })

    // Everything else is React
    .get('/*', async ctx => {
      const route = {};

      // Generate the HTML from our React tree.  We're wrapping the result
      // in `react-router`'s <StaticRouter> which will pull out URL info and
      // store it in our empty `route` object

      console.log(ctx.request);

      const html = ReactDOMServer.renderToString(
        <StaticRouter location={ctx.request.url} context={route}>
          <App />
        </StaticRouter>,
      );

      // Render the view with our injected React data
      ctx.body = ejs.render(view, {
        title: 'Test!',
        html,
      });
    });

  // Start Koa
  (new Koa())

    // Preliminary security for HTTP headers
    .use(koaHelmet())

    // Error wrapper.  If an error manages to slip through the middleware
    // chain, it will be caught and logged back here
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (e) {
        // TODO we've used rudimentary console logging here.  In your own
        // app, I'd recommend you implement third-party logging so you can
        // capture errors properly
        console.log('Error', e.message);
        ctx.body = 'There was an error. Please try again later.';
      }
    })

    // It's useful to see how long a request takes to respond.  Add the
    // timing to a HTTP Response header
    .use(async (ctx, next) => {
      const start = ms.now();
      console.log(start);
      await next();
      const end = ms.parse(ms.since(start));
      const total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
      ctx.set('Response-Time', `${total / 1e3}ms`);
    })

    // Serve static files from our dist/public directory, which is where
    // the compiled JS, images, etc will wind up
    .use(koaStatic(PATHS.public, {
      // Don't defer to middleware.  If we have a file, serve it immediately
      defer: false,
    }))

    // If the requests makes it here, we'll assume they need to be handled
    // by the router
    .use(router.routes())
    .use(router.allowedMethods())

    // Bind to the specified port
    .listen(PORT);
}());
