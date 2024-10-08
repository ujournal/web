import storagePaths from "./storage_paths";
import api from "./api";
import r2 from "./r2";
import normalizeUrl from "normalize-url";

export default {
  async resolve(url) {
    url = normalizeUrl(url);

    const { status, data } = await r2.get(await storagePaths.external(url));

    if (status === 200) {
      return data;
    } else if (status === 404) {
      return await this.resolveViaApi(url);
    }

    throw new Error("Unrecognized error from static server");
  },

  async resolveViaApi(url) {
    const { status, data } = await api.post("/externals", {
      url,
    });

    if (status === 200) {
      return data;
    }

    throw new Error("Can't resolve the URL");
  },
};
