import auth from "../../utils/auth";

export default () => {
  let stopListenForToken = null;

  return {
    logged: false,
    redirectAfterLogin: null,

    init() {
      stopListenForToken = auth.listen((token) => this.handleAuth(token));
      this.logged = auth.check();
    },

    handleAuth(token) {
      auth.set(token);
      this.logged = auth.check();

      if (this.redirectAfterLogin) {
        location.href = this.redirectAfterLogin;
      }
    },

    destroy() {
      stopListenForToken();
    },

    login(redirectAfterLogin = null) {
      this.redirectAfterLogin = redirectAfterLogin;
      auth.open();
    },

    logout() {
      auth.delete();
      this.logged = auth.check();
      this.hideProfilePopover();
    },

    hideProfilePopover() {
      try {
        document.getElementById("profile-popover").hidePopover();
      } catch (error) {
        console.info(error);
      }
    },
  };
};
