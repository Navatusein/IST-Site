import {KeyboardEvent, SyntheticEvent, useEffect, useRef} from "react";
import {Typography} from "antd";
import {DraggableList} from "@/shared/ui-kit";
import {useMediaQuery} from "@/shared/hooks/use-media-query";
import styles from "./page-outline-item.module.scss";

interface IProps {
  index: number;
  name: string;
  details?: string;
  isActive: boolean;
  onSelect: () => void;
}

const stopPropagation = (event: SyntheticEvent) => event.stopPropagation();

export default function PageOutlineItem(props: IProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const isTouchScreen = useMediaQuery("(hover: none)");

  useEffect(() => {
    if (props.isActive)
      elementRef.current?.scrollIntoView({block: "nearest"});
  }, [props.isActive]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key == "Enter" || event.key == " ") {
      event.preventDefault();
      props.onSelect();
    }
  }

  return (
    <div
      ref={elementRef}
      role="button"
      tabIndex={0}
      aria-current={props.isActive ? "location" : undefined}
      className={`${styles.item} ${props.isActive ? styles.active : ""}`}
      onClick={props.onSelect}
      onKeyDown={onKeyDown}
    >
      {isTouchScreen && (
        <span className={styles.handle} onClick={stopPropagation} onKeyDown={stopPropagation}>
          <DraggableList.Handle size="small"/>
        </span>
      )}
      <span className={styles.number}>{props.index + 1}</span>
      <span className={styles.text}>
        <Typography.Text strong={props.isActive} ellipsis>
          {props.name}
        </Typography.Text>
        {props.details && (
          <Typography.Text type="secondary" ellipsis className={styles.details}>
            {props.details}
          </Typography.Text>
        )}
      </span>
    </div>
  )
}
