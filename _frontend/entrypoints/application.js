import Alpine from "alpinejs";
import { registerModules } from "../utils/register_modules";

registerModules(
  import.meta.glob("../components/**/index.js", {
    eager: true,
  }),
);

window.Alpine = Alpine;

Alpine.start();
