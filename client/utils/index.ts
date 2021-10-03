export const addToLocalStorage = <T>(key: string, data: T): void => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string): T | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const data = localStorage.getItem(key);

    if (!data) {
        return undefined;
    }

    return JSON.parse(data) as T;
};
