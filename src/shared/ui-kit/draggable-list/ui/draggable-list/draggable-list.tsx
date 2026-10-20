"use client"

import {ReactNode, useEffect, useId, useRef} from "react";
import {flushSync} from "react-dom";
import {monitorForElements} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import {extractClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge";
import {getReorderDestinationIndex} from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import {DraggableListContext} from "../../context/draggable-list-context";
import DraggableListItem from "../draggable-list-item/draggable-list-item";
import DraggableHandle from "../draggable-handle/draggable-handle";

interface IProps {
  onReorder: (startIndex: number, finishIndex: number) => void;
  count: number;
  horizontal?: boolean;
  children: ReactNode;
}

export default function DraggableList(props: IProps) {
  const listId = useId();
  const horizontal = props.horizontal == true;

  const onReorderRef = useRef(props.onReorder);
  onReorderRef.current = props.onReorder;

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({source}) => source.data.listId === listId,
      onDrop: ({location, source}) => {
        const target = location.current.dropTargets[0];

        if (!target)
          return;

        const startIndex = source.data.index;
        const indexOfTarget = target.data.index;

        if (typeof startIndex !== "number" || typeof indexOfTarget !== "number")
          return;

        const finishIndex = getReorderDestinationIndex({
          startIndex,
          indexOfTarget,
          closestEdgeOfTarget: extractClosestEdge(target.data),
          axis: horizontal ? "horizontal" : "vertical",
        });

        if (finishIndex === startIndex)
          return;

        flushSync(() => onReorderRef.current(startIndex, finishIndex));
      },
    });
  }, [listId, horizontal]);

  return (
    <DraggableListContext value={{
      listId,
      horizontal,
      count: props.count,
      reorder: (startIndex, finishIndex) => onReorderRef.current(startIndex, finishIndex)
    }}>
      {props.children}
    </DraggableListContext>
  )
}

DraggableList.Item = DraggableListItem;
DraggableList.Handle = DraggableHandle;
