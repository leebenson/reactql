// Root entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import React from "react";
import Helmet from "react-helmet";
import { hot } from "react-hot-loader/root";
import { Route, Switch } from "react-router-dom";
import { Global } from "@emotion/core";

/* Local */

// Components
import ScrollTop from "@/components/helpers/scrollTop";

// Global styles
import globalStyles from "@/global/styles";

// By default, pull in the ReactQL example. In your own project, just nix
// the `src/components/example` folder and replace the following line with
// your own React components
import Example from "@/components/example";

// ----------------------------------------------------------------------------

const Root: React.FunctionComponent = () => (
  <div>
    <Global styles={globalStyles} />
    <Helmet>
      <title>ReactQL starter kit - edit me!</title>
    </Helmet>
    <ScrollTop>
      <Switch>
        <Route path="/" exact component={Example} />
      </Switch>
    </ScrollTop>
  </div>
);

export default hot(Root);
