import auth from "../utils/auth";
import router from "../utils/router";
import visit from "../utils/visit";

export default () => {
  let cleanup;

  return {
    logged: false,
    redirectUrl: null,
    user: null,
    activeEntity: null,

    init() {
      const stopListenAuth = auth.listen((data) => this.handleAuth(data));

      this.logged = auth.check();
      this.user = this.logged ? auth.user() : null;

      cleanup = () => {
        stopListenAuth();
      };
    },

    destroy() {
      cleanup();
    },

    login(redirectUrl = null) {
      this.redirectUrl = redirectUrl;
      auth.open();
    },

    logout() {
      auth.delete();
      this.logged = auth.check();
      this.$dispatch("logout");
    },

    avatar() {
      return this.user ? this.user.image : null;
    },

    handleAuth(data) {
      auth.set(data);
      this.logged = auth.check();
      this.user = auth.user();
      this.$dispatch("login");

      if (this.redirectUrl) {
        location.href = this.redirectUrl;
      }
    },

    handleActiveEntity(event) {
      this.activeEntity = event.detail;
    },

    editPost() {
      if (this.activeEntity?.type === "post") {
        visit("post.edit", { id: this.activeEntity.data.id });
      }
    },
  };
};
