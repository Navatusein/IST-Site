"use client"

import {useNavigationProgress} from "@/shared/hooks/use-navigation-progress";
import styles from "./navigation-progress.module.scss";

export default function NavigationProgress() {
  const progress = useNavigationProgress();

  return (
    <div
      className={styles.bar}
      style={{transform: `scaleX(${progress ?? 0})`, opacity: progress == null || progress == 1 ? 0 : 1}}
      aria-hidden
    />
  )
}
