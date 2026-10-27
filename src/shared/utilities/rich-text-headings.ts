import richTextToPlainText from "./rich-text-to-plain-text";

interface IRichTextNode {
  type?: string;
  attrs?: {level?: number};
  content?: IRichTextNode[];
}

export default function getRichTextHeadings(content: string | null | undefined, level: number): string[] {
  if (!content)
    return [];

  let document: IRichTextNode;

  try {
    document = JSON.parse(content);
  }
  catch {
    return [];
  }

  const headings: string[] = [];

  const walk = (node: IRichTextNode) => {
    if (node.type == "heading" && node.attrs?.level == level) {
      headings.push(richTextToPlainText(JSON.stringify(node)));
      return;
    }

    node.content?.forEach(walk);
  };

  walk(document);

  return headings;
}
