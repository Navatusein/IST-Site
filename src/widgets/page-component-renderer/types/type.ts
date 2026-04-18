import {JSX} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentType} from "@/page-components";

export type ComponentDescriptorType = {
  [key in PageComponentType]: {
    renderComponent: (component: IBasePageComponent) => JSX.Element;
    renderEditor: (component: IBasePageComponent, onChange: (value: IBasePageComponent) => void) => JSX.Element;
  };
};