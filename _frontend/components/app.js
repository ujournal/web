import auth from "../utils/auth";
import api from "../utils/api";

export default () => {
  let stopListen = null;

  return {
    logged: false,
    redirectUrl: null,
    subscriptions: [],

    init() {
      stopListen = auth.listen((data) => this.handleAuth(data));
      this.logged = auth.check();
      this.loadSubscriptions();
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

    async loadSubscriptions() {
      const { data } = await api.get("/subscriptions");
      this.subscriptions = data;
    },
  };
};
