import {ColProps} from "antd";
import {IPageComponentGroup} from "../types/type";

export function getGroupColumnSpans(group: IPageComponentGroup): ColProps[] {
  const count = group.components.length;

  if (count == 0)
    return [];

  let spans = Array<number>(count).fill(Math.floor(24 / count));

  if (count == 2 && group.proportions == "1:2")
    spans = [8, 16];

  if (count == 2 && group.proportions == "2:1")
    spans = [16, 8];

  return spans.map((span) => ({
    xs: 24,
    sm: count >= 3 ? 12 : 24,
    md: span
  }));
}
