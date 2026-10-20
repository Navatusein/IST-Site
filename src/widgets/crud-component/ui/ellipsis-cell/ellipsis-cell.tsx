import {MouseEvent, ReactNode, useState} from "react";
import {Tooltip} from "antd";

interface IProps {
  children: ReactNode;
}

export default function EllipsisCell(props: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onMouseEnter = (event: MouseEvent<HTMLElement>) => {
    const cell = event.currentTarget.closest("td");
    setIsOpen(() => cell != null && cell.scrollWidth > cell.clientWidth);
  }

  return (
    <Tooltip title={props.children} placement="topLeft" open={isOpen}>
      <span onMouseEnter={onMouseEnter} onMouseLeave={() => setIsOpen(() => false)}>
        {props.children}
      </span>
    </Tooltip>
  )
}
