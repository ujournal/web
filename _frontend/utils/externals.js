import contentPaths from "./content_paths";
import api from "./api";
import r2 from "./r2";
import normalizeUrl from "normalize-url";

export default {
  async resolve(url) {
    url = normalizeUrl(url);

    return await r2.get(await contentPaths.getExternalPath(url));
  },

  async resolveViaApi(url) {
    url = normalizeUrl(url);

    return await api.post("/externals", {
      url,
    });
  },
};
