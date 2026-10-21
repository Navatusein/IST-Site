import richTextToPlainText from "@/shared/utilities/rich-text-to-plain-text";

export type BlockChangeStatus = "added" | "removed" | "changed";

export interface IFieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
  isChanged: boolean;
}

export interface IBlockChange {
  id: string;
  status: BlockChangeStatus;
  componentType: string;
  groupId?: string;
  beforeText: string;
  afterText: string;
}

const BLOCK_SETTING_KEYS = new Set([
  "id", "type", "componentType", "width", "columnSpan", "components", "linkType", "layout", "align", "variant",
  "buttonVariant", "fullWidth", "showNumbers", "columns", "aspectRatio", "verticalAlign", "cards", "imageHeight", "icon"
]);

const isRichText = (value: string) => /^\s*\{\s*"type"\s*:\s*"doc"/.test(value);

export function formatFieldValue(value: unknown, skipKeys?: Set<string>): string {
  if (value == null || value === "")
    return "";

  if (skipKeys && (typeof value == "number" || typeof value == "boolean"))
    return "";

  if (typeof value == "boolean")
    return value ? "Так" : "Ні";

  if (typeof value == "string")
    return isRichText(value) ? richTextToPlainText(value) : value;

  if (Array.isArray(value))
    return value.map((item) => formatFieldValue(item, skipKeys)).filter(Boolean).join("\n");

  if (typeof value == "object")
    return Object.entries(value)
      .filter(([key]) => !skipKeys?.has(key))
      .map(([, item]) => formatFieldValue(item, skipKeys))
      .filter(Boolean)
      .join(" · ");

  return String(value);
}

export function compareFields(before: Record<string, unknown> | null, after: Record<string, unknown>, labels: Record<string, string>): IFieldChange[] {
  return Object.entries(labels)
    .filter(([field]) => field != "entities" && (field in after || (before != null && field in before)))
    .map(([field, label]) => {
      const beforeValue = before ? formatFieldValue(before[field]) : "";
      const afterValue = formatFieldValue(after[field]);

      return {field, label, before: beforeValue, after: afterValue, isChanged: before != null && JSON.stringify(before[field]) != JSON.stringify(after[field])};
    });
}

function getBlockText(block: Record<string, unknown>): string {
  return Object.entries(block)
    .filter(([key]) => !BLOCK_SETTING_KEYS.has(key))
    .map(([, value]) => formatFieldValue(value, BLOCK_SETTING_KEYS))
    .filter(Boolean)
    .join("\n");
}

function getBlocks(entities: unknown): Map<string, {block: Record<string, unknown>, groupId?: string}> {
  const blocks = new Map<string, {block: Record<string, unknown>, groupId?: string}>();

  for (const entity of Array.isArray(entities) ? entities : []) {
    blocks.set(String(entity?.id), {block: entity});

    if (entity?.type == "group" && Array.isArray(entity.components)) {
      for (const component of entity.components)
        blocks.set(String(component?.id), {block: component, groupId: String(entity.id)});
    }
  }

  return blocks;
}

export function compareBlocks(beforeEntities: unknown, afterEntities: unknown): IBlockChange[] {
  const before = getBlocks(beforeEntities);
  const after = getBlocks(afterEntities);

  const toChange = (id: string, status: BlockChangeStatus): IBlockChange => {
    const old = before.get(id);
    const current = after.get(id);
    const block = (current ?? old)!.block;

    return {
      id,
      status,
      componentType: block.type == "group" ? "group" : String(block.componentType),
      groupId: (current ?? old)!.groupId,
      beforeText: old ? getBlockText(old.block) : "",
      afterText: current ? getBlockText(current.block) : ""
    };
  }

  const isChanged = (id: string) => {
    const strip = (block: Record<string, unknown>) => JSON.stringify({...block, components: undefined});
    return strip(before.get(id)!.block) != strip(after.get(id)!.block);
  }

  return [
    ...[...after.keys()].flatMap((id) => (
      !before.has(id) ? [toChange(id, "added")] : isChanged(id) ? [toChange(id, "changed")] : []
    )),
    ...[...before.keys()].filter((id) => !after.has(id)).map((id) => toChange(id, "removed"))
  ];
}
