"use client"

import dynamic from "next/dynamic";
import {useState} from "react";
import {Card, Checkbox, Flex, Segmented, theme, Tooltip} from "antd";
import {ComponentCol} from "@/shared/ui-kit";


const Component = dynamic(() => import("@/app/(router)/(public-pages)/test/component/component"), {
  ssr: false
});

export default function Page() {
  const {token: {padding}} = theme.useToken();

  const [componentWidth, setComponentWidth] = useState<"medium"|"large"|"small">("medium");
  const [marginTop, setMarginTop] = useState<number|undefined>(padding);

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding, marginTop: marginTop}}>
      <ComponentCol width={componentWidth}>
        <Component width={componentWidth}/>
      </ComponentCol>
      <Card variant="borderless" size="small" style={{width: "fit-content", alignSelf: "center"}}>
       <Flex gap="small" align="center">
         <Tooltip title="Змінити розмір блоку">
           <Segmented
             options={[
               {value: "large", label: "Великий"},
               {value: "medium", label: "Середній"},
               {value: "small", label: "Маленький"},
             ]}
             value={componentWidth}
             onChange={setComponentWidth}
           />
         </Tooltip>
         <Tooltip title="Відступ з верху">
           <Checkbox
             checked={marginTop == padding}
             onChange={(event) => setMarginTop(() => event.target.checked ? padding : undefined)}
           >
             Відступ з верху
           </Checkbox>
         </Tooltip>
       </Flex>
      </Card>
    </Flex>
  )
}