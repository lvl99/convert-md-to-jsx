import "react";
import { describe, it, expect } from "vitest";
import {
  convertNodeToJSX,
  convertMDToJSX,
  DEFAULT_NODE_MAP,
} from "../lib/index.tsx";

describe("convertNodeToJSX", () => {
  it("should convert ASTNode to JSXNode", () => {
    const result = convertNodeToJSX({
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "This is a test",
        },
      ],
    });
    expect(result).toHaveProperty("type", DEFAULT_NODE_MAP.paragraph);
    expect(result).toHaveProperty("props.children");
    // I'm a loser baby, so why don't ya kill meeee~~~
    // @ts-ignore
    expect(result.props.children).not.toBeNull();
  });
});

describe("convertMDToJSX", () => {
  it("should convert MD to ASTNodes and then to JSX", () => {
    const test = `
# Heading 1

This is a [test](https://www.google.com).
`;
    const result = convertMDToJSX(test);
    expect(result).toHaveProperty("type", DEFAULT_NODE_MAP.root);
    expect(result).toHaveProperty("props.children");
    // I'm a loser baby, so why don't ya kill meeee~~~
    // @ts-ignore
    expect(result.props.children).not.toBeNull();
  });
});
