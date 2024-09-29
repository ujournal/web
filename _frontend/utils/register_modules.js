export function registerModules(modules) {
  Object.entries(modules).forEach(
    ([path, _module]) =>
      (window[path.split("/").slice(2, -1)] = _module.default),
  );
}
