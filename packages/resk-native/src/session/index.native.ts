import { SessionStorage } from "@resk/core";
import Storage from 'expo-sqlite/kv-store';

@SessionStorage()
class ExpoSessionStorage {
  get(key: string) {
    return Storage.getItemSync(key);
  }
  set(key: string, value: any) {
    Storage.setItemSync(key, value);
  }
  remove(key: string) {
    Storage.removeItemAsync(key);
  }
  removeAll() {
    return undefined;
  }
};
