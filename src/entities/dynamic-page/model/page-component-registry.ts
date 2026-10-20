"use client"

import {createContext, useContext} from "react";
import {AnyPageComponentDescriptor, IPageComponentCategory} from "./page-component-descriptor";

export interface IPageComponentRegistry {
  components: AnyPageComponentDescriptor[];
  categories: IPageComponentCategory[];
  getDescriptor: (componentType: string) => AnyPageComponentDescriptor | undefined;
}

export const PageComponentRegistryContext = createContext<IPageComponentRegistry | null>(null);

export function usePageComponentRegistry(): IPageComponentRegistry {
  const registry = useContext(PageComponentRegistryContext);

  if (!registry)
    throw new Error("PageComponentRegistryContext is not provided");

  return registry;
}
