import {IBasePageComponent, IPageComponentGroup, PageGroupColumnSpan} from "../types/type";

// The layout is a 12-column grid: ¼ = 3, ⅓ = 4, ½ = 6, ⅔ = 8, ¾ = 9
export const PAGE_GROUP_GRID_COLUMNS = 12;

export const PAGE_GROUP_COLUMN_SPAN_UNITS: Record<PageGroupColumnSpan, number> = {
  "1/4": 3,
  "1/3": 4,
  "1/2": 6,
  "2/3": 8,
  "3/4": 9,
  "1": 12,
};

// Spans of a block at each layout width step (the layout's own width, chosen with container queries
// in page-group-grid.module.scss); below the first step every block takes the whole line
export interface IPageGroupCellSpans {
  medium: number;
  large: number;
  wide: number;
}

const FULL = PAGE_GROUP_GRID_COLUMNS;

// Width of a block on a wide layout: its own span, or an equal share of the line (at most 4 per line)
function getWideSpan(component: IBasePageComponent, count: number): number {
  if (component.columnSpan && PAGE_GROUP_COLUMN_SPAN_UNITS[component.columnSpan])
    return PAGE_GROUP_COLUMN_SPAN_UNITS[component.columnSpan];

  return FULL / Math.min(Math.max(count, 1), 4);
}

// Index ranges of the lines the spans wrap into
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

// A block left alone on a half-filled line by a narrower step stretches to the whole line (no gap on the right),
// unless it is alone on its line on a wide layout too, which the editor set on purpose
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

  // Quarters become halves; on a medium layout thirds and wider take a whole line
  const large = stretchLoneBlocks(wide.map((span) => span == 3 ? 6 : span), aloneWhenWide);
  const medium = stretchLoneBlocks(wide.map((span) => span <= 3 || span == 6 ? 6 : FULL), aloneWhenWide);

  return wide.map((span, index) => ({medium: medium[index], large: large[index], wide: span}));
}
