import contentPaths from "../utils/content_paths";
import dateFormatter from "../utils/date_formatter";
import r2 from "../utils/r2";
import router from "../utils/router";
import sessionStore from "../utils/session_store";
import { currentRoute } from "../utils/visit";

export default () => {
  return {
    busy: true,
    data: null,
    dateFormat: sessionStore.get("post_date_format", "short"),

    init() {
      this.load();
    },

    async load() {
      this.busy = true;

      const id = currentRoute().params.id;

      try {
        const { status, data } = await r2.get(
          await contentPaths.getExternalPath(id),
        );

        this.data = data;
      } catch (error) {
        console.warn(error);

        this.$dispatch("toast-show", {
          message: "Не вдалося завантажити пост",
        });
      } finally {
        this.busy = false;
      }
    },

    shouldShowExternal() {
      return Boolean(this.data?.external);
    },

    shouldShowGallery() {
      return Boolean(this.data?.gallery);
    },

    feedUrl() {
      if (!this.data) {
        return null;
      }

      return router.buildPath("feed.show", { id: this.data.feed.id });
    },

    userUrl() {
      if (!this.data) {
        return null;
      }

      return router.buildPath("feed.show", { id: this.data.user.feed.id });
    },

    dateShort() {
      return dateFormatter.formatDateShort(new Date(this.data?.created_at));
    },

    dateLong() {
      return dateFormatter.formatDateLong(new Date(this.data?.created_at));
    },

    toggleDate() {
      const format = this.dateFormat === "short" ? "long" : "short";

      this.dateFormat = format;

      sessionStore.set("post_date_format", format);
    },

    handlePopoverOpen() {
      this.$dispatch("active-entity", { type: "post", data: this.data });
    },
  };
};
