// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

// Create browser history, for navigation a la single page apps
import { createBrowserHistory } from "history";

// React, our UI engine
import * as React from "react";

// HOC for enabling Apollo GraphQL `<Query>` and `<Mutation>`
import { ApolloProvider } from "react-apollo";

// Attach React to the browser DOM
import * as ReactDOM from "react-dom";

// Single page app routing
import { Router } from "react-router-dom";

// MobX provider
import { Provider } from "mobx-react";

/* Local */

// Our main component, and the starting point for server/browser loading
import Root from "@/components/root";

// Helper function that creates a new Apollo client per request
import { createClient } from "@/lib/apollo";

// MobX state
import { Store } from "@/data/store";
import { rehydrate, autosave } from "@/lib/store";

// ----------------------------------------------------------------------------

// Create new MobX state
const store = ((window as any).store = new Store());

// Create Apollo client
const client = createClient(store);

// Create a browser history
const history = createBrowserHistory();

// Render
const root = document.getElementById("root")!;
ReactDOM[root.innerHTML ? "hydrate" : "render"](
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Root />
      </Router>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root")
);

// Rehydrate MobX store and save changes
[rehydrate, autosave].forEach(fn => fn(store));
