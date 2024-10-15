import contentPaths from "../utils/content_paths";
import dateFormatter from "../utils/date_formatter";
import r2 from "../utils/r2";
import router from "../utils/router";
import sessionStore from "../utils/session_store";
import { currentRoute } from "../utils/visit";

export default () => {
  return {
    data: null,
    dateFormat: sessionStore.get("post_date_format", "short"),

    init() {
      this.load();
    },

    async load() {
      const id = currentRoute().params.id;

      const { status, data } = await r2.get(
        await contentPaths.getExternalPath(id),
      );

      if (status === 200) {
        this.data = data;
      }
    },

    shouldShowExternal() {
      return Boolean(this.data?.external);
    },

    shouldShowGallery() {
      return Boolean(this.data?.gallery);
    },

    feedUrl() {
      return router.buildPath("feed.show", { id: this.data.feed.id });
    },

    userUrl() {
      return router.buildPath("feed.show", { id: this.data.user.feed.id });
    },

    dateShort() {
      return dateFormatter.formatDateShort(new Date(this.data.created_at));
    },

    dateLong() {
      return dateFormatter.formatDateLong(new Date(this.data.created_at));
    },

    shouldShow() {
      return Boolean(this.data);
    },

    toggleDate() {
      const format = this.dateFormat === "short" ? "long" : "short";

      this.dateFormat = format;

      sessionStore.set("post_date_format", format);
    },
  };
};
