// Runner (static)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import path from "path";

/* NPM */
import chalk from "chalk";

/* Local */
import { build, common, app, staticCompiler, devServer } from "./app";
import clientConfig from "../webpack/client";

// ----------------------------------------------------------------------------

common.spinner.info(chalk.bgBlue("Static mode"));

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

  app.listen({ port: common.port, host: common.host }, async () => {
    // Build the static dev server
    const middleware = await devServer(app, staticCompiler);

    // Fallback to /index.html on 404 routes, for client-side SPAs
    app.use(async ctx => {
      const filename = path.resolve(clientConfig.output.path, "index.html");
      ctx.response.type = "html";
      ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(
        filename
      );
    });
  });
})();
