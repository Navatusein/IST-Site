import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";

import Paragraph from "./ant-paragraph/ant-paragraph";
import Heading from "./ant-heading/ant-heading";
import Blockquote from "./ant-blockquote/ant-blockquote";
import HorizontalRule from "./ant-horizontal-rule/ant-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";

export const ExtensionsForRender = [
  Document,
  Paragraph,
  Heading,
  Text,
  ListItem,
  BulletList,
  OrderedList,
  Bold,
  Italic,
  Strike,
  HardBreak,
  History,
  Blockquote,
  HorizontalRule,
  Link,
  TextAlign.configure({
    defaultAlignment: "left",
    alignments: ["left", "right", "center"],
    types: ["heading", "paragraph"],
  })
]

export const ExtensionsForEditor= [
  Document,
  Paragraph,
  Heading,
  Text,
  ListItem,
  BulletList,
  OrderedList,
  Bold,
  Italic,
  Strike,
  HardBreak,
  History,
  Blockquote,
  HorizontalRule,
  Link.configure({
    openOnClick: false
  }),
  TextAlign.configure({
    defaultAlignment: "left",
    alignments: ["left", "right", "center"],
    types: ["heading", "paragraph"],
  })
]