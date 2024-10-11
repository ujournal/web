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

      dispatchEvent(new CustomEvent("toast-showed"));

      timer = setTimeout(() => {
        this.$root.hidePopover();

        dispatchEvent(new CustomEvent("toast-hided"));
      }, delay);
    },
  };
};
