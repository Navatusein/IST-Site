import styles from "./hidden-heading.module.scss";

interface IProps {
  children: string;
}

export default function HiddenHeading(props: IProps) {
  return (
    <h1 className={styles.hidden}>{props.children}</h1>
  )
}
