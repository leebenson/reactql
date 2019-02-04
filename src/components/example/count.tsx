// ReactQL local state counter example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

/* Local */

// `<StateConsumer>` takes a function and passes it our MobX
// state. Any time the state changes, the children will automatically
// re-render -- no HOCs or boilerplate required!
import { StateConsumer } from "@/lib/mobx";

// ----------------------------------------------------------------------------

export default class Count extends React.Component {
  public render() {
    return (
      <StateConsumer>
        {state => (
          <>
            <h3>Current count (from MobX): {state.count}</h3>
            <button onClick={state.increment}>Increment</button>
          </>
        )}
      </StateConsumer>
    );
  }
}
