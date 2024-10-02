import { sendForm } from "../utils/send_form_via_api";

export default () => {
  return {
    async submit() {
      await sendForm("/posts", this.$root);
    },
  };
};
