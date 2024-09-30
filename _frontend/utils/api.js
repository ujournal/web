import axios from "axios";

export default axios.create({
  baseURL: document.head.querySelector("meta[name=api-url]").content,
  timeout: 1000,
  headers: { Accept: "application/json" },
});
