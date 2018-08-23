/*
  A `Stats` instance wraps client/server Webpack stats to provide
  helper functions to obtain chunk names, etc.
*/

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as lodash from "lodash";

// ----------------------------------------------------------------------------

export interface IStats {
  assetsByChunkName?: {
    main: string | string[];
  };
}

// Config for `Stats` instances
const config = new WeakMap<Stats, IStats>();

export default class Stats {

  // --------------------------------------------------------------------------
  /* PUBLIC METHODS */
  // --------------------------------------------------------------------------

  /* CONSTRUCTOR */
  public constructor(stats: IStats = {}) {

    // Store a raw copy of the config
    config.set(this, stats);
  }

  /* GETTERS */

  // Get the full, raw stats
  public get raw(): any {
    return config.get(this)!;
  }

  // Get main built asset based on file extension
  public main(ext: string): string | undefined {
    const main: string | string[] = lodash.get(config.get(this)!, "assetsByChunkName.main", []);
    const file = (Array.isArray(main) ? main : [main]).find((c: string) => c.endsWith(`.${ext}`));
    return file && `/${file}`;
  }
}
