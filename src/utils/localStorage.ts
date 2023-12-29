const isLocalStorageSupported = () => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (isLocalStorageSupported()) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    console.error("localstorage is not supported in this browser.");
  }
};

const getLocalStorageItem = <T>(key: string): T | [] => {
  if (isLocalStorageSupported()) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } else {
    console.error("localStorage is not supported in this browser.");
    return [];
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (isLocalStorageSupported()) {
    localStorage.removeItem(key);
  } else {
    console.error("localStorage is not supported in this browser.");
  }
};

const clearLocalStorage = (): void => {
  if (isLocalStorageSupported()) {
    localStorage.clear();
  } else {
    console.error("localStorage is not supported in this browser.");
  }
};

export {
  isLocalStorageSupported,
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  clearLocalStorage,
};
