import {IRevisionBlocksChange} from "@/shared/types/revision";

export function describeBlocks(blocks: IRevisionBlocksChange): string {
  const parts = [
    blocks.added && `додано ${blocks.added}`,
    blocks.changed && `змінено ${blocks.changed}`,
    blocks.removed && `видалено ${blocks.removed}`,
  ].filter(Boolean);

  return parts.length ? `Блоки: ${parts.join(", ")}` : "Блоки: змінено порядок";
}

export function describeChanges(changedFields: string[], blocks: IRevisionBlocksChange | undefined, fieldLabels: Record<string, string>): string[] {
  const labels = changedFields.map((field) => fieldLabels[field]);

  return [
    ...labels.filter((label): label is string => label != null),
    ...(labels.some((label) => label == null) ? ["Інші поля"] : []),
    ...(blocks ? [describeBlocks(blocks)] : [])
  ];
}
