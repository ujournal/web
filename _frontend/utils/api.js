import axios from "axios";
import auth from "./auth";
import metaReader from "./meta_reader";
import axiosRetry from "axios-retry";

const instance = axios.create({
  baseURL: metaReader.get("api-url"),
  timeout: 20000,
  headers: {
    accept: "application/json",
  },
});

axiosRetry(instance, { retries: 3 });

// Hook that attach authorization token to each API request
instance.interceptors.request.use(
  async (config) => {
    if (auth.check()) {
      config.headers.set("authorization", `Bearer ${auth.get("access_token")}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Hook that catch 401 Unauthorized error and try to refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const response = await instance.post("/auth");

      if (response.status === 200) {
        auth.set(response.data);

        return instance.request(error.config);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
