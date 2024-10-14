import sessionStore from "../utils/session_store";

export default () => {
  let timer = null;

  return {
    message: null,

    init() {
      const toast = sessionStore.get("toast");

      if (toast) {
        this.show(toast.message, toast.delay);
      }
    },

    destroy() {
      clearTimeout(timer);
    },

    show(message, delay = 5000) {
      clearTimeout(timer);

      this.message = message;

      sessionStore.set("toast", { message, delay });

      this.$root.showPopover();

      this.$dispatch("toast-showed");

      timer = setTimeout(() => {
        this.$root.hidePopover();

        sessionStore.remove("toast");

        this.$dispatch("toast-hided");
      }, delay);
    },

    handleShow(event) {
      this.show(event.detail.message, event.detail.delay);
    },
  };
};
