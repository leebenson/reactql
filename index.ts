// Run the right environment...

// Load env vars, for the `GRAPHQL` endpoint and anything else we need
require("dotenv").config();

// Catch CTRL/CMD+C interrupts cleanly
process.on("SIGINT", () => {
  process.exit();
});

// Build mode?
const script = ["build", "static"].includes(process.env.npm_lifecycle_event!)
  ? process.env.npm_lifecycle_event! : process.env.NODE_ENV || "development";

// Start the script
require(`./src/runner/${script}`);
