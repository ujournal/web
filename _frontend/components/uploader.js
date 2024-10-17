import uploader from "../utils/images_uploader";

export default () => {
  return {
    async uploadMany(files) {
      if (files.length === 0) {
        return;
      }

      const controller = new AbortController();

      const abort = () => {
        controller.abort();
      };

      this.$dispatch("uploader-started", { abort });

      try {
        const results = await uploader.uploadMany(files, controller.signal);

        this.$dispatch("uploader-completed", results);
      } catch (error) {
        console.warn(error);

        this.$dispatch("uploader-failed", { error });
      }
    },

    async handleInputChange(event) {
      await this.uploadMany(Array.from(event.currentTarget.files));

      this.$refs.input.value = "";
    },

    async handlePaste(event) {
      await this.uploadMany(Array.from(event.clipboardData.files));
    },
  };
};
