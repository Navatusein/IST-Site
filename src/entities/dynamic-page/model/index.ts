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
import {getPageMainHeadings} from "./page-main-headings";
import type {IPageMainHeading} from "./page-main-headings";

export type {
  AnyPageComponentDescriptor,
  IPageComponentCategory,
  IPageComponentDescriptor,
  IPageComponentEditorProps,
  IPageComponentViewProps,
  IPageComponentRegistry,
  IPageMainHeading,
  PageComponentCategoryName,
  PageComponentsData
};
export {
  createPageComponent,
  definePageComponent,
  getPageMainHeadings,
  PageComponentRegistryContext,
  usePageComponentRegistry,
  usePageComponentData
};
