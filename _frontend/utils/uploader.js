import imageCompression from "browser-image-compression";
import api from "../utils/api";

export default class Uploader {
  constructor(
    fieldName,
    endpoint,
    isImages = false,
    mimeTypes = [],
    size = 1024,
  ) {
    this.fieldName = fieldName;
    this.endpoint = endpoint;
    this.isImages = isImages;
    this.mimeTypes = mimeTypes;
    this.size = size;
  }

  async upload(file, signal) {
    if (this.isImages && file.size > this.size) {
      file = await imageCompression(file, {
        maxSizeMB: Math.floor((this.size / 1024) * 10) / 10,
        maxWidthOrHeight: 2000,
      });
    }

    const formData = new FormData();
    formData.append(this.fieldName, file);

    return await api.post(this.endpoint, formData, {
      validateStatus: () => true,
      signal,
    });
  }

  async uploadMany(files, signal) {
    files =
      this.mimeTypes.length === 0
        ? files
        : Array.from(files).filter((file) =>
            this.mimeTypes.includes(file.type),
          );

    if (files.length === 0) {
      return;
    }

    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(this.upload(files[i], signal));
    }

    const results = await Promise.all(promises);

    const succeed = results
      .filter((result) => result.status === 200 || result.status === 201)
      .map((result) => result.data);
    const failed = results.filter(
      (result) => result.status !== 200 && result.status !== 201,
    );

    return { succeed, failed };
  }
}
