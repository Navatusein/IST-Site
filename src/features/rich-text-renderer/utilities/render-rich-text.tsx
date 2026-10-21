import {ReactNode} from "react";
import {IRichTextMark, IRichTextNode} from "@/shared/rich-text-extensions/types";
import {RICH_TEXT_NODE_RENDERERS} from "@/shared/rich-text-extensions/renderers";

const SAFE_HREF = /^(https?:|mailto:|tel:|\/(?![\/\\])|#|\?)/i;

function getSafeHref(href?: string): string | undefined {
  const value = href?.trim();
  return value && SAFE_HREF.test(value) && !/[\t\n\r]/.test(value) ? value : undefined;
}

function renderMark(mark: IRichTextMark, children: ReactNode, key: number): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong key={key}>{children}</strong>;
    case "italic":
      return <em key={key}>{children}</em>;
    case "strike":
      return <s key={key}>{children}</s>;
    case "link": {
      const href = getSafeHref(mark.attrs?.href);

      if (!href)
        return children;

      const target = mark.attrs?.target === undefined ? "_blank" : mark.attrs.target ?? undefined;

      return (
        <a
          key={key}
          href={href}
          target={target}
          rel={mark.attrs?.rel ?? (target == "_blank" ? "noopener noreferrer nofollow" : undefined)}
          title={mark.attrs?.title ?? undefined}
        >
          {children}
        </a>
      );
    }
    default:
      return children;
  }
}

function renderChildren(node: IRichTextNode): ReactNode[] {
  return (node.content ?? []).map((child, index) => renderNode(child, index));
}

export function renderNode(node: IRichTextNode, key: number): ReactNode {
  const NodeRender = Object.hasOwn(RICH_TEXT_NODE_RENDERERS, node.type) ? RICH_TEXT_NODE_RENDERERS[node.type] : undefined;

  if (NodeRender)
    return <NodeRender key={key} node={node}>{renderChildren(node)}</NodeRender>;

  switch (node.type) {
    case "doc":
      return renderChildren(node);

    case "text":
      return (node.marks ?? []).reduce<ReactNode>(
        (children, mark) => renderMark(mark, children, key),
        node.text ?? ""
      );

    case "hardBreak":
      return <br key={key}/>;

    case "bulletList":
      return <ul key={key}>{renderChildren(node)}</ul>;

    case "orderedList":
      return <ol key={key} start={node.attrs?.start}>{renderChildren(node)}</ol>;

    case "listItem":
      return <li key={key}>{renderChildren(node)}</li>;

    default:
      return node.content ? <div key={key}>{renderChildren(node)}</div> : null;
  }
}
