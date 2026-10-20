"use client"

import {ReactNode} from "react";
import {PageComponentRegistryContext} from "@/entities/dynamic-page/model";
import {pageComponentRegistry} from "@/app/page-components/registry";

interface IProps {
  children: ReactNode;
}

export default function PageComponentRegistryProvider(props: IProps) {
  return (
    <PageComponentRegistryContext value={pageComponentRegistry}>
      {props.children}
    </PageComponentRegistryContext>
  );
}
