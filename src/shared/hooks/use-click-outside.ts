import {RefObject, useEffect} from "react";

export const useClickOutside = (ref: RefObject<HTMLElement | null>, onClickOutside: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (ref.current && !ref.current.contains(target)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}