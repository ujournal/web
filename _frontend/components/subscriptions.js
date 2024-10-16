import subscriber from "../utils/subscriber";

export default () => {
  return {
    subscriptions: [],

    init() {
      this.load();
    },

    async load() {
      this.subscriptions = await subscriber.getSubscriptions();
    },

    async handleSubscribe(event) {
      //
    },

    async handleUnsubscribe(event) {
      //
    },
  };
};
