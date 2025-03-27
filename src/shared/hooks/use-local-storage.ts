import {useEffect, useState} from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    setStoredValue(() =>{
      if (typeof window === "undefined")
        return defaultValue;

      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) as T : defaultValue;
    });
    setFirstLoadDone(true);
  }, [defaultValue, key]);

  useEffect(() => {
    if (!firstLoadDone)
      return;

    if (typeof window !== "undefined")
      window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [storedValue, firstLoadDone, key]);

  return [storedValue, setStoredValue];
}