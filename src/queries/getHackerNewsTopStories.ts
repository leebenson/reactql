// Get the top stories from HackerNews

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

// GraphQL tag library, for creating GraphQL queries from plain
// template text
import gql from "graphql-tag";

// ----------------------------------------------------------------------------

// GraphQL query for retrieving Hacker News top-stories from the
// https://graphqlhub.com/playground sample server endpoint
export default gql`
  {
    hn {
      topStories {
        id
        title
        url
      }
    }
  }
`;
