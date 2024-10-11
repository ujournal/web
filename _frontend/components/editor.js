import { Alpine } from "alpinejs";
import isUrl from "is-url";
import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";
import auth from "../utils/auth";

export default () => {
  return {
    feeds: store.get("feeds", []),
    feed_id: store.get("feed_id"),
    id: null,
    title: "",
    body: "",
    url: "",
    images: [],
    busy: false,

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

    async storeGallery() {
      if (this.images.length === 0) {
        return;
      }

      this.url = (
        await api.post("/externals", {
          gallery: Alpine.raw(this.images).map((image) => image.url),
        })
      ).data.url;
    },

    async resolveTitleAsUrlIfNeeded() {
      if (this.busy || this.images.length > 0) {
        return;
      }

      const title = this.title.trim();

      if (isUrl(title)) {
        this.title = "";
        this.url = title;
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

      this.images = [...this.images, ...event.detail.succeed];

      if (event.detail.failed.length > 0) {
        dispatchEvent(
          new CustomEvent("toast-show", {
            detail: {
              message: "Не вдалося завантажити деякі зорбаження",
            },
          }),
        );
      }
    },

    handleImageRemove(event) {
      this.images.splice(event.detail.index, 1);
      dispatchEvent(new CustomEvent("carousel-resize"));
    },

    handleExternalStarted() {
      this.busy = true;
    },

    handleExternalCompleted(event) {
      const { title, url, description } = event.detail.data;

      this.busy = false;

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

      dispatchEvent(
        new CustomEvent("toast-show", {
          detail: {
            message: "Не вдалося опрацювати URL. Спробуйте ще раз",
          },
        }),
      );
    },

    handleExternalRemove() {
      this.url = null;
    },
  };
};
