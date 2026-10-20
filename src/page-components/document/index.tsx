import DocumentView from "./ui/document/document";
import {DocumentAspectRatio, IDocumentPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import type {PageLinkFiles} from "@/features/page-link";
import {getPageLinkFilesAction} from "@/features/page-link/actions/actions";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const DocumentEditor = dynamic(() => import("./ui/document-editor/document-editor"), {loading: () => <Skeleton active/>});

export type {DocumentAspectRatio, IDocumentPageComponent};

export const documentPageComponent = definePageComponent<IDocumentPageComponent, PageLinkFiles>({
  type: "document",
  name: "Документ",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "medium",
    fileSlug: undefined,
    title: undefined,
    aspectRatio: "auto",
    showFileBar: true
  },
  View: DocumentView,
  Editor: DocumentEditor,
  loadData: (component) => getPageLinkFilesAction(component.fileSlug ? [component.fileSlug] : [])
});
