import api from "../utils/api";

export default () => {
  return {
    subscriptions: [],

    async init() {
      if (this.$root.hasAttribute("data-cache")) {
        this.subscriptions = JSON.parse(this.$root.getAttribute("data-cache"));
      } else {
        const { data } = await api.get("/subscriptions");

        this.subscriptions = data;

        this.$root.setAttribute("data-cache", JSON.stringify(data));
      }
    },
  };
};
