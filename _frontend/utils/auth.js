import getMetaContent from "./get_meta_content";

export default {
  set(data) {
    localStorage["auth"] = JSON.stringify({
      date: new Date().getTime(),
      data,
    });

    return this;
  },

  get(key = null) {
    if (!localStorage["auth"]) {
      return null;
    }

    const { data } = JSON.parse(localStorage["auth"]);

    if (!key) {
      return data;
    }

    return data[key];
  },

  delete() {
    delete localStorage["auth"];
    return this;
  },

  check() {
    return Boolean(localStorage["auth"]);
  },

  expiresAt() {
    if (!localStorage["auth"]) {
      return null;
    }

    const {
      data: { expires_in },
      date,
    } = JSON.parse(localStorage["auth"]);

    return new Date(new Date(date).getTime() + expires_in * 1000);
  },

  open() {
    return window.open(`${getMetaContent("api-url")}/auth`, "auth");
  },

  listen(callback) {
    const postMessageListener = (event) => {
      if (event.data.access_token) {
        callback(event.data);
      }
    };

    addEventListener("message", postMessageListener);

    return () => {
      removeEventListener("message", postMessageListener);
    };
  },
};
