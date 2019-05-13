// ReactQL local state counter example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import React from "react";
import { Observer, useObservable } from "mobx-react-lite";

// ----------------------------------------------------------------------------

export const Count: React.FunctionComponent = () => {
  const store = useObservable({ count: 0 });
  return (
    <>
      <Observer>
        {() => <h3>Current count (from MobX): {store.count}</h3>}
      </Observer>
      <button onClick={() => store.count++}>Increment</button>
      <button onClick={() => (store.count = 0)}>Reset</button>
    </>
  );
};
