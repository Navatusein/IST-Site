import normalizeUrl from "normalize-url";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    fetch(normalizeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/init`))
      .then(async response => {
        console.log(await response.json());
      })
      .catch(error => {
        console.error(error);
      })
  }
}
