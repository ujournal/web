import { computePosition, autoUpdate } from "@floating-ui/dom";

export default () => {
  let removeAutoUpdate = () => {};
  let removeToggleListener = () => {};

  return {
    init() {
      const listener = () => {
        const referenceEl = document.activeElement;
        const floatingEl = this.$root;

        removeAutoUpdate();

        removeAutoUpdate = autoUpdate(referenceEl, floatingEl, async () => {
          const { x, y } = await computePosition(referenceEl, floatingEl, {
            strategy: "fixed",
            placement: "bottom-end",
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
