import {JSX} from "react";
import {IBasePageComponent, PageComponentType} from "@/entities/dynamic-page";

export type ComponentDescriptorType = {
  [key in PageComponentType]: {
    renderComponent: (propsClass: IBasePageComponent) => JSX.Element;
    renderEditor: (propsClass: IBasePageComponent, onChange: (value: IBasePageComponent) => void) => JSX.Element;
  };
};