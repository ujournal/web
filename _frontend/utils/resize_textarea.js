export default function resizeTextarea() {
  requestAnimationFrame(() => {
    Array.from(document.querySelectorAll("textarea")).forEach((element) => {
      element.dispatchEvent(new CustomEvent("autosize"));
    });
  });
}
