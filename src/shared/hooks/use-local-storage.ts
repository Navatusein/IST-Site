import {useEffect, useRef, useState} from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    setStoredValue(() =>{
      if (typeof window === "undefined")
        return defaultValueRef.current;

      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) as T : defaultValueRef.current;
      }
      catch {
        return defaultValueRef.current;
      }
    });
    setFirstLoadDone(true);
  }, [key]);

  useEffect(() => {
    if (!firstLoadDone)
      return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
    catch {
    }
  }, [storedValue, firstLoadDone, key]);

  return [storedValue, setStoredValue];
}