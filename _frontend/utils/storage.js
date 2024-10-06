export default {
  storage: sessionStorage,

  get(key, defaultValue = null) {
    if (this.storage[key]) {
      return JSON.parse(this.storage[key]);
    }

    return defaultValue;
  },

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  },
};
