function isMatchFlavour(widgetFlavour, block) {
  if (widgetFlavour.endsWith("/*")) {
    const path = widgetFlavour.slice(0, -2).split("/");
    let current = block.parent;
    for (let i = path.length - 1; i >= 0; i--) {
      if (!current || current.flavour !== path[i]) {
        return false;
      }
      current = current.parent;
    }
    return true;
  }
  return block.flavour === widgetFlavour;
}

isMatchFlavour("yidooo-image/yidooo-video/*", {
  flavour: "yidooo-image",
});
