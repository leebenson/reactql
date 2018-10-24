// ReactQL local state counter example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

/* Local */

// Get the current count, stored in local Apollo state
import { Count, IncrementCount } from "@/graphql/graphql-types";

// ----------------------------------------------------------------------------

export default () => (
  <IncrementCount.Component>
    {
      doIncrementCount => {
        return (
          <Count.Component>
          {
            ({ data }) => {

              // Create an `onClick` handler to run the mutation
              function buttonClick() {
                return doIncrementCount();
              }

              return (
                <>
                  <h3>Current count (from local GraphQL state): {data!.state.count}</h3>
                  <button onClick={buttonClick}>Increment</button>
                </>
              );
            }
          }
          </Count.Component>
        );
      }
    }
  </IncrementCount.Component>
);
