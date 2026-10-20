import {MouseEvent, PointerEvent, ThHTMLAttributes, useRef} from "react";
import styles from "./resizable-header-cell.module.scss";

export const MIN_COLUMN_WIDTH = 60;

export interface IResizableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  onResize?: (width: number) => void;
  onResetWidth?: () => void;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export default function ResizableHeaderCell({onResize, onResetWidth, children, ...props}: IResizableHeaderCellProps) {
  const cellRef = useRef<HTMLTableCellElement>(null);

  if (!onResize)
    return <th {...props}>{children}</th>;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button != 0)
      return;

    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget;
    const startX = event.clientX;
    const startWidth = cellRef.current?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH;
    let frame = 0;

    handle.setPointerCapture(event.pointerId);
    document.body.classList.add(styles.resizing);

    const move = (moveEvent: globalThis.PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => onResize(Math.max(MIN_COLUMN_WIDTH, Math.round(startWidth + moveEvent.clientX - startX))));
    };

    const end = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
      document.body.classList.remove(styles.resizing);
    };

    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };

  return (
    <th {...props} ref={cellRef} className={`${props.className ?? ""} ${styles.cell}`}>
      {children}
      <div
        className={styles.handle}
        role="separator"
        aria-orientation="vertical"
        title="Перетягніть, щоб змінити ширину. Подвійний клік повертає типову"
        onPointerDown={onPointerDown}
        onClick={stopPropagation}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onResetWidth?.();
        }}
      />
    </th>
  );
}
