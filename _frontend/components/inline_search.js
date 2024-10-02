export default () => {
  return {
    q: "",

    isShowedBySearch(el) {
      return (
        !this.q ||
        el.firstElementChild.innerText
          .toUpperCase()
          .includes(this.q.toUpperCase())
      );
    },
  };
};
