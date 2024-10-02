import Alpine from "alpinejs";
import { registerModules } from "../utils/register_modules";
import Autosize from "@marcreichel/alpine-autosize";
import "../vendors/css-anchor-positioning";

registerModules(
  import.meta.glob("../components/*.js", {
    eager: true,
  }),
);

Alpine.plugin(Autosize);

window.Alpine = Alpine;

Alpine.start();
