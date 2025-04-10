import {Button, Dropdown} from "antd";
import {HolderOutlined} from "@ant-design/icons";

interface IProps {

}

export default function DraggableHandler(props: IProps) {
  return (
    <Dropdown>
      <Button type="text" icon={<HolderOutlined/>}/>
    </Dropdown>
  )
}
