import metaReader from "./meta_reader";
import sha256 from "./sha256";

export default {
  async external(url) {
    return `/e/${await sha256(url)}.json`;
  },
};
