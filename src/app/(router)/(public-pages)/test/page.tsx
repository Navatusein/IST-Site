"use client"

import dynamic from "next/dynamic";
import Component from "./component/component";
import {useState} from "react";
import {Button, Card, Checkbox, Col, Flex, Segmented, theme, Tooltip} from "antd";
import {ArrowsAltOutlined, DeleteOutlined, EditOutlined, HolderOutlined, ShrinkOutlined} from "@ant-design/icons";


// const Component = dynamic(() => import("@/app/(router)/(public-pages)/test/component/component"), {
//   ssr: false
// });

const config = {
  "medium": {
    sm: {span: 24, offset: 0},
    md: {span: 20, offset: 2},
    lg: {span: 18, offset: 4},
    xl: {span: 14, offset: 5},
    xxl: {span: 12, offset: 6},
  },
  "large": {
    span: 24
  }
}

export default function Page() {
  const {token: {padding}} = theme.useToken();

  const [componentWidth, setComponentWidth] = useState<"medium"|"large">("medium");
  const [marginTop, setMarginTop] = useState<number|undefined>(padding);

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding, marginTop: marginTop}}>
      <Col {...config[componentWidth]}>
        <div style={{margin: componentWidth != "large" ? `0 ${padding}px` : "unset"}}>
          <Component width={componentWidth}/>
        </div>
      </Col>
      <Card variant="borderless" size="small" style={{width: "fit-content", alignSelf: "center"}}>
       <Flex gap="small" align="center">
         <Tooltip title="Змінити розмір блоку">
           <Segmented
             options={[
               {value: "large", icon: <ArrowsAltOutlined/>, label: "Великий"},
               {value: "medium", icon: <ShrinkOutlined/>, label: "Середній"}
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