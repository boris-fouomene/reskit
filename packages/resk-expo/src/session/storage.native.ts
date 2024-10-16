import * as SQLite from 'expo-sqlite';
import { Session } from "@resk/core";
import * as FileSystem from 'expo-file-system';

const { sanitizeKey: cSanitizeKey, handleGetValue, handleSetValue } = Session;

const appName = require("$package").name;

export const SESSION_TABLE = "SESSION";

const isDev = typeof __DEV__ !== 'undefined' ? !!__DEV__ : false;;

const debug = (...args: Array<any>) => {
  if (!isDev) return;
  return console.log(...args);
}

type DataType = {
  key: string,
  id?: string | number,
  value: any,
}

export class SQLiteSession {
  hasInit: boolean = false;
  db: any = null;
  readonly data: Map<string, DataType | null | undefined> = new Map();
  openingPromise: null | Promise<any> = null;
  /***
   * return session sqlite dbName
   */
  getDBName(): string {
    const suffix = "sqlite-sessname";
    if (appName) {
      return `${appName.replace(/\s+/g, "").replaceAll("\\", "/").replaceAll("\\", "")}-${suffix}`;
    }
    return `${suffix}`;
  }

  sanitizeKey(key: string): string {
    return cSanitizeKey(key);
  }
  async init() {
    if (!this.db || !this.hasInit) {
      if (!this.openingPromise) {
        const dbName = this.getDBName();
        debug(`Opening sqlite database ${dbName} for session storage`);
        this.openingPromise = new Promise((resolve, reject) => {
          return SQLite.openDatabaseAsync(dbName).then((db) => {
            return db.execAsync(`CREATE TABLE IF NOT EXISTS ${SESSION_TABLE} (id INTEGER PRIMARY KEY NOT NULL, key TEXT, value TEXT);`).then((d) => {
              this.db = db;
              this.hasInit = true;
              return this.getAll().then((() => {
                resolve(db);
              }));
            })
          }).catch((e) => {
            debug(e, " error when initializing sqlite session");
            reject(e);
          }).finally(() => {
            this.openingPromise = null;
          });;
        });
      }
      return this.openingPromise;
    }
    return Promise.resolve(true);
  }
  get(key: string): any {
    key = this.sanitizeKey(key);
    if (!key) return undefined;
    return this.data.get(key)?.value;
  }
  /***
   * asynchronious get value from session by key
   */
  async getAsync(key: string, callback?: (value: any) => void): Promise<any> {
    key = this.sanitizeKey(key);
    if (!key) return undefined;
    await this.init()
    const resp = await this.db.getFirstAsync(`SELECT value FROM ${SESSION_TABLE} WHERE key = ? `, key)
    if (!resp) {
      if (typeof callback == 'function') {
        callback(undefined);
      }
      return undefined;
    }
    const r = handleGetValue(resp?.value);
    if (typeof callback == 'function') {
      callback(r);
    }
    return r;
  }

  /***
   * asynchronously set value to session by it's key
   */
  async set(key: string, value: any): Promise<any> {
    key = this.sanitizeKey(key);
    if (!key) return undefined;
    const v = this.data.get(key);
    const toUpdate: DataType = { ...(v || {}), value } as DataType;
    this.data.set(key, toUpdate);
    const isUpdate = "id" in toUpdate && !!String(toUpdate.id) || false;
    value = handleSetValue(value, true);
    try {
      await this.init();
      const params: { $key: string, $value: any, $id?: string | number } = { $key: key, $value: value };
      if (isUpdate) {
        params.$id = toUpdate.id;
      }
      const statement = await this.db.prepareAsync(isUpdate ? `UPDATE ${SESSION_TABLE} SET value = $value WHERE id = $id` : `INSERT INTO ${SESSION_TABLE}(key,value) VALUES ($key,$value)`);
      try {
        const result = await statement.executeAsync(params)
        if (!isUpdate && result.lastInsertRowId) {
          toUpdate.id = result.lastInsertRowId;
          this.data.set(key, toUpdate);
        }
      } finally {
        await statement.finalizeAsync();
      }
    } catch (e) {
      debug(e, " error on inserting session data");
    }
    return;
  }
  /***
   * remove session data by its key from the session
   */
  async remove(key: string) {
    key = this.sanitizeKey(key);
    if (!key) return false;
    this.data.delete(key);
    await this.init();
    debug(`removing session: ${key}`)
    return await this.db.runAsync(`DELETE FROM sessions WHERE key = ?`, key);
  }
  /***
   * get all saved sessions
   */
  async getAll() {
    if (!this.hasInit || !this.db) return {};
    const data = await this.db.getAllAsync(`SELECT * FROM ${SESSION_TABLE}`);
    debug("getting all sql session");
    this.data.clear();
    return data.map(({ key, id, value }: DataType) => {
      value = handleGetValue(value);
      this.data.set(key, { id, value } as DataType);
    });
  }
  async length() {
    await this.init()
    const data = await this.db.getFirstAsync(`SELECT count(*) as total FROM ${SESSION_TABLE}`)
    return data.total
  }

  async clearAll() {
    await this.init()
    debug(`Clearing all sessions`)
    this.data.clear();
    return await this.db.runAsync(`DELETE FROM ${SESSION_TABLE}`);
  }
}

export function initSQLite() {
  return new Promise(async (resolve, reject) => {
    const createD = () => {
      return FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite').then(resolve).catch(e => {
        resolve(null);
      });
    };
    try {
      const info: FileSystem.FileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite');
      if (!info?.exists) {
        return createD();
      }
    } catch (e) {
      createD();
    }
  })
}

const sqliteSession = new SQLiteSession();
sqliteSession.init();
initSQLite();

export default sqliteSession;