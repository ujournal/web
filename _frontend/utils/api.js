import axios from "axios";
import getMetaContent from "./get_meta_content";

export default axios.create({
  baseURL: getMetaContent("api-url"),
  timeout: 1000,
  headers: { Accept: "application/json" },
});
