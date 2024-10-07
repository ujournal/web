import formSender from "../utils/form_sender";
import api from "../utils/api";

export default () => {
  return {
    feeds: [],
    feed_id: null,

    init() {
      this.loadFeeds();
    },

    async submit() {
      await formSender.sendForm("/posts", this.$root, api);
    },

    async loadFeeds() {
      const { data } = await api.get("/feeds");
      this.feeds = data;
      this.feed_id = data.find((feed) => feed.alias.startsWith("/u/"))?.id;
    },
  };
};
