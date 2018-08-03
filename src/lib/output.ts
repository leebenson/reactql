/*
  An `Output` instance is passed through to the Webpack entry point,
  when is then responsible for orchestrating middleware, routes or other
  functions within the Webpack'd environment
*/

// ----------------------------------------------------------------------------
// IMPORTS

/* Local */
import Stats from "./stats";

// ----------------------------------------------------------------------------

// Types
export interface IOutput {
  client: Stats;
  server: Stats;
}

// Config cache
const config = new WeakMap<Output, IOutput>();

export default class Output {

  // --------------------------------------------------------------------------
  /* PUBLIC METHODS */
  // --------------------------------------------------------------------------

  /* CONSTRUCTOR */
  public constructor(c: IOutput) {
    config.set(this, c);
  }

  /* GETTERS */

  // Return the Webpack client build stats
  public get client() {
    return config.get(this)!.client;
  }

  // Return the Webpack server build stats
  public get server() {
    return config.get(this)!.server;
  }
}
