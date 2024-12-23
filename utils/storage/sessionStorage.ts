import { MMKV } from "react-native-mmkv";

let storage: MMKV;

// Initialize the storage before using
export const setStorageInstance = (instance: MMKV) => {
  storage = instance;
};

// Implement the required methods for Supabase session storage
export const getItem = async (key: string): Promise<string | null> => {
  return storage.getString(key) || null;
};

export const setItem = async (key: string, value: string): Promise<void> => {
  storage.set(key, value);
};

export const removeItem = async (key: string): Promise<void> => {
  storage.delete(key);
};