import React from "react";
import { describe, it, expect } from "vitest";
import convert, { DEFAULT_NODE_MAP } from "../dist";
import { JSXComponent, ASTNodeProps } from "../dist/lib";

describe("convert", () => {
  it("should work as advertised", () => {
    const test = `# Heading

This is a [test](https://www.google.com).`;
    const result = convert(test);
    expect(result).toHaveProperty("type", DEFAULT_NODE_MAP.root);
    expect(result).toHaveProperty("props.children");
    // I'm a loser baby, so why don't ya kill meeee~~~
    // @ts-ignore
    expect(result.props.children).not.toBeNull();
  });

  it("should work as advertised with custom nodeMap", () => {
    const test = `# Heading

This is a [test](https://www.google.com).`;
    // Ugh, this sux
    const Root: JSXComponent<ASTNodeProps> = ({ children }) => (
      <div className="hello">{children}</div>
    );
    const result = convert(test, {
      ...DEFAULT_NODE_MAP,
      root: Root,
    });
    expect(result).toHaveProperty("type", Root);
    expect(result).toHaveProperty("props.children");
    // I'm a loser baby, so why don't ya kill meeee~~~
    // @ts-ignore
    expect(result.props.children).not.toBeNull();
  });
});
