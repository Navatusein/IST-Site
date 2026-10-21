import {Metadata} from "next";
import {NotFoundView} from "@/views/not-found";

export const metadata: Metadata = {title: "Сторінку не знайдено"};

export default function Page() {
  return (
    <NotFoundView/>
  )
}
