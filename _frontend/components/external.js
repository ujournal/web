import externals from "../utils/externals";

export default (data = null, removable = false) => {
  return {
    data,
    removable,

    template() {
      if (!Boolean(this.data)) {
        return "";
      }

      return `<div class="external">
          <a
            class="external-summary"
            target="_blank"
            rel="noreferrer"
            x-bind:href="data.url"
            x-bind:title="titleFormatted"
          >
              <template x-if="data.icon">
                  <img class="external-icon" x-bind:src="data.icon" />
              </template>
              <template x-if="hasTitle">
                  <div
                      class="external-title"
                      x-text="titleFormatted"
                  ></div>
              </template>
              <div
                  class="external-caption"
                  x-text="caption"
              ></div>
          </a>
          <template x-if="data.image">
            <img
              class="external-image"
              x-bind:src="data.image"
              x-bind:style="{ '--image': 'url(' + data.image + ')' }"
              x-on:load="handleImageLoad"
            />
          </template>
          <template x-if="removable">
            <button
                type="button"
                class="external-remove"
                x-on:click="remove"
            ></button>
          </template>
      </div>`;
    },

    async resolve(url) {
      this.$dispatch("external-started", { id: this.data?.id });

      try {
        const data = await externals.resolve(url);

        this.data = data;

        this.$dispatch("external-succeed", { id: this.data.id, data });
      } catch (error) {
        this.data = null;

        this.$dispatch("external-failed", { id: this.data.id, error });
      }
    },

    hasTitle() {
      return Boolean(
        this.data.title || this.data.author_name || this.data.description,
      );
    },

    titleFormatted() {
      if (this.data.title || this.data.author_name) {
        return this.data.title || this.data.author_name;
      }

      if (this.data.description) {
        return this.data.description.substring(0, 240);
      }

      return null;
    },

    host() {
      if (this.data?.url) {
        return new URL(this.data.url).host;
      }

      return "";
    },

    caption() {
      return this.host();
    },

    remove() {
      this.$dispatch("external-removed", { id: this.data.id });
    },

    handleImageLoad(event) {
      const ratio = event.target.naturalWidth / event.target.naturalHeight;
      const isCover = ratio > 1.49 && ratio < 2.2;
      event.target.style.objectFit = isCover ? "cover" : "contain";
    },

    handleResolve(event) {
      this.resolve(event.detail.url);
    },

    handleSetData(event) {
      this.data = event.detail.data;
    },
  };
};
