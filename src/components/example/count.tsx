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
// Get the current count, stored in local Apollo state
import getCount from "@/queries/getCount";
// Mutation to increment the local counter
import incrementCount from "@/mutations/incrementCount";
// Get the Typescript types of our local state, so we can use them
// with our GraphQL queries to hint at the data that should be returned
import { IRoot } from "@/graphql/state";

/* Local */

// ----------------------------------------------------------------------------

const Count: React.SFC<{}> = () => (
  <Mutation mutation={incrementCount}>
    {
      doIncrementCount => {
        return (
          <Query<IRoot> query={getCount}>
          {
            result => {
              const data = result.data;
              if (!data || !data.state) { return (<><p>loading</p></>); }

              function buttonClick() {
                return doIncrementCount();
              }

              return (
                <>
                  <p>Current count (from local GraphQL state): {data.state.count}</p>
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

export default Count;
