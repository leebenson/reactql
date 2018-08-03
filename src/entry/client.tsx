// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import createBrowserHistory from "history/createBrowserHistory";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";

/* Local */
import Root from "@/components/root";
import { createClient } from "@/graphql/apollo";
import { ThemeProvider } from "@/lib/styledComponents";
import defaultTheme from "@/themes/default";

// ----------------------------------------------------------------------------

// Create Apollo client
const client = createClient();

// Create a browser history
const history = createBrowserHistory();

// Render
ReactDOM.hydrate(
  <ThemeProvider theme={defaultTheme}>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Root />
      </Router>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById("root"),
);
