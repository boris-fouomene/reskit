import { Session } from "@resk/native";
import Storage from 'expo-sqlite/kv-store';

Session.storage = {
  get: (key: string) => {
    return Storage.getItemSync(key);
  },
  set: (key: string, value: any) => {
    Storage.setItemSync(key, value);
  },
  remove: (key: string) => {
    Storage.removeItemAsync(key);
  },
  removeAll: () => {
    return undefined;
  }
};
