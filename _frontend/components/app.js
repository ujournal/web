import auth from "../utils/auth";
import jwtParser from "../utils/jwt_parser";

export default () => {
  let cleanup;

  return {
    logged: false,
    redirectUrl: null,
    user: null,

    init() {
      const stopListenAuth = auth.listen((data) => this.handleAuth(data));

      this.logged = auth.check();
      this.user = this.logged ? this.parseUser() : null;

      cleanup = () => {
        stopListenAuth();
      };
    },

    handleAuth(data) {
      auth.set(data);
      this.logged = auth.check();
      this.user = this.parseUser();
      this.$dispatch("login");

      if (this.redirectUrl) {
        location.href = this.redirectUrl;
      }
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

    parseUser() {
      return jwtParser.parse(auth.get("access_token"));
    },

    avatar() {
      if (!this.user) {
        return null;
      }

      const params = new URLSearchParams({
        s: 250,
        d: "robohash",
      });

      return `https://gravatar.com/avatar/${this.user.hash}?${params}`;
    },
  };
};
