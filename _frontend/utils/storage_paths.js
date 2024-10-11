import digest from "./digest";

export default {
  async external(url) {
    return `/e/${await digest(url, "SHA-1")}.json`;
  },
};
