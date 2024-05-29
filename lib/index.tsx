import React, { createElement, JSX } from "react";
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
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { fromMarkdown } from "mdast-util-from-markdown";

export interface GenericProps {
  [key: string]: unknown;
}

export type JSXComponent = JSX.ElementType;
export type JSXNode = JSX.Element;

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
  parentNode?: ASTNode;
  children?: JSXNode[] | null;
}

export interface ASTNodeMap {
  [key: string]: JSXComponent;
}

export const DEFAULT_NODE_MAP: ASTNodeMap = Object.freeze({
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  break: () => <br />,
  code: ({ node }) =>
    ("value" in node && (
      <pre>
        <code>{node.value}</code>
      </pre>
    )) ||
    null,
  definition: () => null,
  delete: ({ children }) => <s>{children}</s>,
  emphasis: ({ children }) => <em>{children}</em>,
  footnoteReference: ({ node }) =>
    ("identifier" in node && (
      <sup>
        <a href={"#fn-def-" + node.identifier}>
          {("label" in node && node.label) || node.identifier}
        </a>
      </sup>
    )) ||
    null,
  footnoteDefinition: ({ node, children }) =>
    "identifier" in node && (
      <p id={"fn-def-" + node.identifier}>
        {("label" in node && node.label) || node.identifier}: {children}
      </p>
    ),
  heading: ({ node, children }) => {
    const depth = ("depth" in node && node.depth) || 1;
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
  html: ({ node }) => ("value" in node && node.value) || null,
  image: ({ node }) =>
    ("url" in node && (
      <img src={node.url} title={"title" in node ? node.title || "" : ""} />
    )) ||
    null,
  imageReference: () => null,
  inlineCode: ({ node }) =>
    ("value" in node && <code>{node.value}</code>) || null,
  link: ({ node, children }) =>
    "url" in node ? <a href={node.url}>{children}</a> : children,
  linkReference: () => null,
  list: ({ node, children }) => {
    const ordered = "ordered" in node && node.ordered;
    if (ordered) {
      return <ol>{children}</ol>;
    } else {
      return <ul>{children}</ul>;
    }
  },
  listItem: ({ node, parentNode, children }) => (
    <li>
      {"checked" in node && typeof node.checked === "boolean"
        ? (node.checked && (
            <input type="checkbox" checked={node.checked} disabled={true} />
          )) || <input type="checkbox" disabled={true} />
        : null}
      {children}
    </li>
  ),
  paragraph: ({ parentNode, children }) =>
    parentNode?.type === "listItem" ||
    parentNode?.type === "footnoteDefinition" ? (
      children
    ) : (
      <p>{children}</p>
    ),
  root: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong>{children}</strong>,
  table: ({ children }) => <table>{children}</table>,
  tableRow: ({ children }) => <tr>{children}</tr>,
  tableCell: ({ children }) => <td>{children}</td>,
  text: ({ node }) => ("value" in node && node.value) || null,
  thematicBreak: () => <hr />,
  yaml: ({ node }) =>
    ("value" in node && (
      <pre>
        <code>{node.value}</code>
      </pre>
    )) ||
    null,
});

/**
 * Convert AST Node to React Component
 */
export const convertNodeToJSX = (
  node: ASTNode,
  nodeMap: ASTNodeMap = DEFAULT_NODE_MAP,
  parentNode?: ASTNode,
): JSXNode => {
  if (node.type in nodeMap) {
    const element = nodeMap[node.type];
    if ("children" in node) {
      const children = Array.from(node.children).map((childNode: ASTNode) =>
        convertNodeToJSX(childNode, nodeMap, node),
      );
      return createElement(element, { node, parentNode }, ...children);
    } else {
      return createElement(element, { node, parentNode });
    }
  } else {
    throw new Error(`ASTNode transformer not mapped for type: ${node.type}`);
  }
};

/**
 * Convert MD node to JSX (ReactNode).
 */
export const convertMDToJSX = (
  node: string,
  nodeMap: ASTNodeMap = DEFAULT_NODE_MAP,
) => {
  const root = fromMarkdown(node, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });
  const output = convertNodeToJSX(root, nodeMap);
  return output;
};
