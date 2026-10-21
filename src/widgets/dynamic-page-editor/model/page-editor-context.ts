"use client"

import {createContext, useContext} from "react";
import invariant from "tiny-invariant";

export interface IPageEditorContext {
  selectedId: string | null;
  select: (id: string | null) => void;
  highlightedId: string | null;
  highlight: (id: string | null) => void;
}

export const PageEditorContext = createContext<IPageEditorContext | null>(null);

export function usePageEditor(): IPageEditorContext {
  const context = useContext(PageEditorContext);
  invariant(context, "usePageEditor must be used inside PageEditorContext");
  return context;
}
