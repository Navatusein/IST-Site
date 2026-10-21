import {IPageComponentGroup} from "@/entities/dynamic-page";

function pluralizeBlocks(count: number): string {
  const lastDigit = count % 10;
  const isTeen = count % 100 >= 11 && count % 100 <= 14;

  if (lastDigit == 1 && !isTeen)
    return "блок";

  return lastDigit >= 2 && lastDigit <= 4 && !isTeen ? "блоки" : "блоків";
}

export function getPageGroupLabel(group: IPageComponentGroup): string {
  const name = group.cards ? "Розмітка з картками" : "Розмітка";
  const count = group.components.length;

  return count == 0 ? `${name} · порожня` : `${name} · ${count} ${pluralizeBlocks(count)}`;
}
