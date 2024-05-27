import { ReactNode, ComponentType, createElement } from "react";
import {
  BlockContentMap,
  Blockquote,
  Break,
  Code,
  Definition,
  Delete,
  Emphasis,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  Html,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListItem,
  Node,
  Paragraph,
  Parent,
  PhrasingContentMap,
  Root,
  RootContentMap,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
  ThematicBreak,
  Yaml,
} from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";

export interface GenericProps {
  [key: string]: unknown;
}

export type JSXComponent<P = {}> = ComponentType<P>;
export type JSXNode = ReactNode;

export type ASTNodeType =
  | keyof BlockContentMap
  | keyof RootContentMap
  | keyof PhrasingContentMap;
export type ASTNode =
  | Node
  | Parent
  | Blockquote
  | Code
  | Html
  | Heading
  | ThematicBreak
  | Break
  | Definition
  | Delete
  | Emphasis
  | FootnoteReference
  | FootnoteDefinition
  | Image
  | ImageReference
  | InlineCode
  | Link
  | LinkReference
  | Strong
  | ListItem
  | List
  | Paragraph
  | Root
  | Table
  | TableRow
  | TableCell
  | Text
  | Yaml;

export interface ASTNodeProps {
  node: ASTNode;
  children?: ReactNode[] | null;
}

export interface ASTNodeMap {
  [key: string]: JSXComponent<ASTNodeProps>;
}

export const DEFAULT_NODE_MAP: ASTNodeMap = Object.freeze({
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  break: () => <br />,
  code: ({ children }) => (
    <pre>
      <code>{children}</code>
    </pre>
  ),
  definition: () => null,
  delete: ({ children }) => <s>{children}</s>,
  emphasis: ({ children }) => <em>{children}</em>,
  footnoteDefinition: ({ children }) => <p>{children}</p>,
  footnoteReference: () => null,
  heading: ({ node, children }) => {
    const depth = "depth" in node ? node.depth : 1;
    switch (depth) {
      case 1:
        return <h1>{children}</h1>;
      case 2:
        return <h2>{children}</h2>;
      case 3:
        return <h3>{children}</h3>;
      case 4:
        return <h4>{children}</h4>;
      case 5:
        return <h5>{children}</h5>;
      case 6:
        return <h6>{children}</h6>;
      default:
        return <p>{children}</p>;
    }
  },
  html: ({ children }) => children,
  image: ({ node }) => (
    <img
      src={"url" in node ? node.url : ""}
      title={"title" in node ? node.title || "" : ""}
    />
  ),
  imageReference: () => null,
  inlineCode: ({ children }) => <code>{children}</code>,
  link: ({ node, children }) =>
    "url" in node ? <a href={node.url}>{children}</a> : children,
  linkReference: () => null,
  list: ({ node, children }) => {
    const ordered = "ordered" in node;
    if (ordered) {
      return <ol>{children}</ol>;
    } else {
      return <ul>{children}</ul>;
    }
  },
  listItem: ({ node, children }) => (
    <li>
      {"checked" in node && typeof node.checked === "boolean" ? (
        <input type="checkbox" checked={node.checked} />
      ) : null}
      {children}
    </li>
  ),
  paragraph: ({ children }) => <p>{children}</p>,
  root: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong>{children}</strong>,
  table: ({ children }) => <table>{children}</table>,
  tableRow: ({ children }) => <tr>{children}</tr>,
  tableCell: ({ children }) => <td>{children}</td>,
  text: ({ children }) => <>{children}</>,
  thematicBreak: () => <hr />,
  yaml: ({ node, children }) => (
    <>
      {"value" in node ? (
        <pre>
          <code>
            {node.value}
            {children}
          </code>
        </pre>
      ) : null}
      {children}
    </>
  ),
});

/**
 * Convert AST Node to React Component
 */
export const convertNodeToJSX = (
  input: ASTNode,
  nodeMap: ASTNodeMap = DEFAULT_NODE_MAP,
): JSXNode => {
  if (input.type in nodeMap) {
    const element = nodeMap[input.type];
    if ("children" in input) {
      const children = Array.from(input.children).map((childNode: ASTNode) =>
        convertNodeToJSX(childNode, nodeMap),
      );
      return createElement(element, { node: input }, ...children);
    } else {
      return createElement(element, { node: input });
    }
  } else {
    throw new Error(`ASTNode transformer not mapped for type: ${input.type}`);
  }
};

/**
 * Convert MD input to JSX (ReactNode).
 */
export const convertMDToJSX = (
  input: string,
  nodeMap: ASTNodeMap = DEFAULT_NODE_MAP,
) => {
  const root = fromMarkdown(input);
  const output = convertNodeToJSX(root, nodeMap);
  return output;
};
