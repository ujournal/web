import { visit as turboVisit } from "@hotwired/turbo";
import router from "./router";

export default function visit(name, params = {}) {
  return turboVisit(router.buildPath(name, params));
}

export function currentRoute() {
  return router.parse(new URL(location).pathname);
}
