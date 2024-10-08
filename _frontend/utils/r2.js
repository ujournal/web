import metaReader from "./meta_reader";
import axios from "axios";

export default axios.create({
  baseURL: metaReader.get("static-url"),
  validateStatus: () => true,
});
