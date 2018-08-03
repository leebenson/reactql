// ReactQL example page - delete this folder for your own project!

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import * as React from "react";

/* Local */

// Counter, controlled by local Apollo state
import Count from "./count";

// Hacker News GraphQL example
import HackerNews from "./hackernews";

// ----------------------------------------------------------------------------

// Say hello from GraphQL, along with a HackerNews feed fetched by GraphQL
export default () => (
  <>
    <h1>Hi from ReactQL</h1>
    <Count />
    <HackerNews />
  </>
);
