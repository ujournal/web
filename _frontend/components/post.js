import api from "../utils/api";
import { currentRoute, params } from "../utils/visit";

export default () => {
  return {
    id: null,
    title: "",
    body: "",
    external: null,
    gallery: null,

    init() {
      this.load();
    },

    async load() {
      this.id = currentRoute().params.id;

      const { data } = await api.get(`/posts/${this.id}`);

      this.id = data.id;
      this.title = data.title;
      this.body = data.body;
      this.external = data.external;
      this.gallery = data.gallery;
    },
  };
};
