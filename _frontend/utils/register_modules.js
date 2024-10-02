export function registerModules(modules) {
  Object.entries(modules).forEach(
    ([path, _module]) =>
      (window[path.split("/").slice(2)[0].replace(".js", "")] =
        _module.default),
  );
}
