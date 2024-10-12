import isUrl from "is-url";
import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";
import auth from "../utils/auth";

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
    editing: true,

    init() {
      if (!auth.check()) {
        location.href = "/";
      }

      const id = new URL(location.href).searchParams.get("id");

      if (id) {
        this.busy = true;
        this.loadPost(id);
        this.busy = false;
      }

      this.loadFeeds();
    },

    async submit() {
      await this.storeGallery();
      await formSender.sendForm("/posts", this.$root, api);
    },

    async loadPost(id) {
      const { data } = await api.get(`/posts/${id}`);

      this.id = data.id;
      this.title = data.title;
      this.body = data.body;
      this.url = data.url;
    },

    async loadFeeds() {
      const { data } = await api.get("/feeds");

      this.feeds = data;

      store.set("feeds", data);
    },

    async resolveTitleAsUrlIfNeeded() {
      if (this.busy) {
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

      if (event.detail.succeed.length > 0) {
        this.$dispatch("gallery-add", {
          images: event.detail.succeed.map((item) => item.url),
        });
      }

      if (event.detail.failed.length > 0) {
        this.$dispatch("toast-show", {
          message: "Не вдалося завантажити деякі зорбаження",
        });
      }
    },

    handleExternalStarted() {
      this.busy = true;
    },

    handleExternalCompleted(event) {
      const { id, title, url, description } = event.detail.data;

      this.busy = false;

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

    handleGallerySucceed(event) {
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
      this.$dispatch("toast-show", {
        message: "Не вдалося створити або оновити галерею",
      });
    },
  };
};
