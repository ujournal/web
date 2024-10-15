export default {
  locale: "uk-UA",

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
  formatDateShort(date) {
    const formatter = new Intl.RelativeTimeFormat(this.locale, {
      style: "short",
    });

    const units = [
      [60, "second"],
      [120, "minute"],
      [7200, "hour"],
      [172800, "day"],
      [1209600, "week"],
      [4838400, "month"],
      [58060800, "year"],
    ];

    const delta = Math.ceil((new Date().getTime() - date.getTime()) / 1000);

    let unit = "year",
      time = 0;

    for (let i = 1; i < units.length; i++) {
      const [div, name] = units[i - 1];

      if (delta < units[i][0]) {
        unit = name;
        time = Math.ceil(delta / div);
        break;
      }
    }

    return formatter.format(time * -1, unit);
  },

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  formatDateLong(date) {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      dateStyle: "long",
      timeStyle: "short",
    });

    return formatter.format(date);
  },
};
