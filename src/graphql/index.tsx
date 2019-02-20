export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export namespace GetHackerNewsTopStories {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    hn: Maybe<Hn>;
  };

  export type Hn = {
    __typename?: "HackerNews";

    topStories: Maybe<(Maybe<TopStories>)[]>;
  };

  export type TopStories = {
    __typename?: "Story";

    id: Maybe<string>;

    title: Maybe<string>;

    url: Maybe<string>;
  };
}

import * as ReactApollo from "react-apollo";
import * as React from "react";

import gql from "graphql-tag";

// ====================================================
// Components
// ====================================================

export namespace GetHackerNewsTopStories {
  export const Document = gql`
    query GetHackerNewsTopStories {
      hn {
        topStories {
          id
          title
          url
        }
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
