interface IRichTextNode {
  type?: string;
  text?: string;
  content?: IRichTextNode[];
}

export default function richTextToPlainText(content: string | null | undefined): string {
  if (!content)
    return "";

  let document: IRichTextNode;

  try {
    document = JSON.parse(content);
  }
  catch {
    return "";
  }

  const isInline = (node: IRichTextNode) => node.text != null || node.type == "hardBreak";

  const walk = (node: IRichTextNode): string => {
    if (node.text != null)
      return node.text;

    if (node.type == "hardBreak")
      return " ";

    const children = node.content ?? [];

    return children.map(walk).join(children.every(isInline) ? "" : " ");
  };

  return walk(document).replace(/\s+/g, " ").trim();
}
