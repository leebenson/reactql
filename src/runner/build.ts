// Runner (production)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";

/* Local */
import { build, common } from "./app";
import { generateSchemaTypings } from "./generate";

// ----------------------------------------------------------------------------

common.spinner.info(chalk.default.bgBlue("Build mode"));

void (async () => {
  await generateSchemaTypings(false);
  await build();
  common.spinner.succeed("Finished building");
})();
