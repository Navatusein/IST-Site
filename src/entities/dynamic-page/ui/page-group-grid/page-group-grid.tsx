"use client"

import {CSSProperties, ReactNode} from "react";
import {theme} from "antd";
import {IBasePageComponent, IPageComponentGroup} from "../../types/type";
import {getGroupCellSpans} from "../../utilities/get-group-column-spans";
import styles from "./page-group-grid.module.scss";

interface IProps {
  group: IPageComponentGroup;
  renderCell: (component: IBasePageComponent, index: number) => ReactNode;
  rowGap?: number;
}

// Cards stretch to the tallest one in their line and align their content inside
function getAlignItems(group: IPageComponentGroup): string {
  if (group.cards)
    return "stretch";

  return group.verticalAlign == "center" ? "center" : "start";
}

export default function PageGroupGrid(props: IProps) {
  const {token: {padding}} = theme.useToken();

  const spans = getGroupCellSpans(props.group);

  return (
    <div className={styles.layout}>
      <div
        className={styles.grid}
        style={{
          "--page-group-row-gap": `${props.rowGap ?? padding}px`,
          "--page-group-column-gap": `${padding}px`,
          "--page-group-align": getAlignItems(props.group),
        } as CSSProperties}
      >
        {props.group.components.map((component, index) => (
          <div
            key={component.id}
            className={styles.cell}
            style={{
              "--page-group-span-medium": spans[index].medium,
              "--page-group-span-large": spans[index].large,
              "--page-group-span-wide": spans[index].wide,
            } as CSSProperties}
          >
            {props.renderCell(component, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
