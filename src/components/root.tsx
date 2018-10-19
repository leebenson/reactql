// Root entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";
import Helmet from "react-helmet";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";

/* Local */

// Components
import ScrollTop from "@/components/helpers/scrollTop";

// Global styles
import { GlobalStyles } from "@/global/styles";

// Routes
import routes from "@/data/routes";

// ----------------------------------------------------------------------------

const Root = () => (
  <div>
    <GlobalStyles />
    <Helmet>
      <title>ReactQL starter kit - edit me!</title>
    </Helmet>
    <ScrollTop>
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Switch>
    </ScrollTop>
  </div>
);

export default hot(module)(Root);
