// Runner (production)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as fs from "fs";

/* NPM */
import * as chalk from "chalk";

/* Local */
import Output from "../lib/output";
import Stats, { IStats } from "../lib/stats";
import { app, build, common } from "./app";

// ----------------------------------------------------------------------------

function getStats(file: string): IStats {
  return JSON.parse(fs.readFileSync(file, "utf8")) as IStats;
}

common.spinner.info(chalk.default.green("Production mode"));

void (async () => {

  // Get a list of file accessibility
  const files = Object.values(common.compiled).map(file => {
    try {
      fs.accessSync(file);
      return true;
    } catch (_e) {
      return false;
    }
  });

  // Compile the server if we don't have all the expected files
  if (!files.every(file => file)) {
    common.spinner.info("Building production server...");
    await build();
  } else {
    common.spinner.info("Using cached build files");
  }

  // Create an Output
  const output = new Output({
    client: new Stats(getStats(common.compiled.clientStats)),
    server: new Stats(getStats(common.compiled.serverStats)),
  });

  // Attach middleware
  app.use(require(common.compiled.server).default(output));

  app.listen(common.port, () => {
    common.spinner.succeed(`Running on http://localhost:${common.port}`);
  });
})();
