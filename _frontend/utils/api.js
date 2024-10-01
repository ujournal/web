import axios from "axios";
import getMetaContent from "./get_meta_content";
import auth from "./auth";

const instance = axios.create({
  baseURL: getMetaContent("api-url"),
  timeout: 5000,
  headers: {
    accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    if (auth.check()) {
      config.headers.set("authorization", `Bearer ${auth.get()}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
