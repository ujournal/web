import api from "../utils/api";
import store from "../utils/session_store";

export default () => {
  return {
    subscriptions: store.get("subscriptions", []),

    init() {
      requestIdleCallback(() => this.load());
    },

    async load() {
      const { data } = await api.get("/subscriptions");
      this.subscriptions = data;
      store.set("subscriptions", data);
    },
  };
};
