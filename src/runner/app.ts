// Runner (app)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import fs from "fs";
import path from "path";

/* NPM */

// Koa 2 web server.  Handles incoming HTTP requests, and will serve back
// the React render, or any of the static assets being compiled
import Koa from "koa";

// Static file handler
import koaSend from "koa-send";

// Enable cross-origin requests
import koaCors from "kcors";

// Koa Router, for handling URL requests
import KoaRouter from "koa-router";

// High-precision timing, so we can debug response time to serve a request
import ms from "microseconds";

// Webpack 4
import webpack from "webpack";

// Koa-specific Webpack handlers
import KoaWebpack from "koa-webpack";

/* Ora spinner */
import ora from "ora";

// Lodash utility for merging objects
import { mergeWith } from "lodash";

/* Local */
import clientConfig from "../webpack/client";
import serverConfig from "../webpack/server";
import staticConfig from "../webpack/static";

// ----------------------------------------------------------------------------

type PartialAll<T> = { [P in keyof T]?: PartialAll<T[P]> };

function staticMiddleware(root: string, immutable = true): Koa.Middleware {
  return async (ctx, next) => {
    try {
      if (ctx.path !== "/") {
        // If we're in production, try <dist>/public first
        return await koaSend(ctx, ctx.path, {
          immutable,
          root
        });
      }
    } catch (e) {
      /* Error? Go to next middleware... */
    }
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
    serverStats: path.resolve(dist, "server.stats.json")
  },

  // Distribution folder
  dist,

  // Are we in production?
  isProduction: process.env.NODE_ENV === "production",

  // Host to bind the server to
  host: process.env.HOST || "0.0.0.0",

  // Port to start web server on
  port: (process.env.PORT && parseInt(process.env.PORT)) || 3000,

  // WebSocket port (for dev)
  websocketPort:
    (process.env.WS_PORT && parseInt(process.env.WS_PORT)) || undefined,

  // Spinner
  spinner: ora()
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
        [common.compiled.serverStats, common.compiled.clientStats].forEach(
          (file, i) => {
            if (stats.children && stats.children[i]) {
              fs.writeFileSync(file, JSON.stringify(stats.children[i]), {
                encoding: "utf8"
              });
            }
          }
        );
      }

      resolve();
    });
  });
}

// Dev server
export async function devServer(
  koaApp: Koa,
  compiler: webpack.MultiCompiler,
  opt: PartialAll<KoaWebpack.Options> = {}
) {
  // Set hot client options
  const hotClient: any = {
    host: common.host
  };

  // Is a custom WebSocket defined?
  if (common.websocketPort) {
    hotClient.port = common.websocketPort;
  }

  // Set default options for KoaWebpack
  const defaultOptions: KoaWebpack.Options = {
    compiler: compiler as any,
    devMiddleware: {
      logLevel: "info",
      publicPath: "/",
      stats: false
    },
    hotClient
  };

  // Create the middlware, by merging in any overrides
  const koaWebpackMiddleware = await KoaWebpack(mergeWith(defaultOptions, opt));

  // Attach middleware to our passed Koa app
  koaApp.use(koaWebpackMiddleware);

  // Emit the listener when Webpack has finished bundling
  (compiler as any).hooks.done.tap("built", () => {
    common.spinner.succeed(`Running on http://${common.host}:${common.port}`);
  });

  // Return the middleware
  return koaWebpackMiddleware;
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
      console.log("Error:", e);
      ctx.status = 500;
      ctx.body = "There was an error. Please try again later.";
    }
  })

  // Timing
  .use(async (ctx, next) => {
    const start = ms.now();
    await next();
    const end = ms.parse(ms.since(start));
    const total = end.microseconds + end.milliseconds * 1e3 + end.seconds * 1e6;
    ctx.set("Response-Time", `${total / 1e3}ms`);
  });

// Static file serving

// In production, check <dist>/public first
if (common.isProduction) {
  app.use(staticMiddleware(path.resolve(common.dist, "public")));
}

// ... and then fall-back to <root>/public
app.use(staticMiddleware(path.resolve(common.dist, "..", "public"), false));

// Router
app.use(router.allowedMethods()).use(router.routes());
