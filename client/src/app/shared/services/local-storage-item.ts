export class LocalStorageItem<T> {

  private _key: string;

  constructor(key: string) {
    this._key = key;
  }

  writeCache(value: T): boolean {
    let stringifiedValue = JSON.stringify(value);
    localStorage.setItem(this._key, stringifiedValue);
    return true;
  }

  readCache(): T {
    return JSON.parse(localStorage.getItem(this._key));
  }

  isStored(): boolean {
    return !(localStorage.getItem(this._key) === null);
  }
}
