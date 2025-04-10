import {Edge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

export type DraggableStates = {type: "idle"} |
  {type: "is-dragging"} |
  {type: "preview", container: HTMLElement} |
  {type: "is-dragging-over", closestEdge: Edge | null};