import { AxiosError } from "axios";

export default {
  setFormErrors(form, errors) {
    Array.from(form.elements).forEach((element) => {
      const name = element.getAttribute("name");

      if (!name) {
        return;
      }

      if (errors[name]) {
        element.setCustomValidity(errors[name][0]);
      } else {
        element.setCustomValidity("");
      }
    });
  },

  async sendForm(form, api) {
    form.removeAttribute("data-message");
    form.toggleAttribute("data-busy", true);

    this.setFormErrors(form, {});

    try {
      const data = new FormData(form);

      data.set(
        "_method",
        (form.getAttribute("method") ?? "post").toLowerCase(),
      );

      return await api.request({
        url: form.getAttribute("action"),
        method: "post",
        data,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        const errors = error.response?.data?.errors || {};

        form.setAttribute("data-message", message);

        this.setFormErrors(form, errors);

        form.reportValidity();
      }

      throw error;
    } finally {
      form.toggleAttribute("data-busy", false);
    }
  },
};
