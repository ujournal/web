import Router from "url-router";
import insertUrlParams from "inserturlparams";

const routes = {
  "/": "home",
  "/post/:id": "post.show",
  "/editor/:id": "post.edit",
};

export default {
  routes,
  router: new Router(routes),

  parse(path) {
    const route = this.router.find(path);

    if (!route) {
      return null;
    }

    return {
      name: route.handler,
      params: route.params,
    };
  },

  buildPath(name, params = {}) {
    const path = Object.keys(routes).find((key) => routes[key] === name);

    if (!path) {
      throw new Error(`Route with name '${name}' is not found`);
    }

    return insertUrlParams(path, params);
  },
};
