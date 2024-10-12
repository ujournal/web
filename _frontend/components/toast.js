export default () => {
  let timer = null;

  return {
    message: null,

    destroy() {
      clearTimeout(timer);
    },

    show(event) {
      clearTimeout(timer);

      this.message = event.detail.message;
      const delay = event.detail.delay ?? 5000;

      this.$root.showPopover();

      this.$dispatch("toast-showed");

      timer = setTimeout(() => {
        this.$root.hidePopover();

        this.$dispatch("toast-hided");
      }, delay);
    },
  };
};
