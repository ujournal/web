export default () => {
  let postMessageListener = null;

  return {
    logged: false,

    init() {
      postMessageListener = (event) => {
        console.log(event);
      };

      addEventListener("message", postMessageListener);
    },

    destroy() {
      removeEventListener("message", postMessageListener);
    },

    check() {
      return Boolean(localStorage["token"]);
    },

    login() {
      window.open("/auth", "auth");
    },

    logout() {
      delete localStorage["token"];
      this.logged = check();
    },
  };
};
