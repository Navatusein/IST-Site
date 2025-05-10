import {JSX} from "react";
import {IBasePageComponent, PageComponentType} from "@/entities/dynamic-page";

export type ComponentDescriptorType = {
  [key in PageComponentType]: {
    renderComponent: (componentProps: IBasePageComponent) => JSX.Element;
    renderEditor: (componentProps: IBasePageComponent, onChange: (value: IBasePageComponent) => void) => JSX.Element;
  };
};