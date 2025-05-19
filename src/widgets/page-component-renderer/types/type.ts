import {JSX} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentType} from "@/page-components";

export type ComponentDescriptorType = {
  [key in PageComponentType]: {
    renderComponent: (componentProps: IBasePageComponent) => JSX.Element;
    renderEditor: (componentProps: IBasePageComponent, onChange: (value: IBasePageComponent) => void) => JSX.Element;
  };
};