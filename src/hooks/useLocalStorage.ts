import {useState} from 'react';

type StoredValue<T> = [T, (value: T | ((val: T) => T)) => void];

export const useLocalStorage = <T>(key: string, initialValue: T, raw: boolean = false): StoredValue<T> => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (raw) {
                return item !== null ? (item as unknown as T) : initialValue;
            }
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, raw ? (valueToStore as unknown as string) : JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};
