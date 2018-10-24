// Local GraphQL state

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { ClientStateConfig, withClientState } from "apollo-link-state";

/* Local */

// Queries
import { count } from "@/queries/getCount.graphql";
import { Query, State } from "./graphql-types";

// ----------------------------------------------------------------------------

export default function createState(cache: InMemoryCache): ApolloLink {

  // Helper function to retrieve the state from cache
  function getState(query: any): State {
    return cache.readQuery<Query>({ query }).state;
  }

  // Helper function to write data back to the cache
  function writeState(state: State) {
    return cache.writeData({ data: { state } });
  }

  const opt: ClientStateConfig = {
    cache,
    resolvers: {
      Mutation: {

        // Sample mutation to increment the local `count` by 1
        incrementCount() {

          // Get the existing state
          const state = getState(count);

          // Create new state. Note that we're assigning this to a new
          // constant, and not simply incrementing the existing `count`
          // key on the state we retrieved. We use this immutable pattern
          // so Apollo can see that we have a brand new object to write
          // to the cache
          const newState = {
            ...state,
            count: state.count + 1,
          };

          // Write the new count var to the cache
          writeState(newState);

          // ... and return it back to the calling function, which will
          // then become our response data
          return newState;
        },
      },
    },
  };

  opt.defaults = {
    state: {
      __typename: "State",
      count: 0,
    },
  } as Query;

  return withClientState(opt);
}
