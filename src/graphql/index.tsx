type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type HackerNews = {
  topStories?: Maybe<Array<Maybe<Story>>>;
};

export type Query = {
  hn?: Maybe<HackerNews>;
};

export type Story = {
  id?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};
export type GetHackerNewsTopStoriesQueryVariables = {};

export type GetHackerNewsTopStoriesQuery = { __typename?: "Query" } & {
  hn: Maybe<
    { __typename?: "HackerNews" } & {
      topStories: Maybe<
        Array<
          Maybe<{ __typename?: "Story" } & Pick<Story, "id" | "title" | "url">>
        >
      >;
    }
  >;
};

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";

export const GetHackerNewsTopStoriesDocument = gql`
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

export class GetHackerNewsTopStoriesComponent extends React.Component<
  Partial<
    ReactApollo.QueryProps<
      GetHackerNewsTopStoriesQuery,
      GetHackerNewsTopStoriesQueryVariables
    >
  >
> {
  render() {
    return (
      <ReactApollo.Query<
        GetHackerNewsTopStoriesQuery,
        GetHackerNewsTopStoriesQueryVariables
      >
        query={GetHackerNewsTopStoriesDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type GetHackerNewsTopStoriesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    GetHackerNewsTopStoriesQuery,
    GetHackerNewsTopStoriesQueryVariables
  >
> &
  TChildProps;
export function withGetHackerNewsTopStories<TProps, TChildProps = {}>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        GetHackerNewsTopStoriesQuery,
        GetHackerNewsTopStoriesQueryVariables,
        GetHackerNewsTopStoriesProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.withQuery<
    TProps,
    GetHackerNewsTopStoriesQuery,
    GetHackerNewsTopStoriesQueryVariables,
    GetHackerNewsTopStoriesProps<TChildProps>
  >(GetHackerNewsTopStoriesDocument, operationOptions);
}
