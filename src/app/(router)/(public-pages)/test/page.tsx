"use client"

import dynamic from "next/dynamic";
import Component from "./component/component";


// const Component = dynamic(() => import("@/app/(router)/(public-pages)/test/component/component"), {
//   ssr: false
// });

export default function Page() {
  return (
    <Component/>
  )
}