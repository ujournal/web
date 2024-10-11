import isUrl from "is-url";
import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";
import auth from "../utils/auth";
import externals from "../utils/externals";

export default () => {
  return {
    feeds: store.get("feeds", []),
    title: "",
    body: "",
    url: "",
    feed_id: store.get("feed_id"),
    busy: false,
    externalData: null,
    images: [],

    init() {
      if (!auth.check()) {
        location.href = "/";
      }

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

    clearErrors() {
      formSender.setFormErrors(this.$root, {});
    },

    handleTitlePaste() {
      requestAnimationFrame(() => this.checkTitleForUrlAndResolve());
    },

    handleTitleChange() {
      this.checkTitleForUrlAndResolve();
    },

    async checkTitleForUrlAndResolve() {
      if (this.busy || this.images.length > 0) {
        return;
      }

      this.busy = true;

      const title = this.title.trim();

      if (isUrl(title)) {
        this.title = "";

        try {
          const external = await externals.resolve(title);
          this.externalData = external;
          this.title = external.title;
          this.url = external.url;

          if (this.body === "") {
            this.body = external.description;
            this.triggerTextareaResize();
          }
        } catch (error) {
          console.warn(error);

          dispatchEvent(
            new CustomEvent("toast-show", {
              detail: {
                message: "Не вдалося опрацювати URL. Спробуйте ще раз",
              },
            }),
          );
        }
      }

      this.busy = false;
    },

    triggerTextareaResize() {
      requestAnimationFrame(() =>
        this.$root
          .querySelector("textarea")
          .dispatchEvent(new CustomEvent("autosize")),
      );
    },

    removeExternal() {
      this.externalData = null;
      this.url = null;
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
  };
};
