import digest from "./digest";

export default {
  async getExternalPath(id) {
    return `/p/${await digest(`post:${id}`, "SHA-1")}.json`;
  },
};
