import { AxiosError } from "axios";
import api from "./api";

function setFormErrors(form, errors) {
  Array.from(form.elements).forEach((element) => {
    const name = element.getAttribute("name");

    if (!name) {
      return;
    }

    if (errors[name]) {
      console.log(element, errors[name]);

      element.setCustomValidity(errors[name][0]);
    } else {
      element.setCustomValidity("");
    }
  });
}

export async function sendForm(url, form) {
  form.removeAttribute("data-message");
  form.toggleAttribute("data-busy", true);

  setFormErrors(form, {});

  try {
    return await api.post(url, new FormData(form));
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      const errors = error.response?.data?.errors || {};

      form.setAttribute("data-message", message);

      setFormErrors(form, errors);
    }
  } finally {
    form.toggleAttribute("data-busy", false);
  }
}
