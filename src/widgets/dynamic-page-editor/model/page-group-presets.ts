import {IBasePageComponent, IPageComponentGroup, PageEntityWidth, PageGroupColumnSpan} from "@/entities/dynamic-page";
import {EmptyPageComponentGroup} from "@/entities/dynamic-page/types/type";
import {createPageComponent, IPageComponentRegistry} from "@/entities/dynamic-page/model";

export interface IPageGroupPreset {
  key: string;
  name: string;
  description: string;
  create: (registry: IPageComponentRegistry) => IPageComponentGroup;
}

const CARD_TEXT = JSON.stringify({
  type: "doc",
  content: [
    {type: "heading", attrs: {level: 4}, content: [{type: "text", text: "Заголовок"}]},
    {type: "paragraph", content: [{type: "text", text: "Короткий опис картки."}]}
  ]
});

function createCell(registry: IPageComponentRegistry, type: string, columnSpan: PageGroupColumnSpan, fields?: object): IBasePageComponent[] {
  const descriptor = registry.getDescriptor(type);

  if (!descriptor)
    return [];

  return [{...createPageComponent(descriptor), ...fields, id: crypto.randomUUID(), columnSpan}];
}

function createGroup(width: PageEntityWidth, cards: boolean, components: IBasePageComponent[]): IPageComponentGroup {
  return {...structuredClone(EmptyPageComponentGroup), width, cards, components};
}

function createCards(registry: IPageComponentRegistry, width: PageEntityWidth, spans: PageGroupColumnSpan[]): IPageComponentGroup {
  return createGroup(width, true, spans.flatMap((span) => createCell(registry, "rich-text", span, {text: CARD_TEXT})));
}

// Ready-made layouts for the "add block" drawer; after adding, everything in them can be changed
export const PAGE_GROUP_PRESETS: IPageGroupPreset[] = [
  {
    key: "group",
    name: "Розмітка",
    description: "Порожня, блоки поруч",
    create: () => createGroup("medium", false, [])
  },
  {
    key: "text-and-image",
    name: "Текст і фото",
    description: "⅔ + ⅓",
    create: (registry) => createGroup("medium", false, [
      ...createCell(registry, "rich-text", "2/3"),
      ...createCell(registry, "image", "1/3"),
    ])
  },
  {
    key: "cards-2",
    name: "2 картки",
    description: "½ + ½",
    create: (registry) => createCards(registry, "medium", ["1/2", "1/2"])
  },
  {
    key: "cards-3",
    name: "3 картки",
    description: "⅓ + ⅓ + ⅓",
    create: (registry) => createCards(registry, "large", ["1/3", "1/3", "1/3"])
  },
  {
    key: "cards-2-1",
    name: "2 + 1 картки",
    description: "½ + ½, під ними на всю ширину",
    create: (registry) => createCards(registry, "medium", ["1/2", "1/2", "1"])
  },
  {
    key: "cards-4",
    name: "4 картки",
    description: "¼ × 4",
    create: (registry) => createCards(registry, "large", ["1/4", "1/4", "1/4", "1/4"])
  },
];
