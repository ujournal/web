import getMetaContent from "./get_meta_content";

export default {
  set(token) {
    localStorage["token"] = token;
    return this;
  },

  get() {
    return localStorage["token"];
  },

  delete() {
    delete localStorage["token"];
    return this;
  },

  check() {
    return Boolean(localStorage["token"]);
  },

  open() {
    return window.open(getMetaContent("auth-url"), "auth");
  },

  listen(callback) {
    const postMessageListener = (event) => {
      if (event.data.type === "auth") {
        callback(event.data.token);
      }
    };

    addEventListener("message", postMessageListener);

    return () => {
      removeEventListener("message", postMessageListener);
    };
  },
};
