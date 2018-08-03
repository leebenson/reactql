// ReactQL local state counter example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

// Use the `<Mutation>` component from the React Apollo lib to set-up the
// mutation block that will allow us to fire up GraphQL mutations. We'll also
// grab the `<Query>` component, because we'll want to 'listen' to the current
// count as it changes
import { Mutation, Query } from "react-apollo";

/* Local */

// Get the Typescript types of our local state, so we can use them
// with our GraphQL queries to hint at the data that should be returned
import { IRoot } from "@/graphql/state";

// Get the current count, stored in local Apollo state
import getCount from "@/queries/getCount";

// Mutation to increment the local counter
import incrementCount from "@/mutations/incrementCount";

// ----------------------------------------------------------------------------

export default () => (
  <Mutation mutation={incrementCount}>
    {
      doIncrementCount => {
        return (
          <Query<IRoot> query={getCount}>
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
          </Query>
        );
      }
    }
  </Mutation>
);
