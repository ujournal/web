export default class Store {
  storage;

  constructor(storage = sessionStorage) {
    this.storage = storage;
  }

  get(key, defaultValue = null) {
    if (this.storage[key]) {
      return JSON.parse(this.storage[key]);
    }

    return defaultValue;
  }

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  has(key) {
    return this.storage.getItem(key) !== null;
  }

  remove(key) {
    this.storage.removeItem(key);
  }
}
