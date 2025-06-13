import { MMKV } from 'react-native-mmkv';

// Create storage instance
export const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
} as const;

// Generic storage utilities
export const storageUtils = {
  // Get value from storage
  get: <T>(key: string): T | null => {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  // Set value to storage
  set: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },

  // Remove value from storage
  remove: (key: string): void => {
    storage.delete(key);
  },

  // Check if key exists
  has: (key: string): boolean => {
    return storage.contains(key);
  },
}; 