export default () => {
  return {
    handleContentChanged() {
      requestAnimationFrame(() => {
        this.$dispatch("autosize");
      });
    },
  };
};
