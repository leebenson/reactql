// ReactQL Hacker News GraphQL example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

// Use the `<Query>` component from the React Apollo lib to declaratively
// fetch the GraphQL data, to display as part of our component
import { Query } from "react-apollo";

/* Local */

// Styled component lib for generating CSS in lieu of using SASS
import styled from "@/lib/styledComponents";

// Query to get top stories from HackerNews
import hackerNewsQuery from "@/queries/getHackerNewsTopStories";

// ----------------------------------------------------------------------------

// Typescript types

// Represents a HackerNews story - id, title and url
interface IHackerNewsStory {
  id: string;
  title: string;
  url: string;
}

// Represents the data returned by the Hacker News GraphQL query
interface IHackerNewsTopStories {
  hn: {
    topStories: IHackerNewsStory[];
  };
}

// Style the list item so it overrides the default font
const Story = styled.li`
  font-size: 16px;

  a:hover {
    /* shows an example of how we can use themes */
    color: ${props => props.theme.colors.orange};
  }
`;

// Execute the GraphQL query. With SSR, the server will await the returned
// result before rendering out the initial HTML. On the browser, it will re-use
// whatever the server has sent it - or, if it's a client-navigated route that
// doesn't already have data from the server -- it'll display a loading message
// while the data is being retrieved
export default () => (
  <Query<IHackerNewsTopStories> query={hackerNewsQuery}>
    {
      result => {

        // Any errors? Say so!
        if (result.error) {
          return (
            <h1>Error retrieving news stories! &mdash; {result.error}</h1>
          );
        }

        // If the data is still loading, return with a basic
        // message to alert the user
        if (result.loading) {
          return (
            <h1>Loading Hacker News stories...</h1>
          );
        }

        // Otherwise, we have data to work with... map over it with a
        // bullet-point list
        return (
          <>
            <h3>Top stories from Hacker News</h3>
            <ul>
              {
                result.data!.hn.topStories.map(story => (
                  <Story key={story.id}>
                    <a href={story.url} target="_blank">{story.title}</a>
                  </Story>
                ))
              }
            </ul>
          </>
        );
      }
    }
  </Query>
);
