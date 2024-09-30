export default (name, defaultValue = null) => {
  const element = document.head.querySelector(`meta[name=${name}]`);

  if (element) {
    return element.content;
  }

  return defaultValue;
};
