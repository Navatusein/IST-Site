"use client"

import {CSSProperties, ReactNode, RefObject, useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Flex} from "antd";
import invariant from "tiny-invariant";
import {draggable, dropTargetForElements, ElementDropTargetEventBasePayload} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import {combine} from "@atlaskit/pragmatic-drag-and-drop/utils/combine";
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview";
import {pointerOutsideOfPreview} from "@atlaskit/pragmatic-drag-and-drop/utils/pointer-outside-of-preview";
import {attachClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge";
import {extractClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge";
import {Edge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import DropIndicator from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {DraggableStates} from "../../types/type";
import {DraggableListContext, DraggableListItemContext} from "../../context/draggable-list-context";

interface IProps {
  index: number;
  children: ReactNode;
  renderPreview?: () => ReactNode;
  dragHandlerRef?: RefObject<HTMLElement | null>;
  gap?: string;
  id?: string;
  style?: CSSProperties;
  // Stretch to the height of the parent (e.g. equal-height cells of a line)
  fill?: boolean;
}

export default function DraggableListItem(props: IProps) {
  const list = useContext(DraggableListContext);
  invariant(list, "DraggableList.Item must be rendered inside DraggableList");

  const elementRef = useRef<HTMLDivElement>(null);
  const ownHandleRef = useRef<HTMLElement>(null);

  const [state, setState] = useState<DraggableStates>({type: "idle"});
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const renderPreviewRef = useRef(props.renderPreview);
  renderPreviewRef.current = props.renderPreview;

  useEffect(() => {
    const element = elementRef.current;
    const dragHandle = props.dragHandlerRef?.current ?? ownHandleRef.current ?? undefined;

    invariant(element);

    const itemData = {listId: list.listId, index: props.index};

    const onChange = ({source, self}: ElementDropTargetEventBasePayload) => {
      const sourceIndex = source.data.index;

      invariant(typeof sourceIndex === "number");

      if (sourceIndex === props.index) {
        setClosestEdge(null);
        return;
      }

      const edge = extractClosestEdge(self.data);

      const isNoOpDrop =
        (props.index === sourceIndex - 1 && edge === (list.horizontal ? "right" : "bottom")) ||
        (props.index === sourceIndex + 1 && edge === (list.horizontal ? "left" : "top"));

      setClosestEdge(isNoOpDrop ? null : edge);
    }

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => itemData,
        onGenerateDragPreview: ({nativeSetDragImage}) => {
          if (!renderPreviewRef.current)
            return;

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({x: "16px", y: "8px"}),
            render: ({container}) => {
              setState({type: "preview", container});
              return () => setState({type: "is-dragging"});
            },
          });
        },
        onDragStart: () => setState({type: "is-dragging"}),
        onDrop: () => setState({type: "idle"}),
      }),
      dropTargetForElements({
        element,
        canDrop: ({source}) => source.data.listId === list.listId,
        getData: ({input}) => attachClosestEdge(itemData, {
          element,
          input,
          allowedEdges: list.horizontal ? ["left", "right"] : ["top", "bottom"],
        }),
        getIsSticky: () => true,
        onDragEnter: onChange,
        onDrag: onChange,
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    );
  }, [props.index, props.dragHandlerRef, list.listId, list.horizontal]);

  const isDragging = state.type == "is-dragging" || state.type == "preview";

  return (
    <DraggableListItemContext value={{index: props.index, handleRef: ownHandleRef, isDragging}}>
      <Flex vertical ref={elementRef} id={props.id} style={{position: "relative", ...(props.fill && {height: "100%"}), ...props.style}}>
        <div style={{opacity: isDragging ? 0.4 : 1, ...(props.fill && {flexGrow: 1, display: "flex", flexDirection: "column"})}}>
          {props.children}
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} gap={props.gap}/>}
        {state.type === "preview" && createPortal(props.renderPreview?.(), state.container)}
      </Flex>
    </DraggableListItemContext>
  )
}
