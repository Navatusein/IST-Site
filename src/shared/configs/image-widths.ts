export const IMAGE_WIDTHS = [320, 640, 960, 1280, 1920] as const;

export type ImageWidth = typeof IMAGE_WIDTHS[number];

export function isImageWidth(value: number): value is ImageWidth {
  return (IMAGE_WIDTHS as readonly number[]).includes(value);
}

// Image `sizes` for a block of each width (ComponentCol)
export const BLOCK_IMAGE_SIZES = {
  small: "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw",
  medium: "(max-width: 992px) 100vw, 85vw",
  large: "100vw"
} as const;
