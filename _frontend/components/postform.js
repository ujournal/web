import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";

export default () => {
  return {
    feeds: store.get("feeds", []),
    feed_id: store.get("feed_id"),

    init() {
      this.loadFeeds();
    },

    async submit() {
      await formSender.sendForm("/posts", this.$root, api);
    },

    async loadFeeds() {
      const { data } = await api.get("/feeds");
      this.feeds = data;
      store.set("feeds", data);
    },
  };
};
