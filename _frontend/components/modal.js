import addClicksListener from "../utils/add_clicks_listener";

export default () => {
  let removeClicksListener = null;
  let dialog = null;
  let frame = null;

  return {
    init() {
      removeClicksListener = addClicksListener("modal", (element) => {
        this.open(
          element.getAttribute("href"),
          parseInt(element.getAttribute("data-modal-height"), 10) || null,
        );
      });

      dialog = this.$root;
      frame = document.createElement("iframe");

      dialog.appendChild(frame);
    },

    destroy() {
      removeClicksListener();
    },

    open(url, height = null) {
      dialog.style = height ? `height: ${height}px` : "";

      dialog.showModal();
      frame.setAttribute("src", url);
    },

    close() {
      dialog.close(null);
      frame.removeAttribute("src");
    },
  };
};
