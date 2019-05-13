// ReactQL Hacker News GraphQL example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import React from "react";

// Emotion styled component
import styled from "@emotion/styled";

/* Local */

// Query to get top stories from HackerNews
import { GetHackerNewsTopStoriesComponent } from "@/graphql";

// ----------------------------------------------------------------------------

// Unstyled Emotion parent block, to avoid repeating <style> tags
// on child elements -- see https://github.com/emotion-js/emotion/issues/1061
const List = styled.ul``;

// Style the list item so it overrides the default font
const Story = styled("li")`
  font-size: 16px;

  a:hover {
    /* shows an example of how we can use themes */
    color: orange;
  }
`;

// Execute the GraphQL query. With SSR, the server will await the returned
// result before rendering out the initial HTML. On the browser, it will re-use
// whatever the server has sent it - or, if it's a client-navigated route that
// doesn't already have data from the server -- it'll display a loading message
// while the data is being retrieved
export const HackerNews: React.FunctionComponent = () => (
  <GetHackerNewsTopStoriesComponent>
    {({ data, loading, error }) => {
      // Any errors? Say so!
      if (error) {
        return <h1>Error retrieving news stories! &mdash; {error}</h1>;
      }

      // If the data is still loading, return with a basic
      // message to alert the user
      if (loading) {
        return <h1>Loading Hacker News stories...</h1>;
      }

      // Otherwise, we have data to work with... map over it with a
      // bullet-point list
      return (
        <>
          <h3>Top stories from Hacker News</h3>
          <List>
            {data!.hn!.topStories!.map(story => (
              <Story key={story!.id!}>
                <a href={story!.url!} target="_blank">
                  {story!.title}
                </a>
              </Story>
            ))}
          </List>
        </>
      );
    }}
  </GetHackerNewsTopStoriesComponent>
);
