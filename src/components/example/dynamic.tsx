// Dynamic component that's loaded by `await import("./dynamic")`

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import React from "react";

// ----------------------------------------------------------------------------

// Say hello from GraphQL, along with a HackerNews feed fetched by GraphQL
const Dynamic: React.FunctionComponent = () => (
  <>
    <h2>This component was loaded dynamically!</h2>
  </>
);

export default Dynamic;
