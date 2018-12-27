// Runner (app)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as fs from "fs";
import * as path from "path";

/* NPM */

// Koa 2 web server.  Handles incoming HTTP requests, and will serve back
// the React render, or any of the static assets being compiled
import * as Koa from "koa";

// Static file handler
import * as koaSend from "koa-send";

// Enable cross-origin requests
import * as koaCors from "kcors";

// Koa Router, for handling URL requests
import * as KoaRouter from "koa-router";

// High-precision timing, so we can debug response time to serve a request
import * as ms from "microseconds";

// Webpack 4
import * as webpack from "webpack";

/* Ora spinner */
import * as ora from "ora";

/* Local */
import clientConfig from "../webpack/client";
import serverConfig from "../webpack/server";
import staticConfig from "../webpack/static";

// ----------------------------------------------------------------------------

function staticMiddleware(root: string, immutable = true): Koa.Middleware {
  return async (ctx, next) => {
    try {
      if (ctx.path !== "/") {

        // If we're in production, try <dist>/public first
        return await koaSend(
          ctx,
          ctx.path,
          {
            immutable,
            root,
          },
        );
      }
    } catch (e) { /* Error? Go to next middleware... */ }
    return next();
  };
}

// Distributio path
const dist = path.resolve(__dirname, "..", "..", "dist");

export const common = {
  // Compiled files
  compiled: {
    clientStats: path.resolve(dist, "client.stats.json"),
    server: path.resolve(dist, "server.js"),
    serverStats: path.resolve(dist, "server.stats.json"),
  },

  // Distribution folder
  dist,

  // Are we in production?
  isProduction: process.env.NODE_ENV === "production",

  // Port to start web server on
  port: process.env.PORT || 3000,

  // Spinner
  spinner: ora() as any,
};

// Webpack compiler
export const compiler = webpack([serverConfig, clientConfig]);
export const staticCompiler = webpack([staticConfig]);

// Build function
export function build(buildStatic = false) {

  // Determine which compiler to run
  const buildCompiler = buildStatic ? staticCompiler : compiler;

  return new Promise(resolve => {
    buildCompiler.run((e, fullStats) => {

      // If there's an error, exit out to the console
      if (e) {
        common.spinner.fail(e.message);
        process.exit(1);
      }

      // Pull out the JSON stats
      const stats = fullStats.toJson();

      // Report any build errors
      if (stats.errors.length) {
        common.spinner.fail(stats.errors.join("\n"));
        process.exit(1);
      }

      // All good - save the stats (if we're not building a static bundle)
      if (!buildStatic) {
        [common.compiled.serverStats, common.compiled.clientStats].forEach((file, i) => {
          fs.writeFileSync(file, JSON.stringify(stats.children[i]), {
            encoding: "utf8",
          });
        });
      }

      resolve();
    });
  });
}

// Router
const router = new KoaRouter()
  .get("/ping", async ctx => {
    ctx.body = "pong";
  })
  .get("/favicon.ico", async ctx => {
    ctx.status = 204;
  });

// Koa instance
export const app = new Koa()

  // CORS
  .use(koaCors())

  // Error catcher
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      console.log("Error:", e.message);
      ctx.status = 500;
      ctx.body = "There was an error. Please try again later.";
    }
  })

  // Timing
  .use(async (ctx, next) => {
    const start = ms.now();
    await next();
    const end = ms.parse(ms.since(start));
    const total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
    ctx.set("Response-Time", `${total / 1e3}ms`);
  });

// Static file serving

// In production, check <dist>/public first
if (common.isProduction) {
  app.use(staticMiddleware(
    path.resolve(common.dist, "public"),
  ));
}

// ... and then fall-back to <root>/public
app.use(staticMiddleware(
  path.resolve(common.dist, "..", "public"),
  false,
));

// Router
app.use(router.allowedMethods())
  .use(router.routes());
