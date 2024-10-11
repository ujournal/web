export default () => {
  let handleScroll, timer, cleanup;

  return {
    scrolledStart: false,
    scrolledEnd: false,

    init() {
      handleScroll = () => {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          this.scrolledEnd =
            Math.ceil(
              this.$refs.items.scrollLeft + this.$refs.items.clientWidth,
            ) >= Math.ceil(this.$refs.items.scrollWidth);
          this.scrolledStart = this.$refs.items.scrollLeft <= 0;
        }, 10);
      };

      handleScroll();

      this.$refs.items.addEventListener("scroll", handleScroll);
      addEventListener("resize", handleScroll);
      addEventListener("carousel-resize", handleScroll);

      cleanup = () => {
        this.$refs.items.removeEventListener("scroll", handleScroll);
        removeEventListener("resize", handleScroll);
        removeEventListener("carousel-resize", handleScroll);
      };
    },

    destroy() {
      cleanup();
    },

    next() {
      const left =
        this.$refs.items.scrollLeft + this.$refs.items.clientWidth >=
        Math.ceil(this.$refs.items.scrollWidth)
          ? this.$refs.items.scrollWidth - this.$refs.items.clientWidth
          : this.$refs.items.scrollLeft + this.$refs.items.clientWidth;

      this.$refs.items.scrollTo({
        top: 0,
        left,
        behavior: "smooth",
      });
    },

    prev() {
      const left =
        this.$refs.items.scrollLeft - this.$refs.items.clientWidth > 0
          ? this.$refs.items.scrollLeft - this.$refs.items.clientWidth
          : 0;

      this.$refs.items.scrollTo({
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
