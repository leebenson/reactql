// ReactQL local state counter example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

/* Local */

// `withStore` gives us access to MobX store state
import { withStore } from "@/lib/store";

// ----------------------------------------------------------------------------

export const Count = withStore(({ store }) => (
  <>
    <h3>Current count (from MobX): {store.count}</h3>
    <button onClick={store.increment}>Increment</button>
    <button onClick={() => (store.count = 0)}>Reset</button>
  </>
));
