import api from "../utils/api";
import store from "../utils/session_store";

export default {
  async getSubscriptions() {
    const subscriptions = store.get("subscriptions", []);

    if (!subscriptions) {
      const { data } = await api.get("/subscriptions");

      store.set("subscriptions", data);

      return data;
    }

    return subscriptions;
  },

  async subscribe(feedIds) {
    //
  },

  async unsubscribe(feedIds) {
    //
  },

  isSubscribed(feedIds) {
    //
  },
};
