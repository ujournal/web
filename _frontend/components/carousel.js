export default (images = [], removable = false) => {
  let handleScroll, timer, cleanup;

  return {
    scrolledStart: true,
    scrolledEnd: true,
    images,
    removable,

    init() {
      handleScroll = () => {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          this.scrolledEnd =
            Math.ceil(this.$root.scrollLeft + this.$root.clientWidth) >=
            Math.ceil(this.$root.scrollWidth);
          this.scrolledStart = this.$root.scrollLeft <= 0;
        }, 10);
      };

      handleScroll();

      this.$root.addEventListener("scroll", handleScroll);
      addEventListener("resize", handleScroll);
      addEventListener("carousel-resize", handleScroll);

      cleanup = () => {
        clearTimeout(timer);
        this.$root.removeEventListener("scroll", handleScroll);
        removeEventListener("resize", handleScroll);
        removeEventListener("carousel-resize", handleScroll);
      };
    },

    destroy() {
      cleanup();
    },

    handleNext() {
      const left =
        this.$root.scrollLeft + this.$root.clientWidth >=
        Math.ceil(this.$root.scrollWidth)
          ? this.$root.scrollWidth - this.$root.clientWidth
          : this.$root.scrollLeft + this.$root.clientWidth;

      this.$root.scrollTo({
        top: 0,
        left,
        behavior: "smooth",
      });
    },

    handlePrev() {
      const left =
        this.$root.scrollLeft - this.$root.clientWidth > 0
          ? this.$root.scrollLeft - this.$root.clientWidth
          : 0;

      this.$root.scrollTo({
        top: 0,
        left,
        behavior: "smooth",
      });
    },

    handleImageLoad(event) {
      const ratio = event.target.naturalWidth / event.target.naturalHeight;
      const isCover = ratio > 1.49 && ratio < 2.2;
      event.target.style.objectFit = isCover ? "cover" : "contain";
    },
  };
};
