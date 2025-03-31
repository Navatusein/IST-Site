export default function toPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}