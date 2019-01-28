// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

// Create browser history, for navigation a la single page apps
import createBrowserHistory from "history/createBrowserHistory";

// React, our UI engine
import * as React from "react";

// HOC for enabling Apollo GraphQL `<Query>` and `<Mutation>`
import { ApolloProvider } from "react-apollo";

// Attach React to the browser DOM
import * as ReactDOM from "react-dom";

// Single page app routing
import { Router } from "react-router-dom";

/* Local */

// Our main component, and the starting point for server/browser loading
import Root from "@/components/root";

// Helper function that creates a new Apollo client per request
import { createClient } from "@/lib/apollo";

// MobX state
import { State } from "@/data/state";
import { rehydrate, StateProvider } from "@/lib/mobx";
import { resolvePtr } from "dns";

// ----------------------------------------------------------------------------

// Create Apollo client
const client = createClient();

// Create new MobX state
const state = new State();

// Create a browser history
const history = createBrowserHistory();

// Rehydrate MobX state, if applicable
rehydrate(state);

// Render
const root = document.getElementById("root")!;
ReactDOM[root.innerHTML ? "hydrate" : "render"](
  <StateProvider value={state}>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Root />
      </Router>
    </ApolloProvider>
  </StateProvider>,
  document.getElementById("root")
);
