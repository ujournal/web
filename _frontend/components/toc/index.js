import tocbot from "tocbot";

export default () => {
  return {
    init() {
      tocbot.init({
        tocElement: this.$root,
        contentSelector: ".content",
        ignoreSelector: "[data-toc-skip]",
        headingSelector: "h2, h3, h4",
        orderedList: false,
        scrollSmooth: false,
      });
    },
  };
};
