import {CSSProperties, ReactNode, RefObject, useEffect, useRef, useState} from "react";
import {draggable, dropTargetForElements, ElementDropTargetEventBasePayload} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {combine} from "@atlaskit/pragmatic-drag-and-drop/combine";
import {attachClosestEdge, extractClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import {DraggableStates} from "../../types/type";
import {createPortal} from "react-dom";
import DropIndicator from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {Flex} from "antd";
import {Edge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

interface IProps<T> {
  dragHandlerRef?: RefObject<HTMLButtonElement|null>;
  item: T;
  index: number;
  renderPreview: (item: T) => ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}

export default function DraggableListItem<T extends {id: string|number}>(props: IProps<T>) {
  const elementRef = useRef<HTMLElement>(null);

  const [state, setState] = useState<DraggableStates>({type: "idle"});
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    const dragHandler = props.dragHandlerRef != null ? props.dragHandlerRef.current : element;

    invariant(element);
    invariant(dragHandler);

    const onChange = ({source, self}: ElementDropTargetEventBasePayload) => {
      const isSource = source.element === dragHandler;

      if (isSource) {
        setClosestEdge(null);
        return;
      }

      const closestEdge = extractClosestEdge(self.data);

      const sourceIndex = source.data.index;

      invariant(typeof sourceIndex === "number");

      const isItemBeforeSource = props.index === sourceIndex - 1;
      const isItemAfterSource = props.index === sourceIndex + 1;

      const isDropIndicatorHidden =
        (isItemBeforeSource && closestEdge === "bottom") ||
        (isItemAfterSource && closestEdge === "top");

      if (isDropIndicatorHidden) {
        setClosestEdge(null);
        return;
      }

      setClosestEdge(closestEdge);
    }

    return combine(
      draggable({
        element: dragHandler,
        getInitialData: () => ({id: props.item.id, index: props.index}),
        // onGenerateDragPreview: ({nativeSetDragImage}) => {
        //   setCustomNativeDragPreview({
        //     nativeSetDragImage,
        //     getOffset: pointerOutsideOfPreview({x: "16px", y: "8px"})
        //   });
        // },
        onDragStart: () => setState({type: "is-dragging"}),
        onDrop: () => setState({type: "idle"}),
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({source}) => (source.element !== element),
        getData: ({input}) => {
          const data = {id: props.item.id, index: props.index};
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragEnter: onChange,
        onDrag: onChange,
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    );
  }, [props.item, props.index]);

  return (
    <Flex vertical ref={elementRef} style={{position: "relative", ...props.style}}>
      <div style={{opacity: state.type == "is-dragging" ? "0.7" : "1"}}>
        {props.children}
      </div>
      {closestEdge && <DropIndicator edge={closestEdge}/>}
      {state.type === "preview" && createPortal(<div>asd</div>, state.container)}
    </Flex>
  )
}
