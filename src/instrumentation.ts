import axios from "axios";
import {error} from "next/dist/build/output/log";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    axios.get("http://localhost:3000/api/init")
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error.response.data);
      });
  }
}