import * as path from "path";
import * as fs from "fs";

// Load env vars, for the `GRAPHQL` endpoint and anything else we need
require("dotenv").config();

// Catch CTRL/CMD+C interrupts cleanly
const signals: NodeJS.Signals[] = [
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGABRT",
  "SIGTERM"
];

signals.forEach(s => process.on(s, () => process.exit(0)));

// Check that we have a specified Webpack runner
if (!process.env.RUNNER) {
  console.error("No Webpack runner specified");
  process.exit(1);
}

// Path to runner
const script = path.resolve("./src/runner", `${process.env.RUNNER!}.ts`);

// Check that the runner exists
if (!fs.existsSync(script)) {
  console.error(`Runner doesn't exist: ${script}`);
  process.exit(1);
}

// Start the script
require(script);
