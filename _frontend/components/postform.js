import { sendForm } from "../utils/send_form";
import api from "../utils/api";

export default () => {
  return {
    async submit() {
      await sendForm("/posts", this.$root, api);
    },
  };
};
