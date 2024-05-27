# convert-md-to-jsx

Convert markdown to JSX.

Uses [mdast](https://github.com/syntax-tree/mdast) and [mdast-util-from-markdown](https://github.com/syntax-tree/mdast-util-from-markdown) to generate AST and optionally combined with an AST Node to JSX Component map to convert each AST node to a JSX component.

Should hopefully have no dependencies for `document` or care about DOM at all!

## Installation

```shell
npm i convert-md-to-jsx --save
pnpm add convert-md-to-jsx
yarn add convert-md-to-jsx
```

## Usage

Import into your project and use it to convert Markdown formatted content (as string) to JSX:

```js
import { memo } from "react";
import convert from "convert-md-to-jsx";

const RenderMarkdown = memo(({ markdown }) => convert(markdown));
```

If you want to specify different JSX components for AST Node types:

```js
import { memo } from "react";
import convert, { DEFAULT_NODE_MAP } from "convert-md-to-jsx";

const nodeMap = {
  ...DEFAULT_NODE_MAP,
  link: ({ node, children }) => (
    <a href={node.url} className="custom-link">
      {children}
    </a>
  ),
};

const RenderMarkdown = memo(({ markdown }) => convert(markdown, nodeMap));
```

## Contribute

Got cool ideas? Have questions or feedback? Found a bug? [Post an issue](https://github.com/lvl99/convert-md-to-jsx/issues)

Added a feature? Fixed a bug? [Post a PR](https://github.com/lvl99/convert-md-to-jsx/compare)

## License

[Apache 2.0](LICENSE.md)
