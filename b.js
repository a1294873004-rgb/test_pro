(function (window) {
  // SVG 内容由 webpack 插件注入
  var svgString =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style>\n    .sprite-symbol-usage {display: none;}\n    .sprite-symbol-usage:target {display: inline;}\n  </style></defs><use xlink:href="#IconSVG-Authors" class="sprite-symbol-usage" /></svg>';

  if (!svgString) return;

  function injectSVG() {
    try {
      var div = document.createElement("div");
      div.innerHTML = svgString;

      var svg = div.getElementsByTagName("svg")[0];
      if (!svg) return;

      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.overflow = "hidden";

      var body = document.body;
      if (!body) return;

      if (body.firstChild) {
        body.insertBefore(svg, body.firstChild);
      } else {
        body.appendChild(svg);
      }
    } catch (e) {
      console && console.error("SVG chunk inject failed:", e);
    }
  }

  // 如果文档已经 ready，则直接注入
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(injectSVG, 0);
  } else {
    document.addEventListener("DOMContentLoaded", injectSVG);
  }
})(window);
