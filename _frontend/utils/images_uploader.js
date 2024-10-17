import Uploader from "./uploader";

export default new Uploader(
  "image",
  "/images",
  true,
  ["image/jpeg", "image/png", "image/webp"],
  1024,
);
