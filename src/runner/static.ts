// Runner (static)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";

/* Local */
import { build, common } from "./app";

// ----------------------------------------------------------------------------

common.spinner.info(chalk.default.bgBlue("Static mode"));

void (async () => {
  await build(true /* build in static mode */);
  common.spinner.succeed("Finished building");
})();
