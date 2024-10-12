import Alpine from "alpinejs";
import api from "../utils/api";

export default (url = null, removable = false) => {
  return {
    scrolledStart: false,
    scrolledEnd: false,
    id: null,
    url,
    images: [],
    removable,

    async init() {
      if (this.url) {
        const id = parseInt(new URL(this.url).pathname, 10);

        const { data } = await api.get(`/galleries/${id}`);

        this.id = data.id;
        this.images = data.images;
      }
    },

    async store(images) {
      this.$dispatch("gallery-started", { url: this.url });

      try {
        const { data } = this.id
          ? await api.put(`/galleries/${this.id}`, { images })
          : await api.post("/galleries", { images });

        this.id = data.id;
        this.images = data.images;
        this.url = `gallery:${data.id}`;

        this.$dispatch("gallery-succeed", { url: this.url, gallery: data });
      } catch (error) {
        this.$dispatch("gallery-failed", { url: this.url, error });
      }
    },

    template() {
      return `<div
        class="gallery" x-show="images.length > 0"
        x-on:gallery-remove="handleRemove"
      >
        <div
          x-data="carousel(images, removable)"
          x-bind:class="{
            'gallery-carousel': true,
            'gallery-scrolled-start': scrolledStart,
            'gallery-scrolled-end': scrolledEnd
          }"
          x-on:carousel-prev.window="handlePrev"
          x-on:carousel-next.window="handleNext"
        >
            <template x-for="(image, index) in images">
                <div class="gallery-item">
                    <img
                        x-bind:src="image"
                        x-bind:style="{ '--image': 'url(' + image + ')' }"
                        x-on:load="handleImageLoad"
                    />
                    <template x-if="removable">
                      <button
                          type="button"
                          class="gallery-remove"
                          x-bind:data-url="image"
                          x-on:click="$dispatch('gallery-remove', { image })"
                      ></button>
                    </template>
                </div>
            </template>
        </div>
        <button
            type="button"
            class="gallery-button gallery-button-start"
            x-on:click="prev"
        ></button>
        <button
            type="button"
            class="gallery-button gallery-button-end"
            x-on:click="next"
        ></button>
      </div>`;
    },

    prev() {
      this.$dispatch("carousel-prev", { url: this.url });
    },

    next() {
      this.$dispatch("carousel-next", { url: this.url });
    },

    handleRemove(event) {
      const url = event.detail.image;
      this.store(Alpine.raw(this.images).filter((image) => image !== url));
    },

    handleAdd(event) {
      this.store([...this.images, ...event.detail.images]);
    },
  };
};
