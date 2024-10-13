import isUrl from "is-url";
import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";
import auth from "../utils/auth";
import avatar from "../utils/avatar";

export default () => {
  return {
    id: null,
    title: "",
    body: "",
    url: "",
    external_id: null,
    gallery_id: null,
    feed_id: store.get("feed_id"),
    feeds: store.get("feeds", []),
    busy: false,

    init() {
      if (!auth.check()) {
        location.href = "/";
      }

      this.loadPost();
      this.loadFeeds();
    },

    async submit() {
      await formSender.sendForm("/posts", this.$root, api);
    },

    async loadPost() {
      const id = new URL(location.href).searchParams.get("id");

      if (!id) {
        return;
      }

      const { data } = await api.get(`/posts/${id}`);

      this.id = data.id;
      this.title = data.title;
      this.body = data.body;
      this.url = data.url;
      this.feed_id = data.feed_id;
      this.external_id = data.external_id;
      this.gallery_id = data.gallery_id;
    },

    async loadFeeds() {
      const { data } = await api.get("/feeds");

      this.feeds = data;

      store.set("feeds", data);
    },

    async resolveTitleAsUrlIfNeeded() {
      if (this.busy || !this.canPasteUrl()) {
        return;
      }

      const title = this.title.trim();

      if (isUrl(title)) {
        this.title = "";
        this.url = title;

        this.$dispatch("external-resolve", { url: title });
      }
    },

    clearErrors() {
      formSender.setFormErrors(this.$root, {});
    },

    triggerTextareaResize() {
      requestAnimationFrame(() =>
        this.$root
          .querySelector("textarea")
          .dispatchEvent(new CustomEvent("autosize")),
      );
    },

    feed() {
      const user = auth.user();

      const feed = this.feeds.find(
        (feed) => feed.id === parseInt(this.feed_id, 10),
      );

      if (feed) {
        return feed;
      }

      return { id: null, alias: `/u/${user.identifier}`, image: avatar(user) };
    },

    canUpload() {
      return !Boolean(this.url) || this.url.startsWith("gallery:");
    },

    canPasteUrl() {
      return !this.url.startsWith("gallery:");
    },

    shouldShowExternal() {
      return Boolean(this.url) && !this.url.startsWith("gallery:");
    },

    handleTitlePaste() {
      requestAnimationFrame(() => this.resolveTitleAsUrlIfNeeded());
    },

    handleTitleChange() {
      this.resolveTitleAsUrlIfNeeded();
    },

    handleUploadStarted() {
      this.busy = true;
    },

    handleUploadCompleted(event) {
      this.busy = false;

      const { succeed, failed } = event.detail;

      if (succeed.length > 0) {
        this.$dispatch("gallery-add", {
          images: succeed.map((item) => item.url),
        });
      }

      if (failed.length > 0) {
        this.$dispatch("toast-show", {
          message: "Не вдалося завантажити деякі зорбаження",
        });
      }
    },

    handleExternalStarted() {
      this.busy = true;
    },

    handleExternalCompleted(event) {
      this.busy = false;

      const { id, title, url, description } = event.detail.data;

      this.external_id = id;
      this.title = title;
      this.url = url;

      if (this.body === "") {
        this.body = description;
        this.triggerTextareaResize();
      }
    },

    handleExternalFailed() {
      this.busy = false;
      this.url = null;

      this.$dispatch("toast-show", {
        message: "Не вдалося опрацювати URL. Спробуйте ще раз",
      });
    },

    handleExternalRemoved() {
      this.external_id = null;
      this.url = null;
    },

    handleGalleryStarted() {
      this.busy = true;
    },

    handleGallerySucceed(event) {
      this.busy = false;

      const { url, gallery } = event.detail;

      if (gallery.images.length > 0) {
        this.gallery_id = gallery.id;
        this.url = url;
      } else {
        this.gallery_id = null;
        this.url = "";
      }
    },

    handleGalleryFailed() {
      this.busy = false;

      this.$dispatch("toast-show", {
        message: "Не вдалося створити або оновити галерею",
      });
    },
  };
};
