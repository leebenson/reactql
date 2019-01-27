// MobX helpers

// ----------------------------------------------------------------------------
// IMPORTS

import * as React from "react";
import { runInAction } from "mobx";
import { Observer } from "mobx-react";

/* Local */
import { State } from "@/data/state";

// ----------------------------------------------------------------------------

interface IStateConsumerProps {
  children: (state: State) => React.ReactElement<any>;
}

// State context, for propogating state down a React chain
const StateContext = React.createContext<State>(new State());

// Export a <StateProvider>, for overridding default state
export const { Provider: StateProvider } = StateContext;

// State HOC for both receiving and observing state
export const StateConsumer: React.StatelessComponent<IStateConsumerProps> = ({
  children
}) => (
  <StateContext.Consumer>
    {state => {
      return <Observer>{() => children(state)}</Observer>;
    }}
  </StateContext.Consumer>
);

// Rehydrate JSON state to MobX
export function rehydrate(state: State) {
  const s = (window as any).__STATE__;
  if (typeof s === "object") {
    runInAction(() => {
      Object.keys(s).forEach(key => ((state as any)[key] = s[key]));
    });
  }
}
