import RichText from "./ui/rich-text/rich-text";
import {IRichTextPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";
import getRichTextHeadings from "@/shared/utilities/rich-text-headings";

const RichTextEditor = dynamic(() => import("./ui/rich-text-editor/rich-text-editor"), {loading: () => <Skeleton active/>});

export type {IRichTextPageComponent};

export const richTextPageComponent = definePageComponent<IRichTextPageComponent>({
  type: "rich-text",
  name: "Текст",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "small",
    text: "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Текст\"}]}]}"
  },
  View: RichText,
  getMainHeadings: (component) => getRichTextHeadings(component.text, 1),
  Editor: RichTextEditor
});
