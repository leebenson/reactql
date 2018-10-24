// Todos list data example

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

/* Local */

// Styled component lib for generating CSS in lieu of using SASS
import styled from "@/lib/styledComponents";

// Query to get random todo items
import { AllTodos } from "@/graphql/graphql-types";

// Style the list item so it overrides the default font
const Todo = styled.li`
  font-size: 16px;

  span:hover {
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
  <AllTodos.Component>
    {
      result => {

        // Any errors? Say so!
        if (result.error) {
          return (
            <h1>Error retrieving todo tasks! &mdash; {result.error}</h1>
          );
        }

        // If the data is still loading, return with a basic
        // message to alert the user
        if (result.loading) {
          return (
            <h1>Loading Todo...</h1>
          );
        }

        // Otherwise, we have data to work with... map over it with a
        // bullet-point list
        return (
          <>
            <h3>Todo</h3>
            <ul>
              {
                result.data!.allTodos!.map(todo => (
                  <Todo key={todo!.id}>
                    <span>{todo!.title}</span>
                  </Todo>
                ))
              }
            </ul>
          </>
        );
      }
    }
  </AllTodos.Component>
);
