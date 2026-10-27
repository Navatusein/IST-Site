import {IMAGE_WIDTHS, ImageWidth} from "@/shared/configs/image-widths";


export function getFileAssetUrl(slug: string): string;
export function getFileAssetUrl(slug: string | null | undefined): string | undefined;
export function getFileAssetUrl(slug: string | null | undefined): string | undefined {
  return slug ? `/api/assets/${encodeURIComponent(slug)}` : undefined;
}

export function getFileImageUrl(slug: string, width: ImageWidth): string {
  return `${getFileAssetUrl(slug)}?w=${width}`;
}

export interface IFileImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
}

export function getFileImageProps(slug: string | null | undefined, sizes: string, fallback = "/missing-image.webp"): IFileImageProps {
  if (!slug)
    return {src: fallback};

  return {
    src: getFileImageUrl(slug, 1280),
    srcSet: IMAGE_WIDTHS.map((width) => `${getFileImageUrl(slug, width)} ${width}w`).join(", "),
    sizes
  };
}

export function getFileNamedAssetUrl(slug: string, name: string): string {
  return `${getFileAssetUrl(slug)}/${encodeURIComponent(name)}`;
}

export function getFileDownloadUrl(slug: string): string {
  return `${getFileAssetUrl(slug)}?download`;
}

export function getFileViewUrl(slug: string): string {
  return `/file/${encodeURIComponent(slug)}`;
}

export const FILES_UPLOAD_URL = "/api/files/upload";
export const FILES_IMPORT_URL = "/api/files/import";

export function getFilesArchiveUrl(slugs: string[], isExport: boolean = false): string {
  const params = new URLSearchParams();

  if (slugs.length != 0)
    params.set("slugs", slugs.join(","));

  return `/api/files/archive?${params}${isExport ? "&export" : ""}`;
}
