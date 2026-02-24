import {ReactNode, useEffect} from "react";
import {monitorForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {extractClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {flushSync} from "react-dom";
import DraggableListItem from "../draggable-list-item/draggable-list-item";
import {reorderWithEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

interface IProps<T> {
  items: T[];
  setItems: (value: T[]) => void;
  children: ReactNode;
}

export default function DraggableList<T extends {id: string|number}>(props: IProps<T>) {
  useEffect(() => {
    return monitorForElements({
      canMonitor: () => {
        return true;
      },
      onDrop: ({location, source}) => {
        const target = location.current.dropTargets[0];

        if (!target)
          return;

        const sourceData = source.data;
        const targetData = target.data;

        const indexOfSource = props.items.findIndex((x) => x.id === sourceData.id);
        const indexOfTarget = props.items.findIndex((x) => x.id === targetData.id);

        if (indexOfTarget < 0 || indexOfSource < 0)
          return;

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        flushSync(() => {
          props.setItems([...reorderWithEdge({
            list: props.items,
            startIndex: indexOfSource,
            indexOfTarget: indexOfTarget,
            closestEdgeOfTarget: closestEdgeOfTarget,
            axis: "vertical",
          })]);
        });
      },
    });
  }, [props.items]);

  return (
    <>
      {props.children}
    </>
  )
}

DraggableList.Item = DraggableListItem;
