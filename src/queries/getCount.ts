// Get local count state

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

// GraphQL tag library, for creating GraphQL queries from plain
// template text
import gql from "graphql-tag";

// ----------------------------------------------------------------------------

// GraphQL query for retrieving the current count from local state
export default gql`
  {
    state @client {
      count
    }
  }
`;
