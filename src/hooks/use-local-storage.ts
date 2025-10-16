import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useLocalStorage<T extends object>(key: string, initialState: T) {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const restored = getStorage<T>(key);
    if (restored) {
      setState((prev) => ({
        ...prev,
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue: Partial<T>) => {
      setState((prev) => {
        const newValue = { ...prev, ...updateValue };
        setStorage(key, newValue);
        return newValue;
      });
    },
    [key]
  );

  const update = useCallback(
    (name: keyof T, updateValue: T[keyof T]) => {
      updateState({ [name]: updateValue } as Partial<T>);
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return { state, update, reset };
}

// ----------------------------------------------------------------------

export const getStorage = <T,>(key: string): T | null => {
  try {
    const result = window.localStorage.getItem(key);
    return result ? (JSON.parse(result) as T) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
