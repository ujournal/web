import auth from "../utils/auth";
import parseJwt from "../utils/parse_jwt";

export default () => {
  let stopListen = null;

  return {
    logged: false,
    redirectUrl: null,

    init() {
      stopListen = auth.listen((data) => this.handleAuth(data));
      this.logged = auth.check();
    },

    handleAuth(data) {
      auth.set(data);
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

    user() {
      const { access_token } = auth.get();

      return parseJwt(access_token);
    },
  };
};
