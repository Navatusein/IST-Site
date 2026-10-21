"use client"

import {IPageComponentGroup} from "../../types/type";
import PageComponentRenderer from "../page-component-renderer/page-component-renderer";
import PageGroupCell from "../page-group-cell/page-group-cell";
import PageGroupGrid from "../page-group-grid/page-group-grid";
import {ComponentCol} from "@/shared/ui-kit";
import type {PageComponentsData} from "../../model";

interface IProps {
  group: IPageComponentGroup;
  componentsData?: PageComponentsData;
}

export default function PageGroupRenderer(props: IProps) {
  if (props.group.components.length == 0)
    return null;

  return (
    <ComponentCol width={props.group.width}>
      <PageGroupGrid
        group={props.group}
        renderCell={(component) => (
          <PageGroupCell group={props.group}>
            <PageComponentRenderer
              component={component}
              data={props.componentsData?.[component.id]}
              inline
            />
          </PageGroupCell>
        )}
      />
    </ComponentCol>
  )
}
