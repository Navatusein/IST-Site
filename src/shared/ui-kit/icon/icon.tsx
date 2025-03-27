import {Image, Space, Typography} from "antd";

interface IProps {
  showText: boolean;
}

export default function Icon(props: IProps) {
  return (
    <Space align="center" direction="horizontal" style={{padding: "8px", height: "64px", overflow: "hidden"}}>
      <Image src={"/icon.png"} width={48} preview={false}/>
      {props.showText &&
        <Typography.Text strong style={{margin: 0}}>
          КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ
        </Typography.Text>
      }
    </Space>
  )
}