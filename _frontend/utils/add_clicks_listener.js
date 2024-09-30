export default (name, callback, tagName = "a", attrName = "target") => {
  const listener = (event) => {
    const target = event.target.closest(tagName);

    if (target && target.getAttribute(attrName) === name) {
      event.preventDefault();

      callback(target);
    }
  };

  document.body.addEventListener("click", listener);

  return () => {
    document.body.removeEventListener("click", listener);
  };
};
