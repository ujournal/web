import { computePosition, autoUpdate, offset } from "@floating-ui/dom";

export default () => {
  let removeAutoUpdate = () => {};
  let removeToggleListener = () => {};

  return {
    init() {
      const listener = () => {
        const referenceEl = document.activeElement;
        const floatingEl = this.$root;

        removeAutoUpdate();

        const placement =
          this.$root.getAttribute("data-popover-placement") || "bottom-end";
        const offsetValue =
          parseInt(this.$root.getAttribute("data-popover-offset"), 10) || 4;

        removeAutoUpdate = autoUpdate(referenceEl, floatingEl, async () => {
          const { x, y } = await computePosition(referenceEl, floatingEl, {
            strategy: "fixed",
            placement,
            middleware: [offset(offsetValue)],
          });

          Object.assign(floatingEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      };

      this.$root.addEventListener("toggle", listener);

      removeToggleListener = () => {
        this.$root.removeEventListener("toggle", listener);
      };
    },

    destroy() {
      removeAutoUpdate();
      removeToggleListener();
    },
  };
};
