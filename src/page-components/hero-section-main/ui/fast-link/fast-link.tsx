import {Button, Col, Typography} from "antd";
import Link from "next/link";
import {IHeroSectionMainFastLink} from "../../types/type";
import styles from "./fast-link.module.scss";

interface IProps {
  fastLink: IHeroSectionMainFastLink
}

export default function FastLink(props: IProps) {
  return (
    <Link href={props.fastLink.path}>
      <Button type="primary" block className={styles.container}>
        <Typography.Title level={3} className={styles.typography}>
          {props.fastLink.title}
        </Typography.Title>
      </Button>
    </Link>

  )
}
