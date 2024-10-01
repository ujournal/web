import getMetaContent from "./get_meta_content";

export default {
  set(token) {
    localStorage["token"] = token;
  },

  get() {
    return localStorage["token"];
  },

  delete() {
    delete localStorage["token"];
  },

  check() {
    return Boolean(localStorage["token"]);
  },

  open() {
    window.open(getMetaContent("auth-url"), "auth");
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
