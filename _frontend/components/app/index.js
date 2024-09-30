import getMetaContent from "../../utils/get_meta_content";

export default () => {
  let postMessageListener = null;

  return {
    logged: false,
    redirectAfterLogin: null,

    init() {
      postMessageListener = (event) => {
        if (event.data.type === "auth") {
          localStorage["token"] = event.data.token;
          this.logged = this.check();

          if (this.redirectAfterLogin) {
            location.href = this.redirectAfterLogin;
          }
        }
      };

      this.logged = this.check();

      addEventListener("message", postMessageListener);
    },

    destroy() {
      removeEventListener("message", postMessageListener);
    },

    check() {
      return Boolean(localStorage["token"]);
    },

    login(redirectAfterLogin = null) {
      this.redirectAfterLogin = redirectAfterLogin;
      window.open(getMetaContent("auth-url"), "auth");
    },

    logout() {
      delete localStorage["token"];
      this.logged = this.check();

      try {
        document.getElementById("profile-popover").hidePopover();
      } catch (error) {
        console.info(error);
      }
    },
  };
};
