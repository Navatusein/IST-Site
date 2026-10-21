import {MouseEvent, ReactNode} from "react";
import {usePageEditor} from "../../context/page-editor-context";
import styles from "./editor-block-frame.module.scss";

interface IProps {
  id: string;
  label: string;
  toolbar: ReactNode;
  kind?: "block" | "row";
  fill?: boolean;
  children: ReactNode;
}

const handledClicks = new WeakSet<Event>();

export function markClickHandled(event: MouseEvent): boolean {
  if (handledClicks.has(event.nativeEvent))
    return false;

  handledClicks.add(event.nativeEvent);
  return true;
}

export default function EditorBlockFrame(props: IProps) {
  const editor = usePageEditor();

  const onClick = (event: MouseEvent) => {
    if (markClickHandled(event))
      editor.select(props.id);
  }

  return (
    <div
      className={styles.frame}
      data-editor-frame-id={props.id}
      data-kind={props.kind ?? "block"}
      data-fill={props.fill == true}
      data-selected={editor.selectedId == props.id}
      data-highlighted={editor.highlightedId == props.id}
      onClick={onClick}
    >
      <span className={styles.label} aria-hidden>{props.label}</span>
      <div className={styles.toolbarAnchor}>
        <div className={styles.toolbar} role="toolbar" aria-label={props.label}>
          <span className={styles.toolbarLabel} title={props.label}>{props.label}</span>
          {props.toolbar}
        </div>
      </div>
      {props.children}
    </div>
  )
}
