export default () => {
  return {
    init() {
      Array.from(this.$root.querySelectorAll("a")).forEach((element) => {
        const href = element.getAttribute("href");
        const isActive =
          (href === "/" && location.pathname === "/") ||
          (href !== "/" && location.pathname.startsWith(href));

        element.classList.toggle("nav-button-active", isActive);
      });
    },
  };
};
