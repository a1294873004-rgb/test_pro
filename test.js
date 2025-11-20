((window._iconfont_svg_string_4641755 = ""),
  ((l) => {
    var a = (h = (h = document.getElementsByTagName("script"))[
        h.length - 1
      ]).getAttribute("data-injectcss"),
      h = h.getAttribute("data-disable-injectsvg");
    if (!h) {
      var v,
        i,
        o,
        z,
        c,
        t = function (a, h) {
          h.parentNode.insertBefore(a, h);
        };
      if (a && !l.__iconfont__svg__cssinject__) {
        l.__iconfont__svg__cssinject__ = !0;
        try {
          document.write(
            "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
          );
        } catch (a) {
          console && console.log(a);
        }
      }
      ((v = function () {
        var a,
          h = document.createElement("div");
        ((h.innerHTML = l._iconfont_svg_string_4641755),
          (h = h.getElementsByTagName("svg")[0]) &&
            (h.setAttribute("aria-hidden", "true"),
            (h.style.position = "absolute"),
            (h.style.width = 0),
            (h.style.height = 0),
            (h.style.overflow = "hidden"),
            (h = h),
            (a = document.body).firstChild
              ? t(h, a.firstChild)
              : a.appendChild(h)));
      }),
        document.addEventListener
          ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
            ? setTimeout(v, 0)
            : ((i = function () {
                (document.removeEventListener("DOMContentLoaded", i, !1), v());
              }),
              document.addEventListener("DOMContentLoaded", i, !1))
          : document.attachEvent &&
            ((o = v),
            (z = l.document),
            (c = !1),
            p(),
            (z.onreadystatechange = function () {
              "complete" == z.readyState &&
                ((z.onreadystatechange = null), m());
            })));
    }
    function m() {
      c || ((c = !0), o());
    }
    function p() {
      try {
        z.documentElement.doScroll("left");
      } catch (a) {
        return void setTimeout(p, 50);
      }
      m();
    }
  })(window));
