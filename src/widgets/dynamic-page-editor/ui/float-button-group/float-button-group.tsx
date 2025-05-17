import {FloatButton} from "antd";
import {SettingOutlined, ToTopOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FloatButtonGroup(props: IProps) {
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"})
  }

  const scrollToBottom = () => {
    window.scrollTo({top: 9999999, behavior: "smooth"})
  }

  const openDrawer = () => {
    props.setIsDrawerOpen(() => true);
  }

  return (
    <FloatButton.Group shape="circle" style={{insetInlineEnd: 24}}>
      <FloatButton icon={<ToTopOutlined/>} onClick={scrollToTop}/>
      <FloatButton icon={<VerticalAlignBottomOutlined/>} onClick={scrollToBottom}/>
      <FloatButton type="primary" icon={<SettingOutlined/>} onClick={openDrawer}/>
    </FloatButton.Group>
  )
}
