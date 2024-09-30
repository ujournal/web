import { AxiosError } from "axios";
import api from "./api";

export async function sendForm(url, form) {
  form.removeAttribute("data-message");
  form.setAttribute("data-busy", "");

  try {
    return await api.post(url, new FormData(form));
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;

      form.setAttribute("data-message", message);

      console.log(message);
    }
  } finally {
    form.removeAttribute("data-busy");
  }
}
