import { useState, useEffect, useRef } from "react";
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    let stored = localStorage.getItem(key);
    setValue(stored !== null ? JSON.parse(stored) : defaultValue);
  }, []);

  useEffect(() => {
    console.log(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
