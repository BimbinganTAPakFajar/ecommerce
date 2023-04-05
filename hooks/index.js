import { useState, useEffect, useRef } from "react";

export const useLocalStorage = (key, initialValue) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        const parsedValue = JSON.parse(localStorageValue);
        setState(parsedValue);
      }
    }
  }, [key]);

  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return JSON.parse(localStorageValue);
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
