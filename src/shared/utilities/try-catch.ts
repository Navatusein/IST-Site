export default function tryCatch(func: () => void, fail: any) {
  try {
    return func()
  }
  catch(e) {
    return fail
  }
}