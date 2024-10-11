import api from "../utils/api";

export default () => {
  return {
    async handleInputChange(event) {
      dispatchEvent(new CustomEvent("uploader-started"));

      const promises = Array.from(event.currentTarget.files).map((file) => {
        const formData = new FormData();
        formData.append("image", file);

        return api.post("/externals", formData, {
          validateStatus: () => true,
        });
      });

      this.$refs.input.value = "";

      const results = await Promise.all(promises);

      const succeed = results
        .filter((result) => result.status === 200)
        .map((result) => result.data);
      const failed = results.filter((result) => result.status !== 200);

      dispatchEvent(
        new CustomEvent("uploader-completed", { detail: { succeed, failed } }),
      );
    },
  };
};
