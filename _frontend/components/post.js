import contentPaths from "../utils/content_paths";
import dateFormatter from "../utils/date_formatter";
import cdn from "../utils/cdn";
import router from "../utils/router";
import sessionStore from "../utils/session_store";

export default (data = null, short = true) => {
  return {
    busy: false,
    short,
    data,
    dateFormat: sessionStore.get("post_date_format", "short"),

    init() {
      this.load();
    },

    async load() {
      if (this.data) {
        return;
      }

      this.busy = true;

      const id = router.currentRoute().params.id;

      try {
        const { data } = await cdn.get(await contentPaths.getExternalPath(id));

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
      if (!this.data) {
        return null;
      }

      return dateFormatter.formatDateShort(new Date(this.data?.created_at));
    },

    dateLong() {
      if (!this.data) {
        return null;
      }

      return dateFormatter.formatDateLong(new Date(this.data?.created_at));
    },

    toggleDate() {
      const format = this.dateFormat === "short" ? "long" : "short";

      this.dateFormat = format;

      sessionStore.set("post_date_format", format);
    },

    toggleShort() {
      this.short = !this.short;
    },

    shouldShowExternal() {
      return Boolean(this.data?.external);
    },

    shouldShowGallery() {
      return Boolean(this.data?.gallery);
    },

    shouldShowBody() {
      return !this.short && (this.busy || Boolean(this.data?.body));
    },

    shouldShowDescription() {
      return this.short && (this.busy || Boolean(this.data?.body));
    },

    shouldShowAuthor() {
      if (!this.data) {
        return null;
      }

      return !this.short && this.data.feed.is_thematic;
    },

    handlePopoverOpen() {
      this.$dispatch("active-entity", { type: "post", data: this.data });
    },
  };
};
