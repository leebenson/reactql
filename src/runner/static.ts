// Runner (static)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";
const historyFallback = require("koa2-history-api-fallback");

/* Local */
// import staticMiddleware from "../lib/staticMiddleware";
import { build, common, app, staticCompiler, devServer } from "./app";

// ----------------------------------------------------------------------------

common.spinner.info(chalk.default.bgBlue("Static mode"));

void (async () => {
  // Production?
  if (common.isProduction) {
    common.spinner.info("Building production files...");
    await build(true /* build in static mode */);
    common.spinner.succeed("Finished building");
    return;
  }

  // Development...
  common.spinner.info("Building development server...");

  app.listen({ port: common.port, host: "localhost" }, async () => {
    // Fallback to /index.html on 404 routes, for client-side SPAs
    app.use(historyFallback());

    // Build the static dev server
    await devServer(app, staticCompiler);
  });
})();
