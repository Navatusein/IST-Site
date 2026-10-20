import {reorder} from "@atlaskit/pragmatic-drag-and-drop/utils/reorder";

export function moveItem<T>(list: T[], startIndex: number, finishIndex: number): T[] {
  return reorder({list, startIndex, finishIndex});
}
