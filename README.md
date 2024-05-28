# convert-md-to-jsx

Convert markdown to JSX.

Uses [mdast](https://github.com/syntax-tree/mdast) and [mdast-util-from-markdown](https://github.com/syntax-tree/mdast-util-from-markdown) to generate AST and optionally combined with an AST Node to JSX Component map to convert each AST node to a JSX component.

Should hopefully have no dependencies for `document` or care about DOM at all!

<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MS41IiB2aWV3Qm94PSIwIDAgMTUwIDExMyI+PHBhdGggZD0iTTAgMGgxNTB2MTEzSDB6IiBzdHlsZT0iZmlsbDojODRhY2QwIi8+PHBhdGggZD0iTTE1MCAxM1M0NCAxNCAwIDEybTE1MCAzNVMxOCA0NyAwIDQ1bTAgMzMgMTUwIDFtMCAyOEg3NWwtNzUtMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6Ljc1cHgiLz48cGF0aCBkPSJtMzEgMTYgMSA4YzEgMy0xIDgtMSAxMnYxNGwtMSAxNyAxIDEzLTIgMTNoMzNjNSAxIDE5IDIgMjQgMGgzNWw5IDEtMi0xNSAxLTE2Yy0xLTMgMS0xMyAxLTE2VjI0bDEtOS05IDItMTUtMUg4MWwtMTkgMWMtNC0xLTgtMi0xMi0xSDMxWiIgc3R5bGU9ImZpbGw6I2Q5ZmZmMDtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6Ljc1cHgiLz48cGF0aCBkPSJNMzcgMTljLTEgMS0xIDMgMiAyIDIgMCAxLTIgMC0zbC0yIDFabTg2IDF2M2wzLTFjMS0xIDAtMy0xLTJoLTJaIiBzdHlsZT0iZmlsbDojNjg4ZTc3O3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDouNzVweCIvPjxwYXRoIGQ9Im01OSAzNyAyLTExIDcgMTAgMS04di00bTE5IDU0IDEtNiAxLTZzNyAyIDYgNGMtMiAzLTYgMi02IDJzNiAwIDYgNGMtMSA0LTUgNC03IDRzLTMtMi0zLTJNNzYgNjhsLTIgN2MwIDMgMSA0IDQgNCAyIDAgMy0yIDQtNWwxLTVtLTE4LTF2NWwtMSA3IDctMm0tMTItN3MtMS0yLTQtMmMtMiAwLTQgMy00IDYtMSAyIDAgNiAzIDVsNC0ybTQwLTMzcy0yLTMtNC0yYy0yIDAtNSAyLTIgNCAyIDIgOCA2IDYgOC0xIDItNCA1LTkgMG0tMjMtOGMyIDAgNCAxIDQgNiAwIDQtMiA3LTUgNy0yIDAtMi00LTItNyAwLTQgMi02IDMtNlptOCA5IDItNnYtNXM1IDUgNSA3bDItNCAyLTR2MTVNNTMgNDVzNyAwIDYgN2MwIDMtMiA1LTMgNWwtNCAxbTMxLTM1YzEgMCAzIDIgMyA1IDAgNC0xIDgtNSA4LTMgMC0yLTUtMi03bDQtNloiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDA7c3Ryb2tlLXdpZHRoOi43NXB4Ii8+PHBhdGggZD0iTTUzIDQ1djVjMCAyLTIgNS0xIDgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDA7c3Ryb2tlLXdpZHRoOi43NXB4Ii8+PC9zdmc+" alt="No DOMs Club" width="200" height="150">

## Installation

```shell
npm i convert-md-to-jsx --save
pnpm add convert-md-to-jsx
yarn add convert-md-to-jsx
```

## Usage

Import into your project and use it to convert Markdown formatted content (as string) to JSX:

```js
import React, { memo } from "react";
import convert from "convert-md-to-jsx";

const RenderMarkdown = memo(({ markdown }) => convert(markdown));
```

If you want to specify different JSX components for AST Node types:

```js
import React, { memo } from "react";
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

### TODO

- [ ] Decouple from React

## License

[Apache 2.0](LICENSE.md)
