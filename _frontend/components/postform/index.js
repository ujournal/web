import api from "../../utils/api";
import { sendForm } from "../../utils/send_form_via_api";

export default () => {
  return {
    async submit() {
      await sendForm("/posts", this.$root);
      // const result = await api.post("/posts", new FormData(this.$root));
      // console.log(result);
    },
  };
};
