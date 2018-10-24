/* vtt.js - v0.12.1 (https://github.com/mozilla/vtt.js) built on 08-07-2015 */ ! function (a) {
  var b = a.vttjs = {}, c = b.VTTCue,
    d = b.VTTRegion,
    e = a.VTTCue,
    f = a.VTTRegion;
  b.shim = function () {
    b.VTTCue = c, b.VTTRegion = d
  }, b.restore = function () {
    b.VTTCue = e, b.VTTRegion = f
  }
}(this),
  function (a, b) {
    function c(a) {
      if ("string" != typeof a) return !1;
      var b = h[a.toLowerCase()];
      return b ? a.toLowerCase() : !1
    }
    function d(a) {
      if ("string" != typeof a) return !1;
      var b = i[a.toLowerCase()];
      return b ? a.toLowerCase() : !1
    }
    function e(a) {
      for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        for (var d in c) a[d] = c[d]
      }
      return a
    }
    function f(a, b, f) {
      var h = this,
        i = /MSIE\s8\.0/.test(navigator.userAgent),
        j = {};
      i ? h = document.createElement("custom") : j.enumerable = !0, h.hasBeenReset = !1;
      var k = "",
        l = !1,
        m = a,
        n = b,
        o = f,
        p = null,
        q = "",
        r = !0,
        s = "auto",
        t = "start",
        u = 50,
        v = "middle",
        w = 50,
        x = "middle";
      return Object.defineProperty(h, "id", e({}, j, {
        get: function () {
          return k
        },
        set: function (a) {
          k = "" + a
        }
      })), Object.defineProperty(h, "pauseOnExit", e({}, j, {
        get: function () {
          return l
        },
        set: function (a) {
          l = !!a
        }
      })), Object.defineProperty(h, "startTime", e({}, j, {
        get: function () {
          return m
        },
        set: function (a) {
          if ("number" != typeof a) throw new TypeError("Start time must be set to a number.");
          m = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "endTime", e({}, j, {
        get: function () {
          return n
        },
        set: function (a) {
          if ("number" != typeof a) throw new TypeError("End time must be set to a number.");
          n = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "text", e({}, j, {
        get: function () {
          return o
        },
        set: function (a) {
          o = "" + a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "region", e({}, j, {
        get: function () {
          return p
        },
        set: function (a) {
          p = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "vertical", e({}, j, {
        get: function () {
          return q
        },
        set: function (a) {
          var b = c(a);
          if (b === !1) throw new SyntaxError("An invalid or illegal string was specified.");
          q = b, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "snapToLines", e({}, j, {
        get: function () {
          return r
        },
        set: function (a) {
          r = !!a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "line", e({}, j, {
        get: function () {
          return s
        },
        set: function (a) {
          if ("number" != typeof a && a !== g) throw new SyntaxError(
            "An invalid number or illegal string was specified.");
          s = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "lineAlign", e({}, j, {
        get: function () {
          return t
        },
        set: function (a) {
          var b = d(a);
          if (!b) throw new SyntaxError("An invalid or illegal string was specified.");
          t = b, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "position", e({}, j, {
        get: function () {
          return u
        },
        set: function (a) {
          if (0 > a || a > 100) throw new Error("Position must be between 0 and 100.");
          u = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "positionAlign", e({}, j, {
        get: function () {
          return v
        },
        set: function (a) {
          var b = d(a);
          if (!b) throw new SyntaxError("An invalid or illegal string was specified.");
          v = b, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "size", e({}, j, {
        get: function () {
          return w
        },
        set: function (a) {
          if (0 > a || a > 100) throw new Error("Size must be between 0 and 100.");
          w = a, this.hasBeenReset = !0
        }
      })), Object.defineProperty(h, "align", e({}, j, {
        get: function () {
          return x
        },
        set: function (a) {
          var b = d(a);
          if (!b) throw new SyntaxError("An invalid or illegal string was specified.");
          x = b, this.hasBeenReset = !0
        }
      })), h.displayState = void 0, i ? h : void 0
    }
    var g = "auto",
      h = {
        "": !0,
        lr: !0,
        rl: !0
      }, i = {
        start: !0,
        middle: !0,
        end: !0,
        left: !0,
        right: !0
      };
    f.prototype.getCueAsHTML = function () {
      return WebVTT.convertCueToDOMTree(window, this.text)
    }, a.VTTCue = a.VTTCue || f, b.VTTCue = f
  }(this, this.vttjs || {}),
  function (a, b) {
    function c(a) {
      if ("string" != typeof a) return !1;
      var b = f[a.toLowerCase()];
      return b ? a.toLowerCase() : !1
    }
    function d(a) {
      return "number" == typeof a && a >= 0 && 100 >= a
    }
    function e() {
      var a = 100,
        b = 3,
        e = 0,
        f = 100,
        g = 0,
        h = 100,
        i = "";
      Object.defineProperties(this, {
        width: {
          enumerable: !0,
          get: function () {
            return a
          },
          set: function (b) {
            if (!d(b)) throw new Error("Width must be between 0 and 100.");
            a = b
          }
        },
        lines: {
          enumerable: !0,
          get: function () {
            return b
          },
          set: function (a) {
            if ("number" != typeof a) throw new TypeError("Lines must be set to a number.");
            b = a
          }
        },
        regionAnchorY: {
          enumerable: !0,
          get: function () {
            return f
          },
          set: function (a) {
            if (!d(a)) throw new Error("RegionAnchorX must be between 0 and 100.");
            f = a
          }
        },
        regionAnchorX: {
          enumerable: !0,
          get: function () {
            return e
          },
          set: function (a) {
            if (!d(a)) throw new Error("RegionAnchorY must be between 0 and 100.");
            e = a
          }
        },
        viewportAnchorY: {
          enumerable: !0,
          get: function () {
            return h
          },
          set: function (a) {
            if (!d(a)) throw new Error("ViewportAnchorY must be between 0 and 100.");
            h = a
          }
        },
        viewportAnchorX: {
          enumerable: !0,
          get: function () {
            return g
          },
          set: function (a) {
            if (!d(a)) throw new Error("ViewportAnchorX must be between 0 and 100.");
            g = a
          }
        },
        scroll: {
          enumerable: !0,
          get: function () {
            return i
          },
          set: function (a) {
            var b = c(a);
            if (b === !1) throw new SyntaxError("An invalid or illegal string was specified.");
            i = b
          }
        }
      })
    }
    var f = {
      "": !0,
      up: !0
    };
    a.VTTRegion = a.VTTRegion || e, b.VTTRegion = e
  }(this, this.vttjs || {}),
  function (a) {
    function b(a, b) {
      this.name = "ParsingError", this.code = a.code, this.message = b || a.message
    }
    function c(a) {
      function b(a, b, c, d) {
        return 3600 * (0 | a) + 60 * (0 | b) + (0 | c) + (0 | d) / 1e3
      }
      var c = a.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
      return c ? c[3] ? b(c[1], c[2], c[3].replace(":", ""), c[4]) : c[1] > 59 ? b(c[1], c[2], 0, c[4]) : b(0, c[1],
        c[2], c[4]) : null
    }
    function d() {
      this.values = o(null)
    }
    function e(a, b, c, d) {
      var e = d ? a.split(d) : [a];
      for (var f in e) if ("string" == typeof e[f]) {
        var g = e[f].split(c);
        if (2 === g.length) {
          var h = g[0],
            i = g[1];
          b(h, i)
        }
      }
    }
    function f(a, f, g) {
      function h() {
        var d = c(a);
        if (null === d) throw new b(b.Errors.BadTimeStamp, "Malformed timestamp: " + k);
        return a = a.replace(/^[^\sa-zA-Z-]+/, ""), d
      }
      function i(a, b) {
        var c = new d;
        e(a, function (a, b) {
          switch (a) {
            case "region":
              for (var d = g.length - 1; d >= 0; d--) if (g[d].id === b) {
                c.set(a, g[d].region);
                break
              }
              break;
            case "vertical":
              c.alt(a, b, ["rl", "lr"]);
              break;
            case "line":
              var e = b.split(","),
                f = e[0];
              c.integer(a, f), c.percent(a, f) ? c.set("snapToLines", !1) : null, c.alt(a, f, ["auto"]), 2 === e.length &&
                c.alt("lineAlign", e[1], ["start", "middle", "end"]);
              break;
            case "position":
              e = b.split(","), c.percent(a, e[0]), 2 === e.length && c.alt("positionAlign", e[1], ["start",
                "middle", "end"]);
              break;
            case "size":
              c.percent(a, b);
              break;
            case "align":
              c.alt(a, b, ["start", "middle", "end", "left", "right"])
          }
        }, /:/, /\s/), b.region = c.get("region", null), b.vertical = c.get("vertical", ""), b.line = c.get("line",
          "auto"), b.lineAlign = c.get("lineAlign", "start"), b.snapToLines = c.get("snapToLines", !0), b.size =
          c.get("size", 100), b.align = c.get("align", "middle"), b.position = c.get("position", {
            start: 0,
            left: 0,
            middle: 50,
            end: 100,
            right: 100
          }, b.align), b.positionAlign = c.get("positionAlign", {
            start: "start",
            left: "start",
            middle: "middle",
            end: "end",
            right: "end"
          }, b.align)
      }
      function j() {
        a = a.replace(/^\s+/, "")
      }
      var k = a;
      if (j(), f.startTime = h(), j(), "-->" !== a.substr(0, 3)) throw new b(b.Errors.BadTimeStamp,
        "Malformed time stamp (time stamps must be separated by '-->'): " + k);
      a = a.substr(3), j(), f.endTime = h(), j(), i(a, f)
    }
    function g(a, b) {
      function d() {
        function a(a) {
          return b = b.substr(a.length), a
        }
        if (!b) return null;
        var c = b.match(/^([^<]*)(<[^>]+>?)?/);
        return a(c[1] ? c[1] : c[2])
      }
      function e(a) {
        return p[a]
      }
      function f(a) {
        for (; o = a.match(/&(amp|lt|gt|lrm|rlm|nbsp);/);) a = a.replace(o[0], e);
        return a
      }
      function g(a, b) {
        return !s[b.localName] || s[b.localName] === a.localName
      }
      function h(b, c) {
        var d = q[b];
        if (!d) return null;
        var e = a.document.createElement(d);
        e.localName = d;
        var f = r[b];
        return f && c && (e[f] = c.trim()), e
      }
      for (var i, j = a.document.createElement("div"), k = j, l = []; null !== (i = d());) if ("<" !== i[0]) k.appendChild(
        a.document.createTextNode(f(i)));
      else {
        if ("/" === i[1]) {
          l.length && l[l.length - 1] === i.substr(2).replace(">", "") && (l.pop(), k = k.parentNode);
          continue
        }
        var m, n = c(i.substr(1, i.length - 2));
        if (n) {
          m = a.document.createProcessingInstruction("timestamp", n), k.appendChild(m);
          continue
        }
        var o = i.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
        if (!o) continue;
        if (m = h(o[1], o[3]), !m) continue;
        if (!g(k, m)) continue;
        o[2] && (m.className = o[2].substr(1).replace(".", " ")), l.push(o[1]), k.appendChild(m), k = m
      }
      return j
    }
    function h(a) {
      function b(a, b) {
        for (var c = b.childNodes.length - 1; c >= 0; c--) a.push(b.childNodes[c])
      }
      function c(a) {
        if (!a || !a.length) return null;
        var d = a.pop(),
          e = d.textContent || d.innerText;
        if (e) {
          var f = e.match(/^.*(\n|\r)/);
          return f ? (a.length = 0, f[0]) : e
        }
        return "ruby" === d.tagName ? c(a) : d.childNodes ? (b(a, d), c(a)) : void 0
      }
      var d, e = [],
        f = "";
      if (!a || !a.childNodes) return "ltr";
      for (b(e, a); f = c(e);) for (var g = 0; g < f.length; g++) {
        d = f.charCodeAt(g);
        for (var h = 0; h < t.length; h++) if (t[h] === d) return "rtl"
      }
      return "ltr"
    }
    function i(a) {
      if ("number" == typeof a.line && (a.snapToLines || a.line >= 0 && a.line <= 100)) return a.line;
      if (!a.track || !a.track.textTrackList || !a.track.textTrackList.mediaElement) return -1;
      for (var b = a.track, c = b.textTrackList, d = 0, e = 0; e < c.length && c[e] !== b; e++) "showing" === c[e].mode &&
        d++;
      return -1 * ++d
    }
    function j() { }
    function k(a, b, c) {
      var d = /MSIE\s8\.0/.test(navigator.userAgent),
        e = "rgba(255, 255, 255, 1)",
        f = "rgba(0, 0, 0, 0.8)";
      d && (e = "rgb(255, 255, 255)", f = "rgb(0, 0, 0)"), j.call(this), this.cue = b, this.cueDiv = g(a, b.text);
      var i = {
        color: e,
        backgroundColor: f,
        position: "relative",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "inline"
      };
      d || (i.writingMode = "" === b.vertical ? "horizontal-tb" : "lr" === b.vertical ? "vertical-lr" : "vertical-rl",
        i.unicodeBidi = "plaintext"), this.applyStyles(i, this.cueDiv), this.div = a.document.createElement("div"),
        i = {
          textAlign: "middle" === b.align ? "center" : b.align,
          font: c.font,
          whiteSpace: "pre-line",
          position: "absolute"
        }, d || (i.direction = h(this.cueDiv), i.writingMode = "" === b.vertical ? "horizontal-tb" : "lr" === b.vertical ?
          "vertical-lr" : "vertical-rl".stylesunicodeBidi = "plaintext"), this.applyStyles(i), this.div.appendChild(
            this.cueDiv);
      var k = 0;
      switch (b.positionAlign) {
        case "start":
          k = b.position;
          break;
        case "middle":
          k = b.position - b.size / 2;
          break;
        case "end":
          k = b.position - b.size
      }
      this.applyStyles("" === b.vertical ? {
        left: this.formatStyle(k, "%"),
        width: this.formatStyle(b.size, "%")
      } : {
          top: this.formatStyle(k, "%"),
          height: this.formatStyle(b.size, "%")
        }), this.move = function (a) {
          this.applyStyles({
            top: this.formatStyle(a.top, "px"),
            bottom: this.formatStyle(a.bottom, "px"),
            left: this.formatStyle(a.left, "px"),
            right: this.formatStyle(a.right, "px"),
            height: this.formatStyle(a.height, "px"),
            width: this.formatStyle(a.width, "px")
          })
        }
    }
    function l(a) {
      var b, c, d, e, f = /MSIE\s8\.0/.test(navigator.userAgent);
      if (a.div) {
        c = a.div.offsetHeight, d = a.div.offsetWidth, e = a.div.offsetTop;
        var g = (g = a.div.childNodes) && (g = g[0]) && g.getClientRects && g.getClientRects();
        a = a.div.getBoundingClientRect(), b = g ? Math.max(g[0] && g[0].height || 0, a.height / g.length) : 0
      }
      this.left = a.left, this.right = a.right, this.top = a.top || e, this.height = a.height || c, this.bottom = a.bottom ||
        e + (a.height || c), this.width = a.width || d, this.lineHeight = void 0 !== b ? b : a.lineHeight, f && !
        this.lineHeight && (this.lineHeight = 13)
    }
    function m(a, b, c, d) {
      function e(a, b) {
        for (var e, f = new l(a), g = 1, h = 0; h < b.length; h++) {
          for (; a.overlapsOppositeAxis(c, b[h]) || a.within(c) && a.overlapsAny(d);) a.move(b[h]);
          if (a.within(c)) return a;
          var i = a.intersectPercentage(c);
          g > i && (e = new l(a), g = i), a = new l(f)
        }
        return e || f
      }
      var f = new l(b),
        g = b.cue,
        h = i(g),
        j = [];
      if (g.snapToLines) {
        var k;
        switch (g.vertical) {
          case "":
            j = ["+y", "-y"], k = "height";
            break;
          case "rl":
            j = ["+x", "-x"], k = "width";
            break;
          case "lr":
            j = ["-x", "+x"], k = "width"
        }
        var m = f.lineHeight,
          n = m * Math.round(h),
          o = c[k] + m,
          p = j[0];
        Math.abs(n) > o && (n = 0 > n ? -1 : 1, n *= Math.ceil(o / m) * m), 0 > h && (n += "" === g.vertical ? c.height :
          c.width, j = j.reverse()), f.move(p, n)
      } else {
        var q = f.lineHeight / c.height * 100;
        switch (g.lineAlign) {
          case "middle":
            h -= q / 2;
            break;
          case "end":
            h -= q
        }
        switch (g.vertical) {
          case "":
            b.applyStyles({
              top: b.formatStyle(h, "%")
            });
            break;
          case "rl":
            b.applyStyles({
              left: b.formatStyle(h, "%")
            });
            break;
          case "lr":
            b.applyStyles({
              right: b.formatStyle(h, "%")
            })
        }
        j = ["+y", "-x", "+x", "-y"], f = new l(b)
      }
      var r = e(f, j);
      b.move(r.toCSSCompatValues(c))
    }
    function n() { }
    var o = Object.create || function () {
      function a() { }
      return function (b) {
        if (1 !== arguments.length) throw new Error("Object.create shim only accepts one parameter.");
        return a.prototype = b, new a
      }
    }();
    b.prototype = o(Error.prototype), b.prototype.constructor = b, b.Errors = {
      BadSignature: {
        code: 0,
        message: "Malformed WebVTT signature."
      },
      BadTimeStamp: {
        code: 1,
        message: "Malformed time stamp."
      }
    }, d.prototype = {
      set: function (a, b) {
        this.get(a) || "" === b || (this.values[a] = b)
      },
      get: function (a, b, c) {
        return c ? this.has(a) ? this.values[a] : b[c] : this.has(a) ? this.values[a] : b
      },
      has: function (a) {
        return a in this.values
      },
      alt: function (a, b, c) {
        for (var d = 0; d < c.length; ++d) if (b === c[d]) {
          this.set(a, b);
          break
        }
      },
      integer: function (a, b) {
        /^-?\d+$/.test(b) && this.set(a, parseInt(b, 10))
      },
      percent: function (a, b) {
        var c;
        return (c = b.match(/^([\d]{1,3})(\.[\d]*)?%$/)) && (b = parseFloat(b), b >= 0 && 100 >= b) ? (this.set(a,
          b), !0) : !1
      }
    };
    var p = {
      "&": "&",
      "<": "<",
      ">": ">",
      "‎": "‎",
      "‏": "‏",
      " ": " "
    }, q = {
      c: "span",
      i: "i",
      b: "b",
      u: "u",
      ruby: "ruby",
      rt: "rt",
      v: "span",
      lang: "span"
    }, r = {
      v: "title",
      lang: "lang"
    }, s = {
      rt: "ruby"
    }, t = [1470, 1472, 1475, 1478, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500,
      1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1520, 1521, 1522,
      1523, 1524, 1544, 1547, 1549, 1563, 1566, 1567, 1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576,
      1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593,
      1594, 1595, 1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610,
      1645, 1646, 1647, 1649, 1650, 1651, 1652, 1653, 1654, 1655, 1656, 1657, 1658, 1659, 1660, 1661, 1662,
      1663, 1664, 1665, 1666, 1667, 1668, 1669, 1670, 1671, 1672, 1673, 1674, 1675, 1676, 1677, 1678, 1679,
      1680, 1681, 1682, 1683, 1684, 1685, 1686, 1687, 1688, 1689, 1690, 1691, 1692, 1693, 1694, 1695, 1696,
      1697, 1698, 1699, 1700, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1708, 1709, 1710, 1711, 1712, 1713,
      1714, 1715, 1716, 1717, 1718, 1719, 1720, 1721, 1722, 1723, 1724, 1725, 1726, 1727, 1728, 1729, 1730,
      1731, 1732, 1733, 1734, 1735, 1736, 1737, 1738, 1739, 1740, 1741, 1742, 1743, 1744, 1745, 1746, 1747,
      1748, 1749, 1765, 1766, 1774, 1775, 1786, 1787, 1788, 1789, 1790, 1791, 1792, 1793, 1794, 1795, 1796,
      1797, 1798, 1799, 1800, 1801, 1802, 1803, 1804, 1805, 1807, 1808, 1810, 1811, 1812, 1813, 1814, 1815,
      1816, 1817, 1818, 1819, 1820, 1821, 1822, 1823, 1824, 1825, 1826, 1827, 1828, 1829, 1830, 1831, 1832,
      1833, 1834, 1835, 1836, 1837, 1838, 1839, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878,
      1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895,
      1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912,
      1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929,
      1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946,
      1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1969, 1984, 1985, 1986, 1987, 1988,
      1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2e3, 2001, 2002, 2003, 2004, 2005,
      2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
      2023, 2024, 2025, 2026, 2036, 2037, 2042, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057,
      2058, 2059, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2074, 2084, 2088, 2096, 2097,
      2098, 2099, 2100, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110, 2112, 2113, 2114, 2115,
      2116, 2117, 2118, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2126, 2127, 2128, 2129, 2130, 2131, 2132,
      2133, 2134, 2135, 2136, 2142, 2208, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220,
      8207, 64285, 64287, 64288, 64289, 64290, 64291, 64292, 64293, 64294, 64295, 64296, 64298, 64299, 64300,
      64301, 64302, 64303, 64304, 64305, 64306, 64307, 64308, 64309, 64310, 64312, 64313, 64314, 64315, 64316,
      64318, 64320, 64321, 64323, 64324, 64326, 64327, 64328, 64329, 64330, 64331, 64332, 64333, 64334, 64335,
      64336, 64337, 64338, 64339, 64340, 64341, 64342, 64343, 64344, 64345, 64346, 64347, 64348, 64349, 64350,
      64351, 64352, 64353, 64354, 64355, 64356, 64357, 64358, 64359, 64360, 64361, 64362, 64363, 64364, 64365,
      64366, 64367, 64368, 64369, 64370, 64371, 64372, 64373, 64374, 64375, 64376, 64377, 64378, 64379, 64380,
      64381, 64382, 64383, 64384, 64385, 64386, 64387, 64388, 64389, 64390, 64391, 64392, 64393, 64394, 64395,
      64396, 64397, 64398, 64399, 64400, 64401, 64402, 64403, 64404, 64405, 64406, 64407, 64408, 64409, 64410,
      64411, 64412, 64413, 64414, 64415, 64416, 64417, 64418, 64419, 64420, 64421, 64422, 64423, 64424, 64425,
      64426, 64427, 64428, 64429, 64430, 64431, 64432, 64433, 64434, 64435, 64436, 64437, 64438, 64439, 64440,
      64441, 64442, 64443, 64444, 64445, 64446, 64447, 64448, 64449, 64467, 64468, 64469, 64470, 64471, 64472,
      64473, 64474, 64475, 64476, 64477, 64478, 64479, 64480, 64481, 64482, 64483, 64484, 64485, 64486, 64487,
      64488, 64489, 64490, 64491, 64492, 64493, 64494, 64495, 64496, 64497, 64498, 64499, 64500, 64501, 64502,
      64503, 64504, 64505, 64506, 64507, 64508, 64509, 64510, 64511, 64512, 64513, 64514, 64515, 64516, 64517,
      64518, 64519, 64520, 64521, 64522, 64523, 64524, 64525, 64526, 64527, 64528, 64529, 64530, 64531, 64532,
      64533, 64534, 64535, 64536, 64537, 64538, 64539, 64540, 64541, 64542, 64543, 64544, 64545, 64546, 64547,
      64548, 64549, 64550, 64551, 64552, 64553, 64554, 64555, 64556, 64557, 64558, 64559, 64560, 64561, 64562,
      64563, 64564, 64565, 64566, 64567, 64568, 64569, 64570, 64571, 64572, 64573, 64574, 64575, 64576, 64577,
      64578, 64579, 64580, 64581, 64582, 64583, 64584, 64585, 64586, 64587, 64588, 64589, 64590, 64591, 64592,
      64593, 64594, 64595, 64596, 64597, 64598, 64599, 64600, 64601, 64602, 64603, 64604, 64605, 64606, 64607,
      64608, 64609, 64610, 64611, 64612, 64613, 64614, 64615, 64616, 64617, 64618, 64619, 64620, 64621, 64622,
      64623, 64624, 64625, 64626, 64627, 64628, 64629, 64630, 64631, 64632, 64633, 64634, 64635, 64636, 64637,
      64638, 64639, 64640, 64641, 64642, 64643, 64644, 64645, 64646, 64647, 64648, 64649, 64650, 64651, 64652,
      64653, 64654, 64655, 64656, 64657, 64658, 64659, 64660, 64661, 64662, 64663, 64664, 64665, 64666, 64667,
      64668, 64669, 64670, 64671, 64672, 64673, 64674, 64675, 64676, 64677, 64678, 64679, 64680, 64681, 64682,
      64683, 64684, 64685, 64686, 64687, 64688, 64689, 64690, 64691, 64692, 64693, 64694, 64695, 64696, 64697,
      64698, 64699, 64700, 64701, 64702, 64703, 64704, 64705, 64706, 64707, 64708, 64709, 64710, 64711, 64712,
      64713, 64714, 64715, 64716, 64717, 64718, 64719, 64720, 64721, 64722, 64723, 64724, 64725, 64726, 64727,
      64728, 64729, 64730, 64731, 64732, 64733, 64734, 64735, 64736, 64737, 64738, 64739, 64740, 64741, 64742,
      64743, 64744, 64745, 64746, 64747, 64748, 64749, 64750, 64751, 64752, 64753, 64754, 64755, 64756, 64757,
      64758, 64759, 64760, 64761, 64762, 64763, 64764, 64765, 64766, 64767, 64768, 64769, 64770, 64771, 64772,
      64773, 64774, 64775, 64776, 64777, 64778, 64779, 64780, 64781, 64782, 64783, 64784, 64785, 64786, 64787,
      64788, 64789, 64790, 64791, 64792, 64793, 64794, 64795, 64796, 64797, 64798, 64799, 64800, 64801, 64802,
      64803, 64804, 64805, 64806, 64807, 64808, 64809, 64810, 64811, 64812, 64813, 64814, 64815, 64816, 64817,
      64818, 64819, 64820, 64821, 64822, 64823, 64824, 64825, 64826, 64827, 64828, 64829, 64848, 64849, 64850,
      64851, 64852, 64853, 64854, 64855, 64856, 64857, 64858, 64859, 64860, 64861, 64862, 64863, 64864, 64865,
      64866, 64867, 64868, 64869, 64870, 64871, 64872, 64873, 64874, 64875, 64876, 64877, 64878, 64879, 64880,
      64881, 64882, 64883, 64884, 64885, 64886, 64887, 64888, 64889, 64890, 64891, 64892, 64893, 64894, 64895,
      64896, 64897, 64898, 64899, 64900, 64901, 64902, 64903, 64904, 64905, 64906, 64907, 64908, 64909, 64910,
      64911, 64914, 64915, 64916, 64917, 64918, 64919, 64920, 64921, 64922, 64923, 64924, 64925, 64926, 64927,
      64928, 64929, 64930, 64931, 64932, 64933, 64934, 64935, 64936, 64937, 64938, 64939, 64940, 64941, 64942,
      64943, 64944, 64945, 64946, 64947, 64948, 64949, 64950, 64951, 64952, 64953, 64954, 64955, 64956, 64957,
      64958, 64959, 64960, 64961, 64962, 64963, 64964, 64965, 64966, 64967, 65008, 65009, 65010, 65011, 65012,
      65013, 65014, 65015, 65016, 65017, 65018, 65019, 65020, 65136, 65137, 65138, 65139, 65140, 65142, 65143,
      65144, 65145, 65146, 65147, 65148, 65149, 65150, 65151, 65152, 65153, 65154, 65155, 65156, 65157, 65158,
      65159, 65160, 65161, 65162, 65163, 65164, 65165, 65166, 65167, 65168, 65169, 65170, 65171, 65172, 65173,
      65174, 65175, 65176, 65177, 65178, 65179, 65180, 65181, 65182, 65183, 65184, 65185, 65186, 65187, 65188,
      65189, 65190, 65191, 65192, 65193, 65194, 65195, 65196, 65197, 65198, 65199, 65200, 65201, 65202, 65203,
      65204, 65205, 65206, 65207, 65208, 65209, 65210, 65211, 65212, 65213, 65214, 65215, 65216, 65217, 65218,
      65219, 65220, 65221, 65222, 65223, 65224, 65225, 65226, 65227, 65228, 65229, 65230, 65231, 65232, 65233,
      65234, 65235, 65236, 65237, 65238, 65239, 65240, 65241, 65242, 65243, 65244, 65245, 65246, 65247, 65248,
      65249, 65250, 65251, 65252, 65253, 65254, 65255, 65256, 65257, 65258, 65259, 65260, 65261, 65262, 65263,
      65264, 65265, 65266, 65267, 65268, 65269, 65270, 65271, 65272, 65273, 65274, 65275, 65276, 67584, 67585,
      67586, 67587, 67588, 67589, 67592, 67594, 67595, 67596, 67597, 67598, 67599, 67600, 67601, 67602, 67603,
      67604, 67605, 67606, 67607, 67608, 67609, 67610, 67611, 67612, 67613, 67614, 67615, 67616, 67617, 67618,
      67619, 67620, 67621, 67622, 67623, 67624, 67625, 67626, 67627, 67628, 67629, 67630, 67631, 67632, 67633,
      67634, 67635, 67636, 67637, 67639, 67640, 67644, 67647, 67648, 67649, 67650, 67651, 67652, 67653, 67654,
      67655, 67656, 67657, 67658, 67659, 67660, 67661, 67662, 67663, 67664, 67665, 67666, 67667, 67668, 67669,
      67671, 67672, 67673, 67674, 67675, 67676, 67677, 67678, 67679, 67840, 67841, 67842, 67843, 67844, 67845,
      67846, 67847, 67848, 67849, 67850, 67851, 67852, 67853, 67854, 67855, 67856, 67857, 67858, 67859, 67860,
      67861, 67862, 67863, 67864, 67865, 67866, 67867, 67872, 67873, 67874, 67875, 67876, 67877, 67878, 67879,
      67880, 67881, 67882, 67883, 67884, 67885, 67886, 67887, 67888, 67889, 67890, 67891, 67892, 67893, 67894,
      67895, 67896, 67897, 67903, 67968, 67969, 67970, 67971, 67972, 67973, 67974, 67975, 67976, 67977, 67978,
      67979, 67980, 67981, 67982, 67983, 67984, 67985, 67986, 67987, 67988, 67989, 67990, 67991, 67992, 67993,
      67994, 67995, 67996, 67997, 67998, 67999, 68e3, 68001, 68002, 68003, 68004, 68005, 68006, 68007, 68008,
      68009, 68010, 68011, 68012, 68013, 68014, 68015, 68016, 68017, 68018, 68019, 68020, 68021, 68022, 68023,
      68030, 68031, 68096, 68112, 68113, 68114, 68115, 68117, 68118, 68119, 68121, 68122, 68123, 68124, 68125,
      68126, 68127, 68128, 68129, 68130, 68131, 68132, 68133, 68134, 68135, 68136, 68137, 68138, 68139, 68140,
      68141, 68142, 68143, 68144, 68145, 68146, 68147, 68160, 68161, 68162, 68163, 68164, 68165, 68166, 68167,
      68176, 68177, 68178, 68179, 68180, 68181, 68182, 68183, 68184, 68192, 68193, 68194, 68195, 68196, 68197,
      68198, 68199, 68200, 68201, 68202, 68203, 68204, 68205, 68206, 68207, 68208, 68209, 68210, 68211, 68212,
      68213, 68214, 68215, 68216, 68217, 68218, 68219, 68220, 68221, 68222, 68223, 68352, 68353, 68354, 68355,
      68356, 68357, 68358, 68359, 68360, 68361, 68362, 68363, 68364, 68365, 68366, 68367, 68368, 68369, 68370,
      68371, 68372, 68373, 68374, 68375, 68376, 68377, 68378, 68379, 68380, 68381, 68382, 68383, 68384, 68385,
      68386, 68387, 68388, 68389, 68390, 68391, 68392, 68393, 68394, 68395, 68396, 68397, 68398, 68399, 68400,
      68401, 68402, 68403, 68404, 68405, 68416, 68417, 68418, 68419, 68420, 68421, 68422, 68423, 68424, 68425,
      68426, 68427, 68428, 68429, 68430, 68431, 68432, 68433, 68434, 68435, 68436, 68437, 68440, 68441, 68442,
      68443, 68444, 68445, 68446, 68447, 68448, 68449, 68450, 68451, 68452, 68453, 68454, 68455, 68456, 68457,
      68458, 68459, 68460, 68461, 68462, 68463, 68464, 68465, 68466, 68472, 68473, 68474, 68475, 68476, 68477,
      68478, 68479, 68608, 68609, 68610, 68611, 68612, 68613, 68614, 68615, 68616, 68617, 68618, 68619, 68620,
      68621, 68622, 68623, 68624, 68625, 68626, 68627, 68628, 68629, 68630, 68631, 68632, 68633, 68634, 68635,
      68636, 68637, 68638, 68639, 68640, 68641, 68642, 68643, 68644, 68645, 68646, 68647, 68648, 68649, 68650,
      68651, 68652, 68653, 68654, 68655, 68656, 68657, 68658, 68659, 68660, 68661, 68662, 68663, 68664, 68665,
      68666, 68667, 68668, 68669, 68670, 68671, 68672, 68673, 68674, 68675, 68676, 68677, 68678, 68679, 68680,
      126464, 126465, 126466, 126467, 126469, 126470, 126471, 126472, 126473, 126474, 126475, 126476, 126477,
      126478, 126479, 126480, 126481, 126482, 126483, 126484, 126485, 126486, 126487, 126488, 126489, 126490,
      126491, 126492, 126493, 126494, 126495, 126497, 126498, 126500, 126503, 126505, 126506, 126507, 126508,
      126509, 126510, 126511, 126512, 126513, 126514, 126516, 126517, 126518, 126519, 126521, 126523, 126530,
      126535, 126537, 126539, 126541, 126542, 126543, 126545, 126546, 126548, 126551, 126553, 126555, 126557,
      126559, 126561, 126562, 126564, 126567, 126568, 126569, 126570, 126572, 126573, 126574, 126575, 126576,
      126577, 126578, 126580, 126581, 126582, 126583, 126585, 126586, 126587, 126588, 126590, 126592, 126593,
      126594, 126595, 126596, 126597, 126598, 126599, 126600, 126601, 126603, 126604, 126605, 126606, 126607,
      126608, 126609, 126610, 126611, 126612, 126613, 126614, 126615, 126616, 126617, 126618, 126619, 126625,
      126626, 126627, 126629, 126630, 126631, 126632, 126633, 126635, 126636, 126637, 126638, 126639, 126640,
      126641, 126642, 126643, 126644, 126645, 126646, 126647, 126648, 126649, 126650, 126651, 1114109];
    j.prototype.applyStyles = function (a, b) {
      b = b || this.div;
      for (var c in a) a.hasOwnProperty(c) && (b.style[c] = a[c])
    }, j.prototype.formatStyle = function (a, b) {
      return 0 === a ? 0 : a + b
    }, k.prototype = o(j.prototype), k.prototype.constructor = k, l.prototype.move = function (a, b) {
      switch (b = void 0 !== b ? b : this.lineHeight, a) {
        case "+x":
          this.left += b, this.right += b;
          break;
        case "-x":
          this.left -= b, this.right -= b;
          break;
        case "+y":
          this.top += b, this.bottom += b;
          break;
        case "-y":
          this.top -= b, this.bottom -= b
      }
    }, l.prototype.overlaps = function (a) {
      return this.left < a.right && this.right > a.left && this.top < a.bottom && this.bottom > a.top
    }, l.prototype.overlapsAny = function (a) {
      for (var b = 0; b < a.length; b++) if (this.overlaps(a[b])) return !0;
      return !1
    }, l.prototype.within = function (a) {
      return this.top >= a.top && this.bottom <= a.bottom && this.left >= a.left && this.right <= a.right
    }, l.prototype.overlapsOppositeAxis = function (a, b) {
      switch (b) {
        case "+x":
          return this.left < a.left;
        case "-x":
          return this.right > a.right;
        case "+y":
          return this.top < a.top;
        case "-y":
          return this.bottom > a.bottom
      }
    }, l.prototype.intersectPercentage = function (a) {
      var b = Math.max(0, Math.min(this.right, a.right) - Math.max(this.left, a.left)),
        c = Math.max(0, Math.min(this.bottom, a.bottom) - Math.max(this.top, a.top)),
        d = b * c;
      return d / (this.height * this.width)
    }, l.prototype.toCSSCompatValues = function (a) {
      return {
        top: this.top - a.top,
        bottom: a.bottom - this.bottom,
        left: this.left - a.left,
        right: a.right - this.right,
        height: this.height,
        width: this.width
      }
    }, l.getSimpleBoxPosition = function (a) {
      var b = a.div ? a.div.offsetHeight : a.tagName ? a.offsetHeight : 0,
        c = a.div ? a.div.offsetWidth : a.tagName ? a.offsetWidth : 0,
        d = a.div ? a.div.offsetTop : a.tagName ? a.offsetTop : 0;
      a = a.div ? a.div.getBoundingClientRect() : a.tagName ? a.getBoundingClientRect() : a;
      var e = {
        left: a.left,
        right: a.right,
        top: a.top || d,
        height: a.height || b,
        bottom: a.bottom || d + (a.height || b),
        width: a.width || c
      };
      return e
    }, n.StringDecoder = function () {
      return {
        decode: function (a) {
          if (!a) return "";
          if ("string" != typeof a) throw new Error("Error - expected string data.");
          return decodeURIComponent(encodeURIComponent(a))
        }
      }
    }, n.convertCueToDOMTree = function (a, b) {
      return a && b ? g(a, b) : null
    };
    var u = .05,
      v = "sans-serif",
      w = "1.5%";
    n.processCues = function (a, b, c) {
      function d(a) {
        for (var b = 0; b < a.length; b++) if (a[b].hasBeenReset || !a[b].displayState) return !0;
        return !1
      }
      if (!a || !b || !c) return null;
      for (; c.firstChild;) c.removeChild(c.firstChild);
      var e = a.document.createElement("div");
      if (e.style.position = "absolute", e.style.left = "0", e.style.right = "0", e.style.top = "0", e.style.bottom =
        "0", e.style.margin = w, c.appendChild(e), d(b)) {
        var f = [],
          g = l.getSimpleBoxPosition(e),
          h = Math.round(g.height * u * 100) / 100,
          i = {
            font: h + "px " + v
          };
        ! function () {
          for (var c, d, h = 0; h < b.length; h++) d = b[h], c = new k(a, d, i), e.appendChild(c.div), m(a, c, g,
            f), d.displayState = c.div, f.push(l.getSimpleBoxPosition(c))
        }()
      } else for (var j = 0; j < b.length; j++) e.appendChild(b[j].displayState)
    }, n.Parser = function (a, b, c) {
      c || (c = b, b = {}), b || (b = {}), this.window = a, this.vttjs = b, this.state = "INITIAL", this.buffer = "",
        this.decoder = c || new TextDecoder("utf8"), this.regionList = []
    }, n.Parser.prototype = {
      reportOrThrowError: function (a) {
        if (!(a instanceof b)) throw a;
        this.onparsingerror && this.onparsingerror(a)
      },
      parse: function (a) {
        function c() {
          for (var a = i.buffer, b = 0; b < a.length && "\r" !== a[b] && "\n" !== a[b];)++b;
          var c = a.substr(0, b);
          return "\r" === a[b] && ++b, "\n" === a[b] && ++b, i.buffer = a.substr(b), c
        }
        function g(a) {
          var b = new d;
          if (e(a, function (a, c) {
            switch (a) {
              case "id":
                b.set(a, c);
                break;
              case "width":
                b.percent(a, c);
                break;
              case "lines":
                b.integer(a, c);
                break;
              case "regionanchor":
              case "viewportanchor":
                var e = c.split(",");
                if (2 !== e.length) break;
                var f = new d;
                if (f.percent("x", e[0]), f.percent("y", e[1]), !f.has("x") || !f.has("y")) break;
                b.set(a + "X", f.get("x")), b.set(a + "Y", f.get("y"));
                break;
              case "scroll":
                b.alt(a, c, ["up"])
            }
          }, /=/, /\s/), b.has("id")) {
            var c = new (i.vttjs.VTTRegion || i.window.VTTRegion);
            c.width = b.get("width", 100), c.lines = b.get("lines", 3), c.regionAnchorX = b.get("regionanchorX",
              0), c.regionAnchorY = b.get("regionanchorY", 100), c.viewportAnchorX = b.get("viewportanchorX",
                0), c.viewportAnchorY = b.get("viewportanchorY", 100), c.scroll = b.get("scroll", ""), i.onregion &&
              i.onregion(c), i.regionList.push({
                id: b.get("id"),
                region: c
              })
          }
        }
        function h(a) {
          e(a, function (a, b) {
            switch (a) {
              case "Region":
                g(b)
            }
          }, /:/)
        }
        var i = this;
        a && (i.buffer += i.decoder.decode(a, {
          stream: !0
        }));
        try {
          var j;
          if ("INITIAL" === i.state) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            j = c();
            var k = j.match(/^WEBVTT([ \t].*)?$/);
            if (!k || !k[0]) throw new b(b.Errors.BadSignature);
            i.state = "HEADER"
          }
          for (var l = !1; i.buffer;) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            switch (l ? l = !1 : j = c(), i.state) {
              case "HEADER":
                /:/.test(j) ? h(j) : j || (i.state = "ID");
                continue;
              case "NOTE":
                j || (i.state = "ID");
                continue;
              case "ID":
                if (/^NOTE($|[ \t])/.test(j)) {
                  i.state = "NOTE";
                  break
                }
                if (!j) continue;
                if (i.cue = new (i.vttjs.VTTCue || i.window.VTTCue)(0, 0, ""), i.state = "CUE", -1 === j.indexOf(
                  "-->")) {
                  i.cue.id = j;
                  continue
                }
              case "CUE":
                try {
                  f(j, i.cue, i.regionList)
                } catch (m) {
                  i.reportOrThrowError(m), i.cue = null, i.state = "BADCUE";
                  continue
                }
                i.state = "CUETEXT";
                continue;
              case "CUETEXT":
                var n = -1 !== j.indexOf("-->");
                if (!j || n && (l = !0)) {
                  i.oncue && i.oncue(i.cue), i.cue = null, i.state = "ID";
                  continue
                }
                i.cue.text && (i.cue.text += "\n"), i.cue.text += j;
                continue;
              case "BADCUE":
                j || (i.state = "ID");
                continue
            }
          }
        } catch (m) {
          i.reportOrThrowError(m), "CUETEXT" === i.state && i.cue && i.oncue && i.oncue(i.cue), i.cue = null, i.state =
            "INITIAL" === i.state ? "BADWEBVTT" : "BADCUE"
        }
        return this
      },
      flush: function () {
        var a = this;
        try {
          if (a.buffer += a.decoder.decode(), (a.cue || "HEADER" === a.state) && (a.buffer += "\n\n", a.parse()),
            "INITIAL" === a.state) throw new b(b.Errors.BadSignature)
        } catch (c) {
          a.reportOrThrowError(c)
        }
        return a.onflush && a.onflush(), this
      }
    }, a.WebVTT = n
  }(this, this.vttjs || {});