import React, { memo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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

describe("react", () => {
  it("should render MD to JSX to HTML", () => {
    const test = `# Heading 1

This is a [test](https://www.google.com).

Some *text* **formatting** ***here***. ~Ignore this!~ =Look at this!=

---

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

- Item 1
- Item 2
- Item 3

1. Item 1
2. Item 2
3. Item 3

> Blockquote

HTML code: <img src="https://placehold.it/600x600">

![image](https://placehold.it/600x600)

This is \`inline code\`.

\`\`\`
This is a code block.
\`\`\`

# GFM

- [ ] Unchecked item
- [x] Checked item

| Column | Column |
| ------ | ------ |
| Cell   | Cell   |

Here's my footnote in use[^1].

Term
: Definition

[^1]: This is the footnote definition.
`;

    const RenderMarkdown = memo(({ input }: { input: string }) =>
      convert(input),
    );

    const result = renderToStaticMarkup(<RenderMarkdown input={test} />);
    expect(result).toMatchSnapshot();
  });
});
