// Runner (development)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";

/* Local */
import hotServerMiddleware from "../lib/hotServerMiddleware";
import { app, common, compiler, devServer } from "./app";

// ----------------------------------------------------------------------------

common.spinner
  .info(chalk.default.magenta("Development mode"))
  .info("Building development server...");

app.listen({ port: common.port, host: "localhost" }, async () => {
  await devServer(app, compiler);
  app.use(hotServerMiddleware(compiler));
});
