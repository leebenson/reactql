// Runner (development)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import chalk from "chalk";

/* Local */
import hotServerMiddleware from "../lib/hotServerMiddleware";
import { app, common, compiler, devServer } from "./app";

// ----------------------------------------------------------------------------

common.spinner
  .info(chalk.magenta("Development mode"))
  .info("Building development server...");

app.listen({ port: common.port, host: common.host }, async () => {
  await devServer(app, compiler);
  app.use(hotServerMiddleware(compiler));
});
