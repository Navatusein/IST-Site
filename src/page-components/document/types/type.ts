import {IBasePageComponent} from "@/entities/dynamic-page";

export type DocumentAspectRatio = "auto" | "a4" | "16/9" | "4/3";

export interface IDocumentPageComponent extends IBasePageComponent {
  componentType: "document";
  fileSlug?: string;
  title?: string;
  aspectRatio: DocumentAspectRatio;
  showFileBar: boolean;
}
