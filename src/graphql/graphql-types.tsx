/* tslint:disable */

// ====================================================
// START: Typescript template
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  me?: User | null;
  allUsers?: (User | null)[] | null;
  User?: User | null;
  allProducts?: (Product | null)[] | null;
  Product?: Product | null;
  Todo?: Todo | null;
  allTodos?: (Todo | null)[] | null;
  Post?: Post | null;
  allPosts?: (Post | null)[] | null;
  state: State;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
}

export interface Product {
  id: string;
  price: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
  author: User;
}

export interface State {
  count: number;
}

export interface Mutation {
  register?: AuthPayload | null;
  login?: AuthPayload | null;
  updateUser?: User | null;
  createTodo?: Todo | null;
  incrementCount: State;
}

export interface AuthPayload {
  token: string;
}

export interface Subscription {
  todoAdded?: Todo | null;
}

// ====================================================
// Arguments
// ====================================================

export interface AllUsersQueryArgs {
  count?: number | null;
}
export interface UserQueryArgs {
  id: string;
}
export interface AllProductsQueryArgs {
  count?: number | null;
}
export interface ProductQueryArgs {
  id: string;
}
export interface TodoQueryArgs {
  id: string;
}
export interface AllTodosQueryArgs {
  count?: number | null;
}
export interface PostQueryArgs {
  id: string;
}
export interface AllPostsQueryArgs {
  count?: number | null;
}
export interface RegisterMutationArgs {
  email: string;
  password: string;
  expiresIn?: string | null;
}
export interface LoginMutationArgs {
  email: string;
  password: string;
  expiresIn?: string | null;
}
export interface UpdateUserMutationArgs {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}
export interface CreateTodoMutationArgs {
  title: string;
  completed?: boolean | null;
}

// ====================================================
// END: Typescript template
// ====================================================

// ====================================================
// Documents
// ====================================================

export namespace IncrementCount {
  export type Variables = {};

  export type Mutation = {
    __typename?: "Mutation";
    incrementCount: IncrementCount;
  };

  export type IncrementCount = {
    __typename?: "State";
    count: number;
  };
}

export namespace Count {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    state: State;
  };

  export type State = {
    __typename?: "State";
    count: number;
  };
}

export namespace AllTodos {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    allTodos?: (AllTodos | null)[] | null;
  };

  export type AllTodos = {
    __typename?: "Todo";
    id: string;
    title: string;
  };
}

import * as ReactApollo from "react-apollo";
import * as React from "react";

import gql from "graphql-tag";

export namespace IncrementCount {
  export const Document = gql`
    mutation IncrementCount {
      incrementCount @client {
        count
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...this["props"] as any}
        />
      );
    }
  }
  export function HOC<
    TProps = any,
    OperationOptions = ReactApollo.OperationOption<TProps, Mutation, Variables>
  >(operationOptions: OperationOptions) {
    return ReactApollo.graphql<TProps, Mutation, Variables>(
      Document,
      operationOptions
    );
  }
}
export namespace Count {
  export const Document = gql`
    query count {
      state @client {
        count
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
          {...this["props"] as any}
        />
      );
    }
  }
  export function HOC<
    TProps = any,
    OperationOptions = ReactApollo.OperationOption<TProps, Query, Variables>
  >(operationOptions: OperationOptions) {
    return ReactApollo.graphql<TProps, Query, Variables>(
      Document,
      operationOptions
    );
  }
}
export namespace AllTodos {
  export const Document = gql`
    query allTodos {
      allTodos {
        id
        title
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
          {...this["props"] as any}
        />
      );
    }
  }
  export function HOC<
    TProps = any,
    OperationOptions = ReactApollo.OperationOption<TProps, Query, Variables>
  >(operationOptions: OperationOptions) {
    return ReactApollo.graphql<TProps, Query, Variables>(
      Document,
      operationOptions
    );
  }
}
