import Alpine from "alpinejs";
import { registerModules } from "../utils/register_modules";
import Autosize from "@marcreichel/alpine-autosize";

registerModules(
  import.meta.glob("../components/**/index.js", {
    eager: true,
  }),
);

Alpine.plugin(Autosize);

window.Alpine = Alpine;

Alpine.start();
