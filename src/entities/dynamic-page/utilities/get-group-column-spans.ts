import {IBasePageComponent, IPageComponentGroup, PageGroupColumnSpan} from "../types/type";

export const PAGE_GROUP_GRID_COLUMNS = 12;

export const PAGE_GROUP_COLUMN_SPAN_UNITS: Record<PageGroupColumnSpan, number> = {
  "1/4": 3,
  "1/3": 4,
  "1/2": 6,
  "2/3": 8,
  "3/4": 9,
  "1": 12,
};

export interface IPageGroupCellSpans {
  medium: number;
  large: number;
  wide: number;
}

const FULL = PAGE_GROUP_GRID_COLUMNS;

function getWideSpan(component: IBasePageComponent, count: number): number {
  if (component.columnSpan && PAGE_GROUP_COLUMN_SPAN_UNITS[component.columnSpan])
    return PAGE_GROUP_COLUMN_SPAN_UNITS[component.columnSpan];

  return FULL / Math.min(Math.max(count, 1), 4);
}

function getLines(spans: number[]): number[][] {
  const lines: number[][] = [];
  let width = FULL;

  spans.forEach((span, index) => {
    if (width + span > FULL) {
      lines.push([]);
      width = 0;
    }

    lines.at(-1)!.push(index);
    width += span;
  });

  return lines;
}

function stretchLoneBlocks(spans: number[], aloneWhenWide: Set<number>): number[] {
  const result = [...spans];

  for (const line of getLines(spans)) {
    if (line.length == 1 && !aloneWhenWide.has(line[0]))
      result[line[0]] = FULL;
  }

  return result;
}

export function getGroupCellSpans(group: IPageComponentGroup): IPageGroupCellSpans[] {
  const count = group.components.length;
  const wide = group.components.map((component) => getWideSpan(component, count));

  const aloneWhenWide = new Set(getLines(wide).filter((line) => line.length == 1).map((line) => line[0]));

  const large = stretchLoneBlocks(wide.map((span) => span == 3 ? 6 : span), aloneWhenWide);
  const medium = stretchLoneBlocks(wide.map((span) => span <= 3 || span == 6 ? 6 : FULL), aloneWhenWide);

  return wide.map((span, index) => ({medium: medium[index], large: large[index], wide: span}));
}
