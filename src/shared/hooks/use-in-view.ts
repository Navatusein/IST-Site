import {RefObject, useEffect, useState} from "react";

interface IOptions {
  once?: boolean;
  threshold?: number;
}

export function useInView(ref: RefObject<Element | null>, options: IOptions = {}): boolean {
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;

    if (!element)
      return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(() => entry.isIntersecting);

      if (entry.isIntersecting && options.once)
        observer.disconnect();
    }, {threshold: options.threshold ?? 0});

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options.once, options.threshold]);

  return isInView;
}
