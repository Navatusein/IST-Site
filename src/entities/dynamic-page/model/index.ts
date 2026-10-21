import {createPageComponent, definePageComponent} from "./page-component-descriptor";
import type {
  AnyPageComponentDescriptor,
  IPageComponentCategory,
  IPageComponentDescriptor,
  IPageComponentEditorProps,
  IPageComponentViewProps,
  PageComponentCategoryName,
  PageComponentsData
} from "./page-component-descriptor";
import {PageComponentRegistryContext, usePageComponentRegistry} from "./page-component-registry";
import type {IPageComponentRegistry} from "./page-component-registry";
import {usePageComponentData} from "../hooks/use-page-component-data";

export type {
  AnyPageComponentDescriptor,
  IPageComponentCategory,
  IPageComponentDescriptor,
  IPageComponentEditorProps,
  IPageComponentViewProps,
  IPageComponentRegistry,
  PageComponentCategoryName,
  PageComponentsData
};
export {
  createPageComponent,
  definePageComponent,
  PageComponentRegistryContext,
  usePageComponentRegistry,
  usePageComponentData
};
