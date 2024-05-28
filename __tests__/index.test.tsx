import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, test, expect } from "vitest";
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

const runTest = (markdown, html) => {
  const element = convertMDToJSX(markdown);
  const result = renderToStaticMarkup(element);
  expect(result).toBe(html);
};

describe("DEFAULT_NODE_MAP", () => {
  test("blockquote", () => {
    runTest(`> Test`, `<blockquote><p>Test</p></blockquote>`);
    runTest(
      `> Test
>
> Another test`,
      `<blockquote><p>Test</p><p>Another test</p></blockquote>`,
    );
  });
  test("break", () => {
    runTest(
      `There is a line  
      break.`,
      `<p>There is a line<br/>break.</p>`,
    );
  });
  test("code", () => {
    runTest(
      `\`\`\`
Test
\`\`\``,
      `<pre><code>Test</code></pre>`,
    );
  });
  test("delete", () => {
    runTest(`~Test~`, `<p><s>Test</s></p>`);
  });
  test("footnoteReference, footnoteDefinition", () => {
    runTest(
      `Test[^1]
[^1]: Another test`,
      `<p>Test<sup><a href="#fn-def-1">1</a></sup></p><p id="fn-def-1">1: Another test</p>`,
    );
  });
  test("heading", () => {
    runTest(`# Test`, `<h1>Test</h1>`);
    runTest(`## Test`, `<h2>Test</h2>`);
    runTest(`### Test`, `<h3>Test</h3>`);
    runTest(`#### Test`, `<h4>Test</h4>`);
    runTest(`##### Test`, `<h5>Test</h5>`);
    runTest(`###### Test`, `<h6>Test</h6>`);
  });
  test("html", () => {
    runTest(
      `<img src="https://placehold.it/600x600">`,
      `&lt;img src=&quot;https://placehold.it/600x600&quot;&gt;`,
    );
  });
  test("image", () => {
    runTest(
      `![Test](https://placehold.it/600x600 "Another test")`,
      `<p><img src="https://placehold.it/600x600" title="Another test"/></p>`,
    );
  });
  test("inlineCode", () => {
    runTest(`Test \`another test\``, `<p>Test <code>another test</code></p>`);
  });
  test("link", () => {
    runTest(
      `[Test](https://google.com)`,
      `<p><a href="https://google.com">Test</a></p>`,
    );
  });
  test("list, listItem", () => {
    runTest(
      `- Item 1
- Item 2`,
      `<ul><li>Item 1</li><li>Item 2</li></ul>`,
    );
    runTest(
      `1. Item 1
2. Item 2`,
      `<ol><li>Item 1</li><li>Item 2</li></ol>`,
    );
    runTest(
      `- [ ] Item 1
- [x] Item 2`,
      `<ul><li><input type="checkbox" disabled=""/>Item 1</li><li><input type="checkbox" disabled="" checked=""/>Item 2</li></ul>`,
    );
  });
  test("paragraph", () => {
    runTest(`Test`, `<p>Test</p>`);
  });
  test("strong, emphasis", () => {
    runTest(`*Test*`, `<p><em>Test</em></p>`);
    runTest(`_Test_`, `<p><em>Test</em></p>`);
    runTest(`**Test**`, `<p><strong>Test</strong></p>`);
    runTest(`__Test__`, `<p><strong>Test</strong></p>`);
    runTest(`***Test***`, `<p><em><strong>Test</strong></em></p>`);
    runTest(`___Test___`, `<p><em><strong>Test</strong></em></p>`);
  });
  test("table, tableRow, tableCell", () => {
    runTest(
      `| Column | Column |
| -- | -- |
| Cell | Cell |`,
      `<table><tr><td>Column</td><td>Column</td></tr><tr><td>Cell</td><td>Cell</td></tr></table>`,
    );
  });
  test("thematicBreak", () => {
    runTest(`---`, `<hr/>`);
  });
});
