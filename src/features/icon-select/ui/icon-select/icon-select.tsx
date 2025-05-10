import {Flex, Select} from "antd";
import * as AntIcons from '@ant-design/icons';
import {useMemo} from "react";

interface IProps {}

export default function IconSelect(props: IProps) {
  const options = useMemo(() => {
    const iconNames = Object.keys(AntIcons).filter(name => name.endsWith("Outlined"));
    return iconNames.map((icon) => {
      // @ts-ignore
      const IconComponent = (AntIcons as any)[icon] as JSX

      return {
        value: icon,
        label: (
          <Flex gap="small">
            <IconComponent/> {icon.replaceAll("Outlined", "")}
          </Flex>
        )
      }
    })
  }, []);

  return (
    <Select options={options} showSearch {...props}/>
  )
}
