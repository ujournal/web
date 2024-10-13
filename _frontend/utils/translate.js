import api from "./api";

export const ENGLISH_REGEXP = /^[A-Za-z0-9]*$/;

export default async function translate(text) {
  return (
    await api.post("/translate", {
      text,
    })
  ).data;
}
