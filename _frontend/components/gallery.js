import Alpine from "alpinejs";
import api from "../utils/api";

export default (data = null, removable = false) => {
  return {
    scrolledStart: false,
    scrolledEnd: false,
    data,
    removable,

    async store(images) {
      this.$dispatch("gallery-started", { id: this.data?.id });

      try {
        const { data } = this.id
          ? await api.post(`/galleries/${this.data.id}`, {
              images,
              _method: "put",
            })
          : await api.post("/galleries", { images });

        this.data = data;

        this.$dispatch("gallery-succeed", { gallery: data });
      } catch (error) {
        this.$dispatch("gallery-failed", { error });
      }
    },

    template() {
      if (!Boolean(this.data)) {
        return "";
      }

      return `<div
        class="gallery"
        x-on:gallery-remove="handleRemove"
      >
        <div
          x-data="carousel(data.images, removable)"
          x-bind:class="{
            'gallery-carousel': true,
            'gallery-scrolled-start': scrolledStart,
            'gallery-scrolled-end': scrolledEnd
          }"
          x-on:carousel-prev.window="handlePrev"
          x-on:carousel-next.window="handleNext"
        >
            <template x-for="(image, index) in data.images">
                <div class="gallery-item">
                    <img
                        alt=" "
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
      this.$dispatch("carousel-prev", { id: this.data.id });
    },

    next() {
      this.$dispatch("carousel-next", { id: this.data.id });
    },

    handleRemove(event) {
      const url = event.detail.image;
      const images = Alpine.raw(this.data.images).filter(
        (image) => image !== url,
      );

      this.store(images);
    },

    handleAdd(event) {
      this.store([...(this.data?.images || []), ...event.detail.images]);
    },

    handleSetData(event) {
      this.data = event.detail.data;
    },
  };
};
