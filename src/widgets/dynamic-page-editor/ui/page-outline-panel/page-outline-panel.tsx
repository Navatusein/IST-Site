import {CSSProperties, ReactNode, useEffect, useState} from "react";
import {Typography} from "antd";
import styles from "./page-outline-panel.module.scss";

interface IProps {
  open: boolean;
  topOffset: number;
  children: ReactNode;
  footer?: ReactNode;
}

export default function PageOutlinePanel(props: IProps) {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsAnimated(() => true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <aside
      className={`${styles.panel} ${isAnimated ? styles.animated : ""}`}
      data-open={props.open}
      aria-hidden={!props.open}
      aria-label="Структура сторінки"
      style={{"--outline-top": `${props.topOffset}px`} as CSSProperties}
    >
      <Typography.Text strong className={styles.title}>
        Структура сторінки
      </Typography.Text>
      <div className={styles.list}>
        {props.children}
      </div>
      {props.footer && (
        <div className={styles.footer}>
          {props.footer}
        </div>
      )}
    </aside>
  )
}
