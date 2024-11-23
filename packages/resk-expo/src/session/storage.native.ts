import { Session } from "@resk/core";
import { packageName } from '@utils/index';
import Storage from '@expo-sqlite/kv-store';

Session.SessionManager.allKeyPrefix = `${packageName}-session`;
Session.SessionManager.storage = {
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
    //window.localStorage.clear()
    return undefined;
  }
};
