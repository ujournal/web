import externals from "../utils/externals";

export default (url = null, data = null) => {
  return {
    url,
    data,

    init() {
      if (this.url) {
        this.resolveUrl();
      }
    },

    template() {
      return `<template x-if="data">
          <div class="external">
              <a
                class="external-summary"
                target="_blank"
                rel="noreferrer"
                x-bind:href="data.url"
              >
                  <template x-if="data.icon">
                      <div class="external-icon">
                          <img x-bind:src="data.icon" />
                      </div>
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
                <img x-bind:src="data.image" class="external-image" />
              </template>
          </div>
      </template>`;
    },

    async resolveUrl() {
      this.data = await externals.resolve(this.url);
    },

    hasTitle() {
      return Boolean(
        this.data.title || this.data.authorName || this.data.description,
      );
    },

    titleFormatted() {
      if (this.data.title || this.data.authorName) {
        return this.data.title || this.data.authorName;
      }

      if (this.data.description) {
        return this.data.description.substring(0, 240);
      }

      return null;
    },

    caption() {
      return new URL(this.data.url).host;
    },
  };
};
