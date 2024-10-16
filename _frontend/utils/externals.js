import contentPaths from "./content_paths";
import api from "./api";
import cdn from "./cdn";
import normalizeUrl from "normalize-url";

export default {
  async resolve(url) {
    url = normalizeUrl(url);

    return await cdn.get(await contentPaths.getExternalPath(url));
  },

  async resolveViaApi(url) {
    url = normalizeUrl(url);

    return await api.post("/externals", {
      url,
    });
  },
};
