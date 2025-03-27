export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    fetch("http://localhost:3000/api/init")
      .then(async response => {
        console.log(await response.json());
      })
      .catch(error => {
        console.error(error);
      })
  }
}
