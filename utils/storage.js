import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const getWebStorage = () => {
   if (typeof window === "undefined") return null;
   try {
      const { localStorage } = window;
      if (!localStorage) return null;
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return localStorage;
   } catch {
      return null;
   }
};

export const webStorage = {
   getItem: async (key) => {
      const storage = getWebStorage();
      return storage ? storage.getItem(key) : null;
   },
   setItem: async (key, value) => {
      const storage = getWebStorage();
      if (storage) storage.setItem(key, value);
   },
   removeItem: async (key) => {
      const storage = getWebStorage();
      if (storage) storage.removeItem(key);
   },
};

export const appStorage = Platform.OS === "web" ? webStorage : AsyncStorage;
