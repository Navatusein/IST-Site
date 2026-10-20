"use client"

import {createContext, RefObject} from "react";

export interface IDraggableListContext {
  listId: string;
  horizontal: boolean;
  count: number;
  reorder: (startIndex: number, finishIndex: number) => void;
}

export const DraggableListContext = createContext<IDraggableListContext | null>(null);

export interface IDraggableListItemContext {
  index: number;
  handleRef: RefObject<HTMLElement | null>;
  isDragging: boolean;
}

export const DraggableListItemContext = createContext<IDraggableListItemContext | null>(null);
