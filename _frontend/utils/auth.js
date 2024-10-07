import metaReader from "./meta_reader";
import store from "./local_store";

export default {
  set(data) {
    store.set("auth", {
      date: new Date().getTime(),
      data,
    });

    return this;
  },

  get(key = null) {
    if (!store.has("auth")) {
      return null;
    }

    const { data } = store.get("auth");

    if (!key) {
      return data;
    }

    return data[key];
  },

  delete() {
    store.remove("auth");
    return this;
  },

  check() {
    return store.has("auth");
  },

  expiresAt() {
    if (!store.has("auth")) {
      return null;
    }

    const {
      data: { expires_in },
      date,
    } = store.get("auth");

    return new Date(new Date(date).getTime() + expires_in * 1000);
  },

  open() {
    return window.open(`${metaReader.get("api-url")}/auth`, "auth");
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
