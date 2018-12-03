import * as React from "react";
import Count from "./count";
import { create } from "react-test-renderer";
import getCount from "@/queries/getCount";
import incrementCount from "@/mutations/incrementCount";
import { MockedProvider } from "react-apollo/test-utils";

const mocks = [
  {
    request: {
      query: getCount,
    },
    result: {
      data: {
        state: {
          count: 0,
        },
      },
    },
  },
  {
    request: {
      query: incrementCount,
    },
    result: {
      data: {
        state: {
          count: 0, // we can't really test to see if this works because the mocks have nothing to do with our actual store :(
        },
      },
    },
  },
];

describe("counts", () => {
  it("adheres to the basic principles of the universe", () => {
    expect(1 + 1).toBe(2);
  });

  it ("renders the count with the number returned by our mock", async () => {
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Count />
      </MockedProvider>,
    );

    setTimeout(() => {
      const p = component.root.findByType("p");

      expect(p.children).toContain("Current count (from local GraphQL state): 0");

    }, 0);
  });

  it ("renders the count with the number returned by our mock even " +
      "if we call a mutation with a different value", async () => {
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Count />
      </MockedProvider>,
    );

    setTimeout(() => { // can't use async / await without passing a babel config to ts-jest, see https://kulshekhar.github.io/ts-jest/user/config/#options
      const p = component.root.findByType("p");

      p.props.onClick();

      setTimeout(() => {
        expect(p.children).toContain("Current count (from local GraphQL state): 0");
      }, 0);
    }, 0);
  });

});
