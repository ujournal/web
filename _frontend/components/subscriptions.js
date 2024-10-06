import api from "../utils/api";
import storage from "../utils/sesson_store";

export default () => {
  return {
    subscriptions: storage.get("subscriptions", []),

    async init() {
      requestIdleCallback(() => this.load());
    },

    async load() {
      const { data } = await api.get("/subscriptions");
      this.subscriptions = data;
      storage.set("subscriptions", data);
    },
  };
};
