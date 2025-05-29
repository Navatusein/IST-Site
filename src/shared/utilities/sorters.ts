import dayjs from "dayjs";

export function stringSorter(a: string = "", b: string = "") {
  return a.localeCompare(b)
}

export function dateStringSorter(a: string, b: string) {
  return dayjs(a).diff(b)
}