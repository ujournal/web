import isUrl from "is-url";
import { visit } from "@hotwired/turbo";
import formSender from "../utils/form_sender";
import api from "../utils/api";
import store from "../utils/session_store";
import auth from "../utils/auth";
import avatar from "../utils/avatar";
import translate, { isItEnglish } from "../utils/translate";
import resizeTextarea from "../utils/resize_textarea";

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

    async init() {
      if (!auth.check()) {
        this.$dispatch("toast-show", {
          message: "Не авторизовані",
        });

        visit("/");
      }

      try {
        await Promise.all([this.load(), this.loadFeeds()]);
      } catch (error) {
        console.warn(error);

        this.$dispatch("toast-show", {
          message: "Не вдалося завантажити пост або стрічки",
        });
      }
    },

    async load() {
      const id = new URL(location.href).searchParams.get("id");

      if (!id) {
        return;
      }

      const { data } = await api.get(`/posts/${id}`);

      this.id = data.id;
      this.title = data.title;
      this.body = data.body;
      this.url = data.url;
      this.feed_id = data.feed?.id;
      this.external_id = data.external?.id;
      this.gallery_id = data.gallery?.id;

      if (data.external) {
        this.$dispatch("external-set", { data: data.external });
      }

      if (data.gallery) {
        this.$dispatch("gallery-set", { data: data.gallery });
      }

      resizeTextarea();
    },

    async loadFeeds() {
      const { data } = await api.get("/feeds");

      this.feeds = data;

      store.set("feeds", data);
    },

    async resolvExternalIfTitleIsUrl() {
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

    async translate() {
      try {
        this.busy = true;

        const [title, body] = await Promise.all([
          this.canTranslateTitle() ? translate(this.title) : null,
          this.canTranslateBody() ? translate(this.body) : null,
        ]);

        if (title) {
          this.title = title.text;
        }

        if (body) {
          this.body = body.text;
        }
      } catch (error) {
        console.warn(error);

        this.$dispatch("toast-show", {
          message: "Не вдалося перекласти",
        });
      } finally {
        resizeTextarea();

        this.busy = false;
      }
    },

    canUpload() {
      return !Boolean(this.url) || Boolean(this.gallery_id);
    },

    canPasteUrl() {
      return !Boolean(this.gallery_id);
    },

    shouldShowExternal() {
      return (
        Boolean(this.url) &&
        (this.url.startsWith("http:") || this.url.startsWith("https:"))
      );
    },

    shouldShowGallery() {
      return Boolean(this.gallery_id);
    },

    shouldShowTranslate() {
      return this.canTranslateTitle() || this.canTranslateBody();
    },

    canTranslateTitle() {
      return this.title?.length > 0 && isItEnglish(this.title);
    },

    canTranslateBody() {
      return this.body?.length > 0 && isItEnglish(this.body);
    },

    async handleSubmit() {
      const { data } = await formSender.sendForm(this.$root, api);

      this.$dispatch("toast-show", {
        message: "Пост збережено",
      });

      visit(`/post?id=${data.id}`);
    },

    handleTitlePaste() {
      requestAnimationFrame(() => this.resolvExternalIfTitleIsUrl());
    },

    handleTitleChange() {
      this.resolvExternalIfTitleIsUrl();
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

      if (this.external_id === id) {
        return;
      }

      this.external_id = id;
      this.url = url;
      this.title = title;

      if (this.body === "") {
        this.body = description;

        resizeTextarea();
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

      const { gallery } = event.detail;

      if (gallery.images.length > 0) {
        this.gallery_id = gallery.id;
      } else {
        this.gallery_id = null;
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
