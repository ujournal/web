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

    host() {
      return new URL(this.data.url).host;
    },

    caption() {
      return this.host();
    },

    handleImageLoad(event) {
      const ratio = event.target.naturalWidth / event.target.naturalHeight;
      const isCover = ratio > 1.49 && ratio < 2.2;
      event.target.style.objectFit = isCover ? "cover" : "contain";
    },
  };
};
