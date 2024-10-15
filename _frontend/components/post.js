import contentPaths from "../utils/content_paths";
import r2 from "../utils/r2";
import { currentRoute } from "../utils/visit";

export default () => {
  return {
    data: null,

    init() {
      this.load();
    },

    async load() {
      const id = currentRoute().params.id;

      const { status, data } = await r2.get(
        await contentPaths.getExternalPath(id),
      );

      if (status === 200) {
        this.data = data;
      }
    },

    shouldShowExternal() {
      return Boolean(this.data?.external);
    },

    shouldShowGallery() {
      return Boolean(this.data?.gallery);
    },
  };
};
