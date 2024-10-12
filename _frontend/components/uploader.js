import imageCompression from "browser-image-compression";
import api from "../utils/api";

export default (fieldName = "image", isImages = true, size = 1024) => {
  return {
    async handleInputChange(event) {
      const files = event.currentTarget.files;
      this.$dispatch("uploader-started");

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (isImages && file.size > 1024) {
          file = await imageCompression(file, {
            maxSizeMB: Math.floor((size / 1024) * 10) / 10,
            maxWidthOrHeight: 2000,
          });
        }

        const formData = new FormData();
        formData.append(fieldName, file);

        promises.push(
          api.post("/images", formData, {
            validateStatus: () => true,
          }),
        );
      }

      this.$refs.input.value = "";

      const results = await Promise.all(promises);

      const succeed = results
        .filter((result) => result.status === 200 || result.status === 201)
        .map((result) => result.data);
      const failed = results.filter(
        (result) => result.status !== 200 && result.status !== 201,
      );

      this.$dispatch("uploader-completed", { succeed, failed });
    },
  };
};
