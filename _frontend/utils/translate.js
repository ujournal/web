import api from "./api";

export function isItEnglish(text) {
  const english = /^[A-Za-z0-9]*$/;

  return english.test(text.replace(/[^\p{L}]/gu, ""));
}

export default async function translate(text) {
  return (
    await api.post("/translate", {
      text,
    })
  ).data;
}
