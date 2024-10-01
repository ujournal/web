import auth from "../../utils/auth";

export default () => {
  let stopListen = null;

  return {
    logged: false,
    redirectUrl: null,

    init() {
      stopListen = auth.listen((token) => this.handleAuth(token));
      this.logged = auth.check();
    },

    handleAuth(token) {
      auth.set(token);
      this.logged = auth.check();
      this.$dispatch("login");

      if (this.redirectUrl) {
        location.href = this.redirectUrl;
      }
    },

    destroy() {
      stopListen();
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
  };
};
