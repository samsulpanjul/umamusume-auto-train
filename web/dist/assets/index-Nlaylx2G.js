function hw(t, r) {
  for (var o = 0; o < r.length; o++) {
    const l = r[o];
    if (typeof l != "string" && !Array.isArray(l)) {
      for (const c in l)
        if (c !== "default" && !(c in t)) {
          const u = Object.getOwnPropertyDescriptor(l, c);
          u &&
            Object.defineProperty(
              t,
              c,
              u.get ? u : { enumerable: !0, get: () => l[c] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(t, Symbol.toStringTag, { value: "Module" })
  );
}
(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const c of document.querySelectorAll('link[rel="modulepreload"]')) l(c);
  new MutationObserver((c) => {
    for (const u of c)
      if (u.type === "childList")
        for (const d of u.addedNodes)
          d.tagName === "LINK" && d.rel === "modulepreload" && l(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(c) {
    const u = {};
    return (
      c.integrity && (u.integrity = c.integrity),
      c.referrerPolicy && (u.referrerPolicy = c.referrerPolicy),
      c.crossOrigin === "use-credentials"
        ? (u.credentials = "include")
        : c.crossOrigin === "anonymous"
        ? (u.credentials = "omit")
        : (u.credentials = "same-origin"),
      u
    );
  }
  function l(c) {
    if (c.ep) return;
    c.ep = !0;
    const u = o(c);
    fetch(c.href, u);
  }
})();
function jy(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
var Gf = { exports: {} },
  zl = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cv;
function mw() {
  if (cv) return zl;
  cv = 1;
  var t = Symbol.for("react.transitional.element"),
    r = Symbol.for("react.fragment");
  function o(l, c, u) {
    var d = null;
    if (
      (u !== void 0 && (d = "" + u),
      c.key !== void 0 && (d = "" + c.key),
      "key" in c)
    ) {
      u = {};
      for (var h in c) h !== "key" && (u[h] = c[h]);
    } else u = c;
    return (
      (c = u.ref),
      { $$typeof: t, type: l, key: d, ref: c !== void 0 ? c : null, props: u }
    );
  }
  return (zl.Fragment = r), (zl.jsx = o), (zl.jsxs = o), zl;
}
var sv;
function pw() {
  return sv || ((sv = 1), (Gf.exports = mw())), Gf.exports;
}
var g = pw(),
  Yf = { exports: {} },
  we = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var uv;
function gw() {
  if (uv) return we;
  uv = 1;
  var t = Symbol.for("react.transitional.element"),
    r = Symbol.for("react.portal"),
    o = Symbol.for("react.fragment"),
    l = Symbol.for("react.strict_mode"),
    c = Symbol.for("react.profiler"),
    u = Symbol.for("react.consumer"),
    d = Symbol.for("react.context"),
    h = Symbol.for("react.forward_ref"),
    p = Symbol.for("react.suspense"),
    m = Symbol.for("react.memo"),
    v = Symbol.for("react.lazy"),
    x = Symbol.iterator;
  function _(T) {
    return T === null || typeof T != "object"
      ? null
      : ((T = (x && T[x]) || T["@@iterator"]),
        typeof T == "function" ? T : null);
  }
  var E = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    R = Object.assign,
    w = {};
  function C(T, q, J) {
    (this.props = T),
      (this.context = q),
      (this.refs = w),
      (this.updater = J || E);
  }
  (C.prototype.isReactComponent = {}),
    (C.prototype.setState = function (T, q) {
      if (typeof T != "object" && typeof T != "function" && T != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, T, q, "setState");
    }),
    (C.prototype.forceUpdate = function (T) {
      this.updater.enqueueForceUpdate(this, T, "forceUpdate");
    });
  function O() {}
  O.prototype = C.prototype;
  function D(T, q, J) {
    (this.props = T),
      (this.context = q),
      (this.refs = w),
      (this.updater = J || E);
  }
  var j = (D.prototype = new O());
  (j.constructor = D), R(j, C.prototype), (j.isPureReactComponent = !0);
  var B = Array.isArray,
    L = { H: null, A: null, T: null, S: null, V: null },
    F = Object.prototype.hasOwnProperty;
  function Y(T, q, J, Q, ee, ye) {
    return (
      (J = ye.ref),
      { $$typeof: t, type: T, key: q, ref: J !== void 0 ? J : null, props: ye }
    );
  }
  function G(T, q) {
    return Y(T.type, q, void 0, void 0, void 0, T.props);
  }
  function te(T) {
    return typeof T == "object" && T !== null && T.$$typeof === t;
  }
  function se(T) {
    var q = { "=": "=0", ":": "=2" };
    return (
      "$" +
      T.replace(/[=:]/g, function (J) {
        return q[J];
      })
    );
  }
  var re = /\/+/g;
  function ue(T, q) {
    return typeof T == "object" && T !== null && T.key != null
      ? se("" + T.key)
      : q.toString(36);
  }
  function ge() {}
  function he(T) {
    switch (T.status) {
      case "fulfilled":
        return T.value;
      case "rejected":
        throw T.reason;
      default:
        switch (
          (typeof T.status == "string"
            ? T.then(ge, ge)
            : ((T.status = "pending"),
              T.then(
                function (q) {
                  T.status === "pending" &&
                    ((T.status = "fulfilled"), (T.value = q));
                },
                function (q) {
                  T.status === "pending" &&
                    ((T.status = "rejected"), (T.reason = q));
                }
              )),
          T.status)
        ) {
          case "fulfilled":
            return T.value;
          case "rejected":
            throw T.reason;
        }
    }
    throw T;
  }
  function me(T, q, J, Q, ee) {
    var ye = typeof T;
    (ye === "undefined" || ye === "boolean") && (T = null);
    var ne = !1;
    if (T === null) ne = !0;
    else
      switch (ye) {
        case "bigint":
        case "string":
        case "number":
          ne = !0;
          break;
        case "object":
          switch (T.$$typeof) {
            case t:
            case r:
              ne = !0;
              break;
            case v:
              return (ne = T._init), me(ne(T._payload), q, J, Q, ee);
          }
      }
    if (ne)
      return (
        (ee = ee(T)),
        (ne = Q === "" ? "." + ue(T, 0) : Q),
        B(ee)
          ? ((J = ""),
            ne != null && (J = ne.replace(re, "$&/") + "/"),
            me(ee, q, J, "", function (Ee) {
              return Ee;
            }))
          : ee != null &&
            (te(ee) &&
              (ee = G(
                ee,
                J +
                  (ee.key == null || (T && T.key === ee.key)
                    ? ""
                    : ("" + ee.key).replace(re, "$&/") + "/") +
                  ne
              )),
            q.push(ee)),
        1
      );
    ne = 0;
    var W = Q === "" ? "." : Q + ":";
    if (B(T))
      for (var fe = 0; fe < T.length; fe++)
        (Q = T[fe]), (ye = W + ue(Q, fe)), (ne += me(Q, q, J, ye, ee));
    else if (((fe = _(T)), typeof fe == "function"))
      for (T = fe.call(T), fe = 0; !(Q = T.next()).done; )
        (Q = Q.value), (ye = W + ue(Q, fe++)), (ne += me(Q, q, J, ye, ee));
    else if (ye === "object") {
      if (typeof T.then == "function") return me(he(T), q, J, Q, ee);
      throw (
        ((q = String(T)),
        Error(
          "Objects are not valid as a React child (found: " +
            (q === "[object Object]"
              ? "object with keys {" + Object.keys(T).join(", ") + "}"
              : q) +
            "). If you meant to render a collection of children, use an array instead."
        ))
      );
    }
    return ne;
  }
  function z(T, q, J) {
    if (T == null) return T;
    var Q = [],
      ee = 0;
    return (
      me(T, Q, "", "", function (ye) {
        return q.call(J, ye, ee++);
      }),
      Q
    );
  }
  function V(T) {
    if (T._status === -1) {
      var q = T._result;
      (q = q()),
        q.then(
          function (J) {
            (T._status === 0 || T._status === -1) &&
              ((T._status = 1), (T._result = J));
          },
          function (J) {
            (T._status === 0 || T._status === -1) &&
              ((T._status = 2), (T._result = J));
          }
        ),
        T._status === -1 && ((T._status = 0), (T._result = q));
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var $ =
    typeof reportError == "function"
      ? reportError
      : function (T) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var q = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof T == "object" &&
                T !== null &&
                typeof T.message == "string"
                  ? String(T.message)
                  : String(T),
              error: T,
            });
            if (!window.dispatchEvent(q)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", T);
            return;
          }
          console.error(T);
        };
  function ae() {}
  return (
    (we.Children = {
      map: z,
      forEach: function (T, q, J) {
        z(
          T,
          function () {
            q.apply(this, arguments);
          },
          J
        );
      },
      count: function (T) {
        var q = 0;
        return (
          z(T, function () {
            q++;
          }),
          q
        );
      },
      toArray: function (T) {
        return (
          z(T, function (q) {
            return q;
          }) || []
        );
      },
      only: function (T) {
        if (!te(T))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return T;
      },
    }),
    (we.Component = C),
    (we.Fragment = o),
    (we.Profiler = c),
    (we.PureComponent = D),
    (we.StrictMode = l),
    (we.Suspense = p),
    (we.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = L),
    (we.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (T) {
        return L.H.useMemoCache(T);
      },
    }),
    (we.cache = function (T) {
      return function () {
        return T.apply(null, arguments);
      };
    }),
    (we.cloneElement = function (T, q, J) {
      if (T == null)
        throw Error(
          "The argument must be a React element, but you passed " + T + "."
        );
      var Q = R({}, T.props),
        ee = T.key,
        ye = void 0;
      if (q != null)
        for (ne in (q.ref !== void 0 && (ye = void 0),
        q.key !== void 0 && (ee = "" + q.key),
        q))
          !F.call(q, ne) ||
            ne === "key" ||
            ne === "__self" ||
            ne === "__source" ||
            (ne === "ref" && q.ref === void 0) ||
            (Q[ne] = q[ne]);
      var ne = arguments.length - 2;
      if (ne === 1) Q.children = J;
      else if (1 < ne) {
        for (var W = Array(ne), fe = 0; fe < ne; fe++)
          W[fe] = arguments[fe + 2];
        Q.children = W;
      }
      return Y(T.type, ee, void 0, void 0, ye, Q);
    }),
    (we.createContext = function (T) {
      return (
        (T = {
          $$typeof: d,
          _currentValue: T,
          _currentValue2: T,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (T.Provider = T),
        (T.Consumer = { $$typeof: u, _context: T }),
        T
      );
    }),
    (we.createElement = function (T, q, J) {
      var Q,
        ee = {},
        ye = null;
      if (q != null)
        for (Q in (q.key !== void 0 && (ye = "" + q.key), q))
          F.call(q, Q) &&
            Q !== "key" &&
            Q !== "__self" &&
            Q !== "__source" &&
            (ee[Q] = q[Q]);
      var ne = arguments.length - 2;
      if (ne === 1) ee.children = J;
      else if (1 < ne) {
        for (var W = Array(ne), fe = 0; fe < ne; fe++)
          W[fe] = arguments[fe + 2];
        ee.children = W;
      }
      if (T && T.defaultProps)
        for (Q in ((ne = T.defaultProps), ne))
          ee[Q] === void 0 && (ee[Q] = ne[Q]);
      return Y(T, ye, void 0, void 0, null, ee);
    }),
    (we.createRef = function () {
      return { current: null };
    }),
    (we.forwardRef = function (T) {
      return { $$typeof: h, render: T };
    }),
    (we.isValidElement = te),
    (we.lazy = function (T) {
      return { $$typeof: v, _payload: { _status: -1, _result: T }, _init: V };
    }),
    (we.memo = function (T, q) {
      return { $$typeof: m, type: T, compare: q === void 0 ? null : q };
    }),
    (we.startTransition = function (T) {
      var q = L.T,
        J = {};
      L.T = J;
      try {
        var Q = T(),
          ee = L.S;
        ee !== null && ee(J, Q),
          typeof Q == "object" &&
            Q !== null &&
            typeof Q.then == "function" &&
            Q.then(ae, $);
      } catch (ye) {
        $(ye);
      } finally {
        L.T = q;
      }
    }),
    (we.unstable_useCacheRefresh = function () {
      return L.H.useCacheRefresh();
    }),
    (we.use = function (T) {
      return L.H.use(T);
    }),
    (we.useActionState = function (T, q, J) {
      return L.H.useActionState(T, q, J);
    }),
    (we.useCallback = function (T, q) {
      return L.H.useCallback(T, q);
    }),
    (we.useContext = function (T) {
      return L.H.useContext(T);
    }),
    (we.useDebugValue = function () {}),
    (we.useDeferredValue = function (T, q) {
      return L.H.useDeferredValue(T, q);
    }),
    (we.useEffect = function (T, q, J) {
      var Q = L.H;
      if (typeof J == "function")
        throw Error(
          "useEffect CRUD overload is not enabled in this build of React."
        );
      return Q.useEffect(T, q);
    }),
    (we.useId = function () {
      return L.H.useId();
    }),
    (we.useImperativeHandle = function (T, q, J) {
      return L.H.useImperativeHandle(T, q, J);
    }),
    (we.useInsertionEffect = function (T, q) {
      return L.H.useInsertionEffect(T, q);
    }),
    (we.useLayoutEffect = function (T, q) {
      return L.H.useLayoutEffect(T, q);
    }),
    (we.useMemo = function (T, q) {
      return L.H.useMemo(T, q);
    }),
    (we.useOptimistic = function (T, q) {
      return L.H.useOptimistic(T, q);
    }),
    (we.useReducer = function (T, q, J) {
      return L.H.useReducer(T, q, J);
    }),
    (we.useRef = function (T) {
      return L.H.useRef(T);
    }),
    (we.useState = function (T) {
      return L.H.useState(T);
    }),
    (we.useSyncExternalStore = function (T, q, J) {
      return L.H.useSyncExternalStore(T, q, J);
    }),
    (we.useTransition = function () {
      return L.H.useTransition();
    }),
    (we.version = "19.1.1"),
    we
  );
}
var fv;
function Zd() {
  return fv || ((fv = 1), (Yf.exports = gw())), Yf.exports;
}
var y = Zd();
const nt = jy(y),
  zy = hw({ __proto__: null, default: nt }, [y]);
var Vf = { exports: {} },
  Ml = {},
  If = { exports: {} },
  qf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dv;
function vw() {
  return (
    dv ||
      ((dv = 1),
      (function (t) {
        function r(z, V) {
          var $ = z.length;
          z.push(V);
          e: for (; 0 < $; ) {
            var ae = ($ - 1) >>> 1,
              T = z[ae];
            if (0 < c(T, V)) (z[ae] = V), (z[$] = T), ($ = ae);
            else break e;
          }
        }
        function o(z) {
          return z.length === 0 ? null : z[0];
        }
        function l(z) {
          if (z.length === 0) return null;
          var V = z[0],
            $ = z.pop();
          if ($ !== V) {
            z[0] = $;
            e: for (var ae = 0, T = z.length, q = T >>> 1; ae < q; ) {
              var J = 2 * (ae + 1) - 1,
                Q = z[J],
                ee = J + 1,
                ye = z[ee];
              if (0 > c(Q, $))
                ee < T && 0 > c(ye, Q)
                  ? ((z[ae] = ye), (z[ee] = $), (ae = ee))
                  : ((z[ae] = Q), (z[J] = $), (ae = J));
              else if (ee < T && 0 > c(ye, $))
                (z[ae] = ye), (z[ee] = $), (ae = ee);
              else break e;
            }
          }
          return V;
        }
        function c(z, V) {
          var $ = z.sortIndex - V.sortIndex;
          return $ !== 0 ? $ : z.id - V.id;
        }
        if (
          ((t.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var u = performance;
          t.unstable_now = function () {
            return u.now();
          };
        } else {
          var d = Date,
            h = d.now();
          t.unstable_now = function () {
            return d.now() - h;
          };
        }
        var p = [],
          m = [],
          v = 1,
          x = null,
          _ = 3,
          E = !1,
          R = !1,
          w = !1,
          C = !1,
          O = typeof setTimeout == "function" ? setTimeout : null,
          D = typeof clearTimeout == "function" ? clearTimeout : null,
          j = typeof setImmediate < "u" ? setImmediate : null;
        function B(z) {
          for (var V = o(m); V !== null; ) {
            if (V.callback === null) l(m);
            else if (V.startTime <= z)
              l(m), (V.sortIndex = V.expirationTime), r(p, V);
            else break;
            V = o(m);
          }
        }
        function L(z) {
          if (((w = !1), B(z), !R))
            if (o(p) !== null) (R = !0), F || ((F = !0), ue());
            else {
              var V = o(m);
              V !== null && me(L, V.startTime - z);
            }
        }
        var F = !1,
          Y = -1,
          G = 5,
          te = -1;
        function se() {
          return C ? !0 : !(t.unstable_now() - te < G);
        }
        function re() {
          if (((C = !1), F)) {
            var z = t.unstable_now();
            te = z;
            var V = !0;
            try {
              e: {
                (R = !1), w && ((w = !1), D(Y), (Y = -1)), (E = !0);
                var $ = _;
                try {
                  t: {
                    for (
                      B(z), x = o(p);
                      x !== null && !(x.expirationTime > z && se());

                    ) {
                      var ae = x.callback;
                      if (typeof ae == "function") {
                        (x.callback = null), (_ = x.priorityLevel);
                        var T = ae(x.expirationTime <= z);
                        if (((z = t.unstable_now()), typeof T == "function")) {
                          (x.callback = T), B(z), (V = !0);
                          break t;
                        }
                        x === o(p) && l(p), B(z);
                      } else l(p);
                      x = o(p);
                    }
                    if (x !== null) V = !0;
                    else {
                      var q = o(m);
                      q !== null && me(L, q.startTime - z), (V = !1);
                    }
                  }
                  break e;
                } finally {
                  (x = null), (_ = $), (E = !1);
                }
                V = void 0;
              }
            } finally {
              V ? ue() : (F = !1);
            }
          }
        }
        var ue;
        if (typeof j == "function")
          ue = function () {
            j(re);
          };
        else if (typeof MessageChannel < "u") {
          var ge = new MessageChannel(),
            he = ge.port2;
          (ge.port1.onmessage = re),
            (ue = function () {
              he.postMessage(null);
            });
        } else
          ue = function () {
            O(re, 0);
          };
        function me(z, V) {
          Y = O(function () {
            z(t.unstable_now());
          }, V);
        }
        (t.unstable_IdlePriority = 5),
          (t.unstable_ImmediatePriority = 1),
          (t.unstable_LowPriority = 4),
          (t.unstable_NormalPriority = 3),
          (t.unstable_Profiling = null),
          (t.unstable_UserBlockingPriority = 2),
          (t.unstable_cancelCallback = function (z) {
            z.callback = null;
          }),
          (t.unstable_forceFrameRate = function (z) {
            0 > z || 125 < z
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
                )
              : (G = 0 < z ? Math.floor(1e3 / z) : 5);
          }),
          (t.unstable_getCurrentPriorityLevel = function () {
            return _;
          }),
          (t.unstable_next = function (z) {
            switch (_) {
              case 1:
              case 2:
              case 3:
                var V = 3;
                break;
              default:
                V = _;
            }
            var $ = _;
            _ = V;
            try {
              return z();
            } finally {
              _ = $;
            }
          }),
          (t.unstable_requestPaint = function () {
            C = !0;
          }),
          (t.unstable_runWithPriority = function (z, V) {
            switch (z) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                z = 3;
            }
            var $ = _;
            _ = z;
            try {
              return V();
            } finally {
              _ = $;
            }
          }),
          (t.unstable_scheduleCallback = function (z, V, $) {
            var ae = t.unstable_now();
            switch (
              (typeof $ == "object" && $ !== null
                ? (($ = $.delay),
                  ($ = typeof $ == "number" && 0 < $ ? ae + $ : ae))
                : ($ = ae),
              z)
            ) {
              case 1:
                var T = -1;
                break;
              case 2:
                T = 250;
                break;
              case 5:
                T = 1073741823;
                break;
              case 4:
                T = 1e4;
                break;
              default:
                T = 5e3;
            }
            return (
              (T = $ + T),
              (z = {
                id: v++,
                callback: V,
                priorityLevel: z,
                startTime: $,
                expirationTime: T,
                sortIndex: -1,
              }),
              $ > ae
                ? ((z.sortIndex = $),
                  r(m, z),
                  o(p) === null &&
                    z === o(m) &&
                    (w ? (D(Y), (Y = -1)) : (w = !0), me(L, $ - ae)))
                : ((z.sortIndex = T),
                  r(p, z),
                  R || E || ((R = !0), F || ((F = !0), ue()))),
              z
            );
          }),
          (t.unstable_shouldYield = se),
          (t.unstable_wrapCallback = function (z) {
            var V = _;
            return function () {
              var $ = _;
              _ = V;
              try {
                return z.apply(this, arguments);
              } finally {
                _ = $;
              }
            };
          });
      })(qf)),
    qf
  );
}
var hv;
function yw() {
  return hv || ((hv = 1), (If.exports = vw())), If.exports;
}
var Pf = { exports: {} },
  zt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var mv;
function bw() {
  if (mv) return zt;
  mv = 1;
  var t = Zd();
  function r(p) {
    var m = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        m += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return (
      "Minified React error #" +
      p +
      "; visit " +
      m +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function o() {}
  var l = {
      d: {
        f: o,
        r: function () {
          throw Error(r(522));
        },
        D: o,
        C: o,
        L: o,
        m: o,
        X: o,
        S: o,
        M: o,
      },
      p: 0,
      findDOMNode: null,
    },
    c = Symbol.for("react.portal");
  function u(p, m, v) {
    var x =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: x == null ? null : "" + x,
      children: p,
      containerInfo: m,
      implementation: v,
    };
  }
  var d = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(p, m) {
    if (p === "font") return "";
    if (typeof m == "string") return m === "use-credentials" ? m : "";
  }
  return (
    (zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l),
    (zt.createPortal = function (p, m) {
      var v =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!m || (m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11))
        throw Error(r(299));
      return u(p, m, null, v);
    }),
    (zt.flushSync = function (p) {
      var m = d.T,
        v = l.p;
      try {
        if (((d.T = null), (l.p = 2), p)) return p();
      } finally {
        (d.T = m), (l.p = v), l.d.f();
      }
    }),
    (zt.preconnect = function (p, m) {
      typeof p == "string" &&
        (m
          ? ((m = m.crossOrigin),
            (m =
              typeof m == "string"
                ? m === "use-credentials"
                  ? m
                  : ""
                : void 0))
          : (m = null),
        l.d.C(p, m));
    }),
    (zt.prefetchDNS = function (p) {
      typeof p == "string" && l.d.D(p);
    }),
    (zt.preinit = function (p, m) {
      if (typeof p == "string" && m && typeof m.as == "string") {
        var v = m.as,
          x = h(v, m.crossOrigin),
          _ = typeof m.integrity == "string" ? m.integrity : void 0,
          E = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
        v === "style"
          ? l.d.S(p, typeof m.precedence == "string" ? m.precedence : void 0, {
              crossOrigin: x,
              integrity: _,
              fetchPriority: E,
            })
          : v === "script" &&
            l.d.X(p, {
              crossOrigin: x,
              integrity: _,
              fetchPriority: E,
              nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            });
      }
    }),
    (zt.preinitModule = function (p, m) {
      if (typeof p == "string")
        if (typeof m == "object" && m !== null) {
          if (m.as == null || m.as === "script") {
            var v = h(m.as, m.crossOrigin);
            l.d.M(p, {
              crossOrigin: v,
              integrity: typeof m.integrity == "string" ? m.integrity : void 0,
              nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            });
          }
        } else m == null && l.d.M(p);
    }),
    (zt.preload = function (p, m) {
      if (
        typeof p == "string" &&
        typeof m == "object" &&
        m !== null &&
        typeof m.as == "string"
      ) {
        var v = m.as,
          x = h(v, m.crossOrigin);
        l.d.L(p, v, {
          crossOrigin: x,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          nonce: typeof m.nonce == "string" ? m.nonce : void 0,
          type: typeof m.type == "string" ? m.type : void 0,
          fetchPriority:
            typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
          referrerPolicy:
            typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
          imageSrcSet:
            typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
          imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
          media: typeof m.media == "string" ? m.media : void 0,
        });
      }
    }),
    (zt.preloadModule = function (p, m) {
      if (typeof p == "string")
        if (m) {
          var v = h(m.as, m.crossOrigin);
          l.d.m(p, {
            as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
            crossOrigin: v,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          });
        } else l.d.m(p);
    }),
    (zt.requestFormReset = function (p) {
      l.d.r(p);
    }),
    (zt.unstable_batchedUpdates = function (p, m) {
      return p(m);
    }),
    (zt.useFormState = function (p, m, v) {
      return d.H.useFormState(p, m, v);
    }),
    (zt.useFormStatus = function () {
      return d.H.useHostTransitionStatus();
    }),
    (zt.version = "19.1.1"),
    zt
  );
}
var pv;
function My() {
  if (pv) return Pf.exports;
  pv = 1;
  function t() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
      } catch (r) {
        console.error(r);
      }
  }
  return t(), (Pf.exports = bw()), Pf.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var gv;
function xw() {
  if (gv) return Ml;
  gv = 1;
  var t = yw(),
    r = Zd(),
    o = My();
  function l(e) {
    var n = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      n += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        n += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      n +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function c(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function u(e) {
    var n = e,
      a = e;
    if (e.alternate) for (; n.return; ) n = n.return;
    else {
      e = n;
      do (n = e), (n.flags & 4098) !== 0 && (a = n.return), (e = n.return);
      while (e);
    }
    return n.tag === 3 ? a : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (
        (n === null && ((e = e.alternate), e !== null && (n = e.memoizedState)),
        n !== null)
      )
        return n.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (u(e) !== e) throw Error(l(188));
  }
  function p(e) {
    var n = e.alternate;
    if (!n) {
      if (((n = u(e)), n === null)) throw Error(l(188));
      return n !== e ? null : e;
    }
    for (var a = e, i = n; ; ) {
      var s = a.return;
      if (s === null) break;
      var f = s.alternate;
      if (f === null) {
        if (((i = s.return), i !== null)) {
          a = i;
          continue;
        }
        break;
      }
      if (s.child === f.child) {
        for (f = s.child; f; ) {
          if (f === a) return h(s), e;
          if (f === i) return h(s), n;
          f = f.sibling;
        }
        throw Error(l(188));
      }
      if (a.return !== i.return) (a = s), (i = f);
      else {
        for (var b = !1, S = s.child; S; ) {
          if (S === a) {
            (b = !0), (a = s), (i = f);
            break;
          }
          if (S === i) {
            (b = !0), (i = s), (a = f);
            break;
          }
          S = S.sibling;
        }
        if (!b) {
          for (S = f.child; S; ) {
            if (S === a) {
              (b = !0), (a = f), (i = s);
              break;
            }
            if (S === i) {
              (b = !0), (i = f), (a = s);
              break;
            }
            S = S.sibling;
          }
          if (!b) throw Error(l(189));
        }
      }
      if (a.alternate !== i) throw Error(l(190));
    }
    if (a.tag !== 3) throw Error(l(188));
    return a.stateNode.current === a ? e : n;
  }
  function m(e) {
    var n = e.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return e;
    for (e = e.child; e !== null; ) {
      if (((n = m(e)), n !== null)) return n;
      e = e.sibling;
    }
    return null;
  }
  var v = Object.assign,
    x = Symbol.for("react.element"),
    _ = Symbol.for("react.transitional.element"),
    E = Symbol.for("react.portal"),
    R = Symbol.for("react.fragment"),
    w = Symbol.for("react.strict_mode"),
    C = Symbol.for("react.profiler"),
    O = Symbol.for("react.provider"),
    D = Symbol.for("react.consumer"),
    j = Symbol.for("react.context"),
    B = Symbol.for("react.forward_ref"),
    L = Symbol.for("react.suspense"),
    F = Symbol.for("react.suspense_list"),
    Y = Symbol.for("react.memo"),
    G = Symbol.for("react.lazy"),
    te = Symbol.for("react.activity"),
    se = Symbol.for("react.memo_cache_sentinel"),
    re = Symbol.iterator;
  function ue(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (re && e[re]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var ge = Symbol.for("react.client.reference");
  function he(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ge ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case R:
        return "Fragment";
      case C:
        return "Profiler";
      case w:
        return "StrictMode";
      case L:
        return "Suspense";
      case F:
        return "SuspenseList";
      case te:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case E:
          return "Portal";
        case j:
          return (e.displayName || "Context") + ".Provider";
        case D:
          return (e._context.displayName || "Context") + ".Consumer";
        case B:
          var n = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = n.displayName || n.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case Y:
          return (
            (n = e.displayName || null), n !== null ? n : he(e.type) || "Memo"
          );
        case G:
          (n = e._payload), (e = e._init);
          try {
            return he(e(n));
          } catch {}
      }
    return null;
  }
  var me = Array.isArray,
    z = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    V = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    $ = { pending: !1, data: null, method: null, action: null },
    ae = [],
    T = -1;
  function q(e) {
    return { current: e };
  }
  function J(e) {
    0 > T || ((e.current = ae[T]), (ae[T] = null), T--);
  }
  function Q(e, n) {
    T++, (ae[T] = e.current), (e.current = n);
  }
  var ee = q(null),
    ye = q(null),
    ne = q(null),
    W = q(null);
  function fe(e, n) {
    switch ((Q(ne, n), Q(ye, e), Q(ee, null), n.nodeType)) {
      case 9:
      case 11:
        e = (e = n.documentElement) && (e = e.namespaceURI) ? Lg(e) : 0;
        break;
      default:
        if (((e = n.tagName), (n = n.namespaceURI)))
          (n = Lg(n)), (e = Ug(n, e));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    J(ee), Q(ee, e);
  }
  function Ee() {
    J(ee), J(ye), J(ne);
  }
  function ce(e) {
    e.memoizedState !== null && Q(W, e);
    var n = ee.current,
      a = Ug(n, e.type);
    n !== a && (Q(ye, e), Q(ee, a));
  }
  function Ce(e) {
    ye.current === e && (J(ee), J(ye)),
      W.current === e && (J(W), (Tl._currentValue = $));
  }
  var _e = Object.prototype.hasOwnProperty,
    Qe = t.unstable_scheduleCallback,
    rt = t.unstable_cancelCallback,
    nn = t.unstable_shouldYield,
    rn = t.unstable_requestPaint,
    _t = t.unstable_now,
    ci = t.unstable_getCurrentPriorityLevel,
    Ea = t.unstable_ImmediatePriority,
    vn = t.unstable_UserBlockingPriority,
    Gn = t.unstable_NormalPriority,
    Ca = t.unstable_LowPriority,
    Bo = t.unstable_IdlePriority,
    si = t.log,
    zs = t.unstable_setDisableYieldValue,
    qr = null,
    ct = null;
  function kt(e) {
    if (
      (typeof si == "function" && zs(e),
      ct && typeof ct.setStrictMode == "function")
    )
      try {
        ct.setStrictMode(qr, e);
      } catch {}
  }
  var ht = Math.clz32 ? Math.clz32 : fi,
    ui = Math.log,
    Tn = Math.LN2;
  function fi(e) {
    return (e >>>= 0), e === 0 ? 32 : (31 - ((ui(e) / Tn) | 0)) | 0;
  }
  var Ra = 256,
    Aa = 4194304;
  function yn(e) {
    var n = e & 42;
    if (n !== 0) return n;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Pr(e, n, a) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var s = 0,
      f = e.suspendedLanes,
      b = e.pingedLanes;
    e = e.warmLanes;
    var S = i & 134217727;
    return (
      S !== 0
        ? ((i = S & ~f),
          i !== 0
            ? (s = yn(i))
            : ((b &= S),
              b !== 0
                ? (s = yn(b))
                : a || ((a = S & ~e), a !== 0 && (s = yn(a)))))
        : ((S = i & ~f),
          S !== 0
            ? (s = yn(S))
            : b !== 0
            ? (s = yn(b))
            : a || ((a = i & ~e), a !== 0 && (s = yn(a)))),
      s === 0
        ? 0
        : n !== 0 &&
          n !== s &&
          (n & f) === 0 &&
          ((f = s & -s),
          (a = n & -n),
          f >= a || (f === 32 && (a & 4194048) !== 0))
        ? n
        : s
    );
  }
  function Xr(e, n) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & n) === 0;
  }
  function di(e, n) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return n + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function hi() {
    var e = Ra;
    return (Ra <<= 1), (Ra & 4194048) === 0 && (Ra = 256), e;
  }
  function mi() {
    var e = Aa;
    return (Aa <<= 1), (Aa & 62914560) === 0 && (Aa = 4194304), e;
  }
  function Zo(e) {
    for (var n = [], a = 0; 31 > a; a++) n.push(e);
    return n;
  }
  function We(e, n) {
    (e.pendingLanes |= n),
      n !== 268435456 &&
        ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0));
  }
  function Lt(e, n, a, i, s, f) {
    var b = e.pendingLanes;
    (e.pendingLanes = a),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= a),
      (e.entangledLanes &= a),
      (e.errorRecoveryDisabledLanes &= a),
      (e.shellSuspendCounter = 0);
    var S = e.entanglements,
      A = e.expirationTimes,
      U = e.hiddenUpdates;
    for (a = b & ~a; 0 < a; ) {
      var I = 31 - ht(a),
        K = 1 << I;
      (S[I] = 0), (A[I] = -1);
      var Z = U[I];
      if (Z !== null)
        for (U[I] = null, I = 0; I < Z.length; I++) {
          var H = Z[I];
          H !== null && (H.lane &= -536870913);
        }
      a &= ~K;
    }
    i !== 0 && Nt(e, i, 0),
      f !== 0 && s === 0 && e.tag !== 0 && (e.suspendedLanes |= f & ~(b & ~n));
  }
  function Nt(e, n, a) {
    (e.pendingLanes |= n), (e.suspendedLanes &= ~n);
    var i = 31 - ht(n);
    (e.entangledLanes |= n),
      (e.entanglements[i] = e.entanglements[i] | 1073741824 | (a & 4194090));
  }
  function bn(e, n) {
    var a = (e.entangledLanes |= n);
    for (e = e.entanglements; a; ) {
      var i = 31 - ht(a),
        s = 1 << i;
      (s & n) | (e[i] & n) && (e[i] |= n), (a &= ~s);
    }
  }
  function Ot(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Et(e) {
    return (
      (e &= -e),
      2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function Vt() {
    var e = V.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : nv(e.type));
  }
  function ur(e, n) {
    var a = V.p;
    try {
      return (V.p = e), n();
    } finally {
      V.p = a;
    }
  }
  var Ye = Math.random().toString(36).slice(2),
    qe = "__reactFiber$" + Ye,
    Pe = "__reactProps$" + Ye,
    Dt = "__reactContainer$" + Ye,
    Yn = "__reactEvents$" + Ye,
    Kr = "__reactListeners$" + Ye,
    Nn = "__reactHandles$" + Ye,
    fr = "__reactResources$" + Ye,
    Vn = "__reactMarker$" + Ye;
  function Ms(e) {
    delete e[qe], delete e[Pe], delete e[Yn], delete e[Kr], delete e[Nn];
  }
  function Ta(e) {
    var n = e[qe];
    if (n) return n;
    for (var a = e.parentNode; a; ) {
      if ((n = a[Dt] || a[qe])) {
        if (
          ((a = n.alternate),
          n.child !== null || (a !== null && a.child !== null))
        )
          for (e = $g(e); e !== null; ) {
            if ((a = e[qe])) return a;
            e = $g(e);
          }
        return n;
      }
      (e = a), (a = e.parentNode);
    }
    return null;
  }
  function Na(e) {
    if ((e = e[qe] || e[Dt])) {
      var n = e.tag;
      if (n === 5 || n === 6 || n === 13 || n === 26 || n === 27 || n === 3)
        return e;
    }
    return null;
  }
  function Ho(e) {
    var n = e.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return e.stateNode;
    throw Error(l(33));
  }
  function Oa(e) {
    var n = e[fr];
    return (
      n ||
        (n = e[fr] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      n
    );
  }
  function yt(e) {
    e[Vn] = !0;
  }
  var Ch = new Set(),
    Rh = {};
  function Qr(e, n) {
    Da(e, n), Da(e + "Capture", n);
  }
  function Da(e, n) {
    for (Rh[e] = n, e = 0; e < n.length; e++) Ch.add(n[e]);
  }
  var o1 = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ),
    Ah = {},
    Th = {};
  function l1(e) {
    return _e.call(Th, e)
      ? !0
      : _e.call(Ah, e)
      ? !1
      : o1.test(e)
      ? (Th[e] = !0)
      : ((Ah[e] = !0), !1);
  }
  function pi(e, n, a) {
    if (l1(n))
      if (a === null) e.removeAttribute(n);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(n);
            return;
          case "boolean":
            var i = n.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              e.removeAttribute(n);
              return;
            }
        }
        e.setAttribute(n, "" + a);
      }
  }
  function gi(e, n, a) {
    if (a === null) e.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttribute(n, "" + a);
    }
  }
  function In(e, n, a, i) {
    if (i === null) e.removeAttribute(a);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(n, a, "" + i);
    }
  }
  var ks, Nh;
  function ja(e) {
    if (ks === void 0)
      try {
        throw Error();
      } catch (a) {
        var n = a.stack.trim().match(/\n( *(at )?)/);
        (ks = (n && n[1]) || ""),
          (Nh =
            -1 <
            a.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < a.stack.indexOf("@")
              ? "@unknown:0:0"
              : "");
      }
    return (
      `
` +
      ks +
      e +
      Nh
    );
  }
  var Ls = !1;
  function Us(e, n) {
    if (!e || Ls) return "";
    Ls = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function () {
          try {
            if (n) {
              var K = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(K.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(K, []);
                } catch (H) {
                  var Z = H;
                }
                Reflect.construct(e, [], K);
              } else {
                try {
                  K.call();
                } catch (H) {
                  Z = H;
                }
                e.call(K.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (H) {
                Z = H;
              }
              (K = e()) &&
                typeof K.catch == "function" &&
                K.catch(function () {});
            }
          } catch (H) {
            if (H && Z && typeof H.stack == "string") return [H.stack, Z.stack];
          }
          return [null, null];
        },
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var s = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      s &&
        s.configurable &&
        Object.defineProperty(i.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var f = i.DetermineComponentFrameRoot(),
        b = f[0],
        S = f[1];
      if (b && S) {
        var A = b.split(`
`),
          U = S.split(`
`);
        for (
          s = i = 0;
          i < A.length && !A[i].includes("DetermineComponentFrameRoot");

        )
          i++;
        for (; s < U.length && !U[s].includes("DetermineComponentFrameRoot"); )
          s++;
        if (i === A.length || s === U.length)
          for (
            i = A.length - 1, s = U.length - 1;
            1 <= i && 0 <= s && A[i] !== U[s];

          )
            s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (A[i] !== U[s]) {
            if (i !== 1 || s !== 1)
              do
                if ((i--, s--, 0 > s || A[i] !== U[s])) {
                  var I =
                    `
` + A[i].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      I.includes("<anonymous>") &&
                      (I = I.replace("<anonymous>", e.displayName)),
                    I
                  );
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      (Ls = !1), (Error.prepareStackTrace = a);
    }
    return (a = e ? e.displayName || e.name : "") ? ja(a) : "";
  }
  function i1(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ja(e.type);
      case 16:
        return ja("Lazy");
      case 13:
        return ja("Suspense");
      case 19:
        return ja("SuspenseList");
      case 0:
      case 15:
        return Us(e.type, !1);
      case 11:
        return Us(e.type.render, !1);
      case 1:
        return Us(e.type, !0);
      case 31:
        return ja("Activity");
      default:
        return "";
    }
  }
  function Oh(e) {
    try {
      var n = "";
      do (n += i1(e)), (e = e.return);
      while (e);
      return n;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  function an(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Dh(e) {
    var n = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (n === "checkbox" || n === "radio")
    );
  }
  function c1(e) {
    var n = Dh(e) ? "checked" : "value",
      a = Object.getOwnPropertyDescriptor(e.constructor.prototype, n),
      i = "" + e[n];
    if (
      !e.hasOwnProperty(n) &&
      typeof a < "u" &&
      typeof a.get == "function" &&
      typeof a.set == "function"
    ) {
      var s = a.get,
        f = a.set;
      return (
        Object.defineProperty(e, n, {
          configurable: !0,
          get: function () {
            return s.call(this);
          },
          set: function (b) {
            (i = "" + b), f.call(this, b);
          },
        }),
        Object.defineProperty(e, n, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return i;
          },
          setValue: function (b) {
            i = "" + b;
          },
          stopTracking: function () {
            (e._valueTracker = null), delete e[n];
          },
        }
      );
    }
  }
  function vi(e) {
    e._valueTracker || (e._valueTracker = c1(e));
  }
  function jh(e) {
    if (!e) return !1;
    var n = e._valueTracker;
    if (!n) return !0;
    var a = n.getValue(),
      i = "";
    return (
      e && (i = Dh(e) ? (e.checked ? "true" : "false") : e.value),
      (e = i),
      e !== a ? (n.setValue(e), !0) : !1
    );
  }
  function yi(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var s1 = /[\n"\\]/g;
  function on(e) {
    return e.replace(s1, function (n) {
      return "\\" + n.charCodeAt(0).toString(16) + " ";
    });
  }
  function Bs(e, n, a, i, s, f, b, S) {
    (e.name = ""),
      b != null &&
      typeof b != "function" &&
      typeof b != "symbol" &&
      typeof b != "boolean"
        ? (e.type = b)
        : e.removeAttribute("type"),
      n != null
        ? b === "number"
          ? ((n === 0 && e.value === "") || e.value != n) &&
            (e.value = "" + an(n))
          : e.value !== "" + an(n) && (e.value = "" + an(n))
        : (b !== "submit" && b !== "reset") || e.removeAttribute("value"),
      n != null
        ? Zs(e, b, an(n))
        : a != null
        ? Zs(e, b, an(a))
        : i != null && e.removeAttribute("value"),
      s == null && f != null && (e.defaultChecked = !!f),
      s != null &&
        (e.checked = s && typeof s != "function" && typeof s != "symbol"),
      S != null &&
      typeof S != "function" &&
      typeof S != "symbol" &&
      typeof S != "boolean"
        ? (e.name = "" + an(S))
        : e.removeAttribute("name");
  }
  function zh(e, n, a, i, s, f, b, S) {
    if (
      (f != null &&
        typeof f != "function" &&
        typeof f != "symbol" &&
        typeof f != "boolean" &&
        (e.type = f),
      n != null || a != null)
    ) {
      if (!((f !== "submit" && f !== "reset") || n != null)) return;
      (a = a != null ? "" + an(a) : ""),
        (n = n != null ? "" + an(n) : a),
        S || n === e.value || (e.value = n),
        (e.defaultValue = n);
    }
    (i = i ?? s),
      (i = typeof i != "function" && typeof i != "symbol" && !!i),
      (e.checked = S ? e.checked : !!i),
      (e.defaultChecked = !!i),
      b != null &&
        typeof b != "function" &&
        typeof b != "symbol" &&
        typeof b != "boolean" &&
        (e.name = b);
  }
  function Zs(e, n, a) {
    (n === "number" && yi(e.ownerDocument) === e) ||
      e.defaultValue === "" + a ||
      (e.defaultValue = "" + a);
  }
  function za(e, n, a, i) {
    if (((e = e.options), n)) {
      n = {};
      for (var s = 0; s < a.length; s++) n["$" + a[s]] = !0;
      for (a = 0; a < e.length; a++)
        (s = n.hasOwnProperty("$" + e[a].value)),
          e[a].selected !== s && (e[a].selected = s),
          s && i && (e[a].defaultSelected = !0);
    } else {
      for (a = "" + an(a), n = null, s = 0; s < e.length; s++) {
        if (e[s].value === a) {
          (e[s].selected = !0), i && (e[s].defaultSelected = !0);
          return;
        }
        n !== null || e[s].disabled || (n = e[s]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function Mh(e, n, a) {
    if (
      n != null &&
      ((n = "" + an(n)), n !== e.value && (e.value = n), a == null)
    ) {
      e.defaultValue !== n && (e.defaultValue = n);
      return;
    }
    e.defaultValue = a != null ? "" + an(a) : "";
  }
  function kh(e, n, a, i) {
    if (n == null) {
      if (i != null) {
        if (a != null) throw Error(l(92));
        if (me(i)) {
          if (1 < i.length) throw Error(l(93));
          i = i[0];
        }
        a = i;
      }
      a == null && (a = ""), (n = a);
    }
    (a = an(n)),
      (e.defaultValue = a),
      (i = e.textContent),
      i === a && i !== "" && i !== null && (e.value = i);
  }
  function Ma(e, n) {
    if (n) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = n;
        return;
      }
    }
    e.textContent = n;
  }
  var u1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Lh(e, n, a) {
    var i = n.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === ""
      ? i
        ? e.setProperty(n, "")
        : n === "float"
        ? (e.cssFloat = "")
        : (e[n] = "")
      : i
      ? e.setProperty(n, a)
      : typeof a != "number" || a === 0 || u1.has(n)
      ? n === "float"
        ? (e.cssFloat = a)
        : (e[n] = ("" + a).trim())
      : (e[n] = a + "px");
  }
  function Uh(e, n, a) {
    if (n != null && typeof n != "object") throw Error(l(62));
    if (((e = e.style), a != null)) {
      for (var i in a)
        !a.hasOwnProperty(i) ||
          (n != null && n.hasOwnProperty(i)) ||
          (i.indexOf("--") === 0
            ? e.setProperty(i, "")
            : i === "float"
            ? (e.cssFloat = "")
            : (e[i] = ""));
      for (var s in n)
        (i = n[s]), n.hasOwnProperty(s) && a[s] !== i && Lh(e, s, i);
    } else for (var f in n) n.hasOwnProperty(f) && Lh(e, f, n[f]);
  }
  function Hs(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var f1 = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    d1 =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function bi(e) {
    return d1.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  var $s = null;
  function Gs(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var ka = null,
    La = null;
  function Bh(e) {
    var n = Na(e);
    if (n && (e = n.stateNode)) {
      var a = e[Pe] || null;
      e: switch (((e = n.stateNode), n.type)) {
        case "input":
          if (
            (Bs(
              e,
              a.value,
              a.defaultValue,
              a.defaultValue,
              a.checked,
              a.defaultChecked,
              a.type,
              a.name
            ),
            (n = a.name),
            a.type === "radio" && n != null)
          ) {
            for (a = e; a.parentNode; ) a = a.parentNode;
            for (
              a = a.querySelectorAll(
                'input[name="' + on("" + n) + '"][type="radio"]'
              ),
                n = 0;
              n < a.length;
              n++
            ) {
              var i = a[n];
              if (i !== e && i.form === e.form) {
                var s = i[Pe] || null;
                if (!s) throw Error(l(90));
                Bs(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name
                );
              }
            }
            for (n = 0; n < a.length; n++)
              (i = a[n]), i.form === e.form && jh(i);
          }
          break e;
        case "textarea":
          Mh(e, a.value, a.defaultValue);
          break e;
        case "select":
          (n = a.value), n != null && za(e, !!a.multiple, n, !1);
      }
    }
  }
  var Ys = !1;
  function Zh(e, n, a) {
    if (Ys) return e(n, a);
    Ys = !0;
    try {
      var i = e(n);
      return i;
    } finally {
      if (
        ((Ys = !1),
        (ka !== null || La !== null) &&
          (ac(), ka && ((n = ka), (e = La), (La = ka = null), Bh(n), e)))
      )
        for (n = 0; n < e.length; n++) Bh(e[n]);
    }
  }
  function $o(e, n) {
    var a = e.stateNode;
    if (a === null) return null;
    var i = a[Pe] || null;
    if (i === null) return null;
    a = i[n];
    e: switch (n) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) ||
          ((e = e.type),
          (i = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !i);
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != "function") throw Error(l(231, n, typeof a));
    return a;
  }
  var qn = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    Vs = !1;
  if (qn)
    try {
      var Go = {};
      Object.defineProperty(Go, "passive", {
        get: function () {
          Vs = !0;
        },
      }),
        window.addEventListener("test", Go, Go),
        window.removeEventListener("test", Go, Go);
    } catch {
      Vs = !1;
    }
  var dr = null,
    Is = null,
    xi = null;
  function Hh() {
    if (xi) return xi;
    var e,
      n = Is,
      a = n.length,
      i,
      s = "value" in dr ? dr.value : dr.textContent,
      f = s.length;
    for (e = 0; e < a && n[e] === s[e]; e++);
    var b = a - e;
    for (i = 1; i <= b && n[a - i] === s[f - i]; i++);
    return (xi = s.slice(e, 1 < i ? 1 - i : void 0));
  }
  function Si(e) {
    var n = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && n === 13 && (e = 13))
        : (e = n),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function wi() {
    return !0;
  }
  function $h() {
    return !1;
  }
  function Bt(e) {
    function n(a, i, s, f, b) {
      (this._reactName = a),
        (this._targetInst = s),
        (this.type = i),
        (this.nativeEvent = f),
        (this.target = b),
        (this.currentTarget = null);
      for (var S in e)
        e.hasOwnProperty(S) && ((a = e[S]), (this[S] = a ? a(f) : f[S]));
      return (
        (this.isDefaultPrevented = (
          f.defaultPrevented != null ? f.defaultPrevented : f.returnValue === !1
        )
          ? wi
          : $h),
        (this.isPropagationStopped = $h),
        this
      );
    }
    return (
      v(n.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a &&
            (a.preventDefault
              ? a.preventDefault()
              : typeof a.returnValue != "unknown" && (a.returnValue = !1),
            (this.isDefaultPrevented = wi));
        },
        stopPropagation: function () {
          var a = this.nativeEvent;
          a &&
            (a.stopPropagation
              ? a.stopPropagation()
              : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0),
            (this.isPropagationStopped = wi));
        },
        persist: function () {},
        isPersistent: wi,
      }),
      n
    );
  }
  var Fr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    _i = Bt(Fr),
    Yo = v({}, Fr, { view: 0, detail: 0 }),
    h1 = Bt(Yo),
    qs,
    Ps,
    Vo,
    Ei = v({}, Yo, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ks,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== Vo &&
              (Vo && e.type === "mousemove"
                ? ((qs = e.screenX - Vo.screenX), (Ps = e.screenY - Vo.screenY))
                : (Ps = qs = 0),
              (Vo = e)),
            qs);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : Ps;
      },
    }),
    Gh = Bt(Ei),
    m1 = v({}, Ei, { dataTransfer: 0 }),
    p1 = Bt(m1),
    g1 = v({}, Yo, { relatedTarget: 0 }),
    Xs = Bt(g1),
    v1 = v({}, Fr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    y1 = Bt(v1),
    b1 = v({}, Fr, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    x1 = Bt(b1),
    S1 = v({}, Fr, { data: 0 }),
    Yh = Bt(S1),
    w1 = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    _1 = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    E1 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function C1(e) {
    var n = this.nativeEvent;
    return n.getModifierState
      ? n.getModifierState(e)
      : (e = E1[e])
      ? !!n[e]
      : !1;
  }
  function Ks() {
    return C1;
  }
  var R1 = v({}, Yo, {
      key: function (e) {
        if (e.key) {
          var n = w1[e.key] || e.key;
          if (n !== "Unidentified") return n;
        }
        return e.type === "keypress"
          ? ((e = Si(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
          ? _1[e.keyCode] || "Unidentified"
          : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ks,
      charCode: function (e) {
        return e.type === "keypress" ? Si(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? Si(e)
          : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
      },
    }),
    A1 = Bt(R1),
    T1 = v({}, Ei, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Vh = Bt(T1),
    N1 = v({}, Yo, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ks,
    }),
    O1 = Bt(N1),
    D1 = v({}, Fr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    j1 = Bt(D1),
    z1 = v({}, Ei, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
          ? -e.wheelDeltaX
          : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
          ? -e.wheelDelta
          : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    M1 = Bt(z1),
    k1 = v({}, Fr, { newState: 0, oldState: 0 }),
    L1 = Bt(k1),
    U1 = [9, 13, 27, 32],
    Qs = qn && "CompositionEvent" in window,
    Io = null;
  qn && "documentMode" in document && (Io = document.documentMode);
  var B1 = qn && "TextEvent" in window && !Io,
    Ih = qn && (!Qs || (Io && 8 < Io && 11 >= Io)),
    qh = " ",
    Ph = !1;
  function Xh(e, n) {
    switch (e) {
      case "keyup":
        return U1.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Kh(e) {
    return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ua = !1;
  function Z1(e, n) {
    switch (e) {
      case "compositionend":
        return Kh(n);
      case "keypress":
        return n.which !== 32 ? null : ((Ph = !0), qh);
      case "textInput":
        return (e = n.data), e === qh && Ph ? null : e;
      default:
        return null;
    }
  }
  function H1(e, n) {
    if (Ua)
      return e === "compositionend" || (!Qs && Xh(e, n))
        ? ((e = Hh()), (xi = Is = dr = null), (Ua = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || (n.ctrlKey && n.altKey)) {
          if (n.char && 1 < n.char.length) return n.char;
          if (n.which) return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return Ih && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var $1 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Qh(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n === "input" ? !!$1[e.type] : n === "textarea";
  }
  function Fh(e, n, a, i) {
    ka ? (La ? La.push(i) : (La = [i])) : (ka = i),
      (n = uc(n, "onChange")),
      0 < n.length &&
        ((a = new _i("onChange", "change", null, a, i)),
        e.push({ event: a, listeners: n }));
  }
  var qo = null,
    Po = null;
  function G1(e) {
    Dg(e, 0);
  }
  function Ci(e) {
    var n = Ho(e);
    if (jh(n)) return e;
  }
  function Jh(e, n) {
    if (e === "change") return n;
  }
  var Wh = !1;
  if (qn) {
    var Fs;
    if (qn) {
      var Js = "oninput" in document;
      if (!Js) {
        var em = document.createElement("div");
        em.setAttribute("oninput", "return;"),
          (Js = typeof em.oninput == "function");
      }
      Fs = Js;
    } else Fs = !1;
    Wh = Fs && (!document.documentMode || 9 < document.documentMode);
  }
  function tm() {
    qo && (qo.detachEvent("onpropertychange", nm), (Po = qo = null));
  }
  function nm(e) {
    if (e.propertyName === "value" && Ci(Po)) {
      var n = [];
      Fh(n, Po, e, Gs(e)), Zh(G1, n);
    }
  }
  function Y1(e, n, a) {
    e === "focusin"
      ? (tm(), (qo = n), (Po = a), qo.attachEvent("onpropertychange", nm))
      : e === "focusout" && tm();
  }
  function V1(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ci(Po);
  }
  function I1(e, n) {
    if (e === "click") return Ci(n);
  }
  function q1(e, n) {
    if (e === "input" || e === "change") return Ci(n);
  }
  function P1(e, n) {
    return (e === n && (e !== 0 || 1 / e === 1 / n)) || (e !== e && n !== n);
  }
  var It = typeof Object.is == "function" ? Object.is : P1;
  function Xo(e, n) {
    if (It(e, n)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof n != "object" ||
      n === null
    )
      return !1;
    var a = Object.keys(e),
      i = Object.keys(n);
    if (a.length !== i.length) return !1;
    for (i = 0; i < a.length; i++) {
      var s = a[i];
      if (!_e.call(n, s) || !It(e[s], n[s])) return !1;
    }
    return !0;
  }
  function rm(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function am(e, n) {
    var a = rm(e);
    e = 0;
    for (var i; a; ) {
      if (a.nodeType === 3) {
        if (((i = e + a.textContent.length), e <= n && i >= n))
          return { node: a, offset: n - e };
        e = i;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = rm(a);
    }
  }
  function om(e, n) {
    return e && n
      ? e === n
        ? !0
        : e && e.nodeType === 3
        ? !1
        : n && n.nodeType === 3
        ? om(e, n.parentNode)
        : "contains" in e
        ? e.contains(n)
        : e.compareDocumentPosition
        ? !!(e.compareDocumentPosition(n) & 16)
        : !1
      : !1;
  }
  function lm(e) {
    e =
      e != null &&
      e.ownerDocument != null &&
      e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var n = yi(e.document); n instanceof e.HTMLIFrameElement; ) {
      try {
        var a = typeof n.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = n.contentWindow;
      else break;
      n = yi(e.document);
    }
    return n;
  }
  function Ws(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      n &&
      ((n === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        n === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var X1 = qn && "documentMode" in document && 11 >= document.documentMode,
    Ba = null,
    eu = null,
    Ko = null,
    tu = !1;
  function im(e, n, a) {
    var i =
      a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    tu ||
      Ba == null ||
      Ba !== yi(i) ||
      ((i = Ba),
      "selectionStart" in i && Ws(i)
        ? (i = { start: i.selectionStart, end: i.selectionEnd })
        : ((i = (
            (i.ownerDocument && i.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (i = {
            anchorNode: i.anchorNode,
            anchorOffset: i.anchorOffset,
            focusNode: i.focusNode,
            focusOffset: i.focusOffset,
          })),
      (Ko && Xo(Ko, i)) ||
        ((Ko = i),
        (i = uc(eu, "onSelect")),
        0 < i.length &&
          ((n = new _i("onSelect", "select", null, n, a)),
          e.push({ event: n, listeners: i }),
          (n.target = Ba))));
  }
  function Jr(e, n) {
    var a = {};
    return (
      (a[e.toLowerCase()] = n.toLowerCase()),
      (a["Webkit" + e] = "webkit" + n),
      (a["Moz" + e] = "moz" + n),
      a
    );
  }
  var Za = {
      animationend: Jr("Animation", "AnimationEnd"),
      animationiteration: Jr("Animation", "AnimationIteration"),
      animationstart: Jr("Animation", "AnimationStart"),
      transitionrun: Jr("Transition", "TransitionRun"),
      transitionstart: Jr("Transition", "TransitionStart"),
      transitioncancel: Jr("Transition", "TransitionCancel"),
      transitionend: Jr("Transition", "TransitionEnd"),
    },
    nu = {},
    cm = {};
  qn &&
    ((cm = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Za.animationend.animation,
      delete Za.animationiteration.animation,
      delete Za.animationstart.animation),
    "TransitionEvent" in window || delete Za.transitionend.transition);
  function Wr(e) {
    if (nu[e]) return nu[e];
    if (!Za[e]) return e;
    var n = Za[e],
      a;
    for (a in n) if (n.hasOwnProperty(a) && a in cm) return (nu[e] = n[a]);
    return e;
  }
  var sm = Wr("animationend"),
    um = Wr("animationiteration"),
    fm = Wr("animationstart"),
    K1 = Wr("transitionrun"),
    Q1 = Wr("transitionstart"),
    F1 = Wr("transitioncancel"),
    dm = Wr("transitionend"),
    hm = new Map(),
    ru =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " "
      );
  ru.push("scrollEnd");
  function xn(e, n) {
    hm.set(e, n), Qr(n, [e]);
  }
  var mm = new WeakMap();
  function ln(e, n) {
    if (typeof e == "object" && e !== null) {
      var a = mm.get(e);
      return a !== void 0
        ? a
        : ((n = { value: e, source: n, stack: Oh(n) }), mm.set(e, n), n);
    }
    return { value: e, source: n, stack: Oh(n) };
  }
  var cn = [],
    Ha = 0,
    au = 0;
  function Ri() {
    for (var e = Ha, n = (au = Ha = 0); n < e; ) {
      var a = cn[n];
      cn[n++] = null;
      var i = cn[n];
      cn[n++] = null;
      var s = cn[n];
      cn[n++] = null;
      var f = cn[n];
      if (((cn[n++] = null), i !== null && s !== null)) {
        var b = i.pending;
        b === null ? (s.next = s) : ((s.next = b.next), (b.next = s)),
          (i.pending = s);
      }
      f !== 0 && pm(a, s, f);
    }
  }
  function Ai(e, n, a, i) {
    (cn[Ha++] = e),
      (cn[Ha++] = n),
      (cn[Ha++] = a),
      (cn[Ha++] = i),
      (au |= i),
      (e.lanes |= i),
      (e = e.alternate),
      e !== null && (e.lanes |= i);
  }
  function ou(e, n, a, i) {
    return Ai(e, n, a, i), Ti(e);
  }
  function $a(e, n) {
    return Ai(e, null, null, n), Ti(e);
  }
  function pm(e, n, a) {
    e.lanes |= a;
    var i = e.alternate;
    i !== null && (i.lanes |= a);
    for (var s = !1, f = e.return; f !== null; )
      (f.childLanes |= a),
        (i = f.alternate),
        i !== null && (i.childLanes |= a),
        f.tag === 22 &&
          ((e = f.stateNode), e === null || e._visibility & 1 || (s = !0)),
        (e = f),
        (f = f.return);
    return e.tag === 3
      ? ((f = e.stateNode),
        s &&
          n !== null &&
          ((s = 31 - ht(a)),
          (e = f.hiddenUpdates),
          (i = e[s]),
          i === null ? (e[s] = [n]) : i.push(n),
          (n.lane = a | 536870912)),
        f)
      : null;
  }
  function Ti(e) {
    if (50 < xl) throw ((xl = 0), (df = null), Error(l(185)));
    for (var n = e.return; n !== null; ) (e = n), (n = e.return);
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ga = {};
  function J1(e, n, a, i) {
    (this.tag = e),
      (this.key = a),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = n),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = i),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null);
  }
  function qt(e, n, a, i) {
    return new J1(e, n, a, i);
  }
  function lu(e) {
    return (e = e.prototype), !(!e || !e.isReactComponent);
  }
  function Pn(e, n) {
    var a = e.alternate;
    return (
      a === null
        ? ((a = qt(e.tag, n, e.key, e.mode)),
          (a.elementType = e.elementType),
          (a.type = e.type),
          (a.stateNode = e.stateNode),
          (a.alternate = e),
          (e.alternate = a))
        : ((a.pendingProps = n),
          (a.type = e.type),
          (a.flags = 0),
          (a.subtreeFlags = 0),
          (a.deletions = null)),
      (a.flags = e.flags & 65011712),
      (a.childLanes = e.childLanes),
      (a.lanes = e.lanes),
      (a.child = e.child),
      (a.memoizedProps = e.memoizedProps),
      (a.memoizedState = e.memoizedState),
      (a.updateQueue = e.updateQueue),
      (n = e.dependencies),
      (a.dependencies =
        n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }),
      (a.sibling = e.sibling),
      (a.index = e.index),
      (a.ref = e.ref),
      (a.refCleanup = e.refCleanup),
      a
    );
  }
  function gm(e, n) {
    e.flags &= 65011714;
    var a = e.alternate;
    return (
      a === null
        ? ((e.childLanes = 0),
          (e.lanes = n),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = a.childLanes),
          (e.lanes = a.lanes),
          (e.child = a.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = a.memoizedProps),
          (e.memoizedState = a.memoizedState),
          (e.updateQueue = a.updateQueue),
          (e.type = a.type),
          (n = a.dependencies),
          (e.dependencies =
            n === null
              ? null
              : { lanes: n.lanes, firstContext: n.firstContext })),
      e
    );
  }
  function Ni(e, n, a, i, s, f) {
    var b = 0;
    if (((i = e), typeof e == "function")) lu(e) && (b = 1);
    else if (typeof e == "string")
      b = ew(e, a, ee.current)
        ? 26
        : e === "html" || e === "head" || e === "body"
        ? 27
        : 5;
    else
      e: switch (e) {
        case te:
          return (e = qt(31, a, n, s)), (e.elementType = te), (e.lanes = f), e;
        case R:
          return ea(a.children, s, f, n);
        case w:
          (b = 8), (s |= 24);
          break;
        case C:
          return (
            (e = qt(12, a, n, s | 2)), (e.elementType = C), (e.lanes = f), e
          );
        case L:
          return (e = qt(13, a, n, s)), (e.elementType = L), (e.lanes = f), e;
        case F:
          return (e = qt(19, a, n, s)), (e.elementType = F), (e.lanes = f), e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case O:
              case j:
                b = 10;
                break e;
              case D:
                b = 9;
                break e;
              case B:
                b = 11;
                break e;
              case Y:
                b = 14;
                break e;
              case G:
                (b = 16), (i = null);
                break e;
            }
          (b = 29),
            (a = Error(l(130, e === null ? "null" : typeof e, ""))),
            (i = null);
      }
    return (
      (n = qt(b, a, n, s)), (n.elementType = e), (n.type = i), (n.lanes = f), n
    );
  }
  function ea(e, n, a, i) {
    return (e = qt(7, e, i, n)), (e.lanes = a), e;
  }
  function iu(e, n, a) {
    return (e = qt(6, e, null, n)), (e.lanes = a), e;
  }
  function cu(e, n, a) {
    return (
      (n = qt(4, e.children !== null ? e.children : [], e.key, n)),
      (n.lanes = a),
      (n.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      n
    );
  }
  var Ya = [],
    Va = 0,
    Oi = null,
    Di = 0,
    sn = [],
    un = 0,
    ta = null,
    Xn = 1,
    Kn = "";
  function na(e, n) {
    (Ya[Va++] = Di), (Ya[Va++] = Oi), (Oi = e), (Di = n);
  }
  function vm(e, n, a) {
    (sn[un++] = Xn), (sn[un++] = Kn), (sn[un++] = ta), (ta = e);
    var i = Xn;
    e = Kn;
    var s = 32 - ht(i) - 1;
    (i &= ~(1 << s)), (a += 1);
    var f = 32 - ht(n) + s;
    if (30 < f) {
      var b = s - (s % 5);
      (f = (i & ((1 << b) - 1)).toString(32)),
        (i >>= b),
        (s -= b),
        (Xn = (1 << (32 - ht(n) + s)) | (a << s) | i),
        (Kn = f + e);
    } else (Xn = (1 << f) | (a << s) | i), (Kn = e);
  }
  function su(e) {
    e.return !== null && (na(e, 1), vm(e, 1, 0));
  }
  function uu(e) {
    for (; e === Oi; )
      (Oi = Ya[--Va]), (Ya[Va] = null), (Di = Ya[--Va]), (Ya[Va] = null);
    for (; e === ta; )
      (ta = sn[--un]),
        (sn[un] = null),
        (Kn = sn[--un]),
        (sn[un] = null),
        (Xn = sn[--un]),
        (sn[un] = null);
  }
  var Ut = null,
    et = null,
    Me = !1,
    ra = null,
    On = !1,
    fu = Error(l(519));
  function aa(e) {
    var n = Error(l(418, ""));
    throw (Jo(ln(n, e)), fu);
  }
  function ym(e) {
    var n = e.stateNode,
      a = e.type,
      i = e.memoizedProps;
    switch (((n[qe] = e), (n[Pe] = i), a)) {
      case "dialog":
        Oe("cancel", n), Oe("close", n);
        break;
      case "iframe":
      case "object":
      case "embed":
        Oe("load", n);
        break;
      case "video":
      case "audio":
        for (a = 0; a < wl.length; a++) Oe(wl[a], n);
        break;
      case "source":
        Oe("error", n);
        break;
      case "img":
      case "image":
      case "link":
        Oe("error", n), Oe("load", n);
        break;
      case "details":
        Oe("toggle", n);
        break;
      case "input":
        Oe("invalid", n),
          zh(
            n,
            i.value,
            i.defaultValue,
            i.checked,
            i.defaultChecked,
            i.type,
            i.name,
            !0
          ),
          vi(n);
        break;
      case "select":
        Oe("invalid", n);
        break;
      case "textarea":
        Oe("invalid", n), kh(n, i.value, i.defaultValue, i.children), vi(n);
    }
    (a = i.children),
      (typeof a != "string" && typeof a != "number" && typeof a != "bigint") ||
      n.textContent === "" + a ||
      i.suppressHydrationWarning === !0 ||
      kg(n.textContent, a)
        ? (i.popover != null && (Oe("beforetoggle", n), Oe("toggle", n)),
          i.onScroll != null && Oe("scroll", n),
          i.onScrollEnd != null && Oe("scrollend", n),
          i.onClick != null && (n.onclick = fc),
          (n = !0))
        : (n = !1),
      n || aa(e);
  }
  function bm(e) {
    for (Ut = e.return; Ut; )
      switch (Ut.tag) {
        case 5:
        case 13:
          On = !1;
          return;
        case 27:
        case 3:
          On = !0;
          return;
        default:
          Ut = Ut.return;
      }
  }
  function Qo(e) {
    if (e !== Ut) return !1;
    if (!Me) return bm(e), (Me = !0), !1;
    var n = e.tag,
      a;
    if (
      ((a = n !== 3 && n !== 27) &&
        ((a = n === 5) &&
          ((a = e.type),
          (a =
            !(a !== "form" && a !== "button") || Tf(e.type, e.memoizedProps))),
        (a = !a)),
      a && et && aa(e),
      bm(e),
      n === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(l(317));
      e: {
        for (e = e.nextSibling, n = 0; e; ) {
          if (e.nodeType === 8)
            if (((a = e.data), a === "/$")) {
              if (n === 0) {
                et = wn(e.nextSibling);
                break e;
              }
              n--;
            } else (a !== "$" && a !== "$!" && a !== "$?") || n++;
          e = e.nextSibling;
        }
        et = null;
      }
    } else
      n === 27
        ? ((n = et), Tr(e.type) ? ((e = jf), (jf = null), (et = e)) : (et = n))
        : (et = Ut ? wn(e.stateNode.nextSibling) : null);
    return !0;
  }
  function Fo() {
    (et = Ut = null), (Me = !1);
  }
  function xm() {
    var e = ra;
    return (
      e !== null &&
        ($t === null ? ($t = e) : $t.push.apply($t, e), (ra = null)),
      e
    );
  }
  function Jo(e) {
    ra === null ? (ra = [e]) : ra.push(e);
  }
  var du = q(null),
    oa = null,
    Qn = null;
  function hr(e, n, a) {
    Q(du, n._currentValue), (n._currentValue = a);
  }
  function Fn(e) {
    (e._currentValue = du.current), J(du);
  }
  function hu(e, n, a) {
    for (; e !== null; ) {
      var i = e.alternate;
      if (
        ((e.childLanes & n) !== n
          ? ((e.childLanes |= n), i !== null && (i.childLanes |= n))
          : i !== null && (i.childLanes & n) !== n && (i.childLanes |= n),
        e === a)
      )
        break;
      e = e.return;
    }
  }
  function mu(e, n, a, i) {
    var s = e.child;
    for (s !== null && (s.return = e); s !== null; ) {
      var f = s.dependencies;
      if (f !== null) {
        var b = s.child;
        f = f.firstContext;
        e: for (; f !== null; ) {
          var S = f;
          f = s;
          for (var A = 0; A < n.length; A++)
            if (S.context === n[A]) {
              (f.lanes |= a),
                (S = f.alternate),
                S !== null && (S.lanes |= a),
                hu(f.return, a, e),
                i || (b = null);
              break e;
            }
          f = S.next;
        }
      } else if (s.tag === 18) {
        if (((b = s.return), b === null)) throw Error(l(341));
        (b.lanes |= a),
          (f = b.alternate),
          f !== null && (f.lanes |= a),
          hu(b, a, e),
          (b = null);
      } else b = s.child;
      if (b !== null) b.return = s;
      else
        for (b = s; b !== null; ) {
          if (b === e) {
            b = null;
            break;
          }
          if (((s = b.sibling), s !== null)) {
            (s.return = b.return), (b = s);
            break;
          }
          b = b.return;
        }
      s = b;
    }
  }
  function Wo(e, n, a, i) {
    e = null;
    for (var s = n, f = !1; s !== null; ) {
      if (!f) {
        if ((s.flags & 524288) !== 0) f = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var b = s.alternate;
        if (b === null) throw Error(l(387));
        if (((b = b.memoizedProps), b !== null)) {
          var S = s.type;
          It(s.pendingProps.value, b.value) ||
            (e !== null ? e.push(S) : (e = [S]));
        }
      } else if (s === W.current) {
        if (((b = s.alternate), b === null)) throw Error(l(387));
        b.memoizedState.memoizedState !== s.memoizedState.memoizedState &&
          (e !== null ? e.push(Tl) : (e = [Tl]));
      }
      s = s.return;
    }
    e !== null && mu(n, e, a, i), (n.flags |= 262144);
  }
  function ji(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!It(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function la(e) {
    (oa = e),
      (Qn = null),
      (e = e.dependencies),
      e !== null && (e.firstContext = null);
  }
  function jt(e) {
    return Sm(oa, e);
  }
  function zi(e, n) {
    return oa === null && la(e), Sm(e, n);
  }
  function Sm(e, n) {
    var a = n._currentValue;
    if (((n = { context: n, memoizedValue: a, next: null }), Qn === null)) {
      if (e === null) throw Error(l(308));
      (Qn = n),
        (e.dependencies = { lanes: 0, firstContext: n }),
        (e.flags |= 524288);
    } else Qn = Qn.next = n;
    return a;
  }
  var W1 =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              n = (this.signal = {
                aborted: !1,
                addEventListener: function (a, i) {
                  e.push(i);
                },
              });
            this.abort = function () {
              (n.aborted = !0),
                e.forEach(function (a) {
                  return a();
                });
            };
          },
    eS = t.unstable_scheduleCallback,
    tS = t.unstable_NormalPriority,
    mt = {
      $$typeof: j,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function pu() {
    return { controller: new W1(), data: new Map(), refCount: 0 };
  }
  function el(e) {
    e.refCount--,
      e.refCount === 0 &&
        eS(tS, function () {
          e.controller.abort();
        });
  }
  var tl = null,
    gu = 0,
    Ia = 0,
    qa = null;
  function nS(e, n) {
    if (tl === null) {
      var a = (tl = []);
      (gu = 0),
        (Ia = bf()),
        (qa = {
          status: "pending",
          value: void 0,
          then: function (i) {
            a.push(i);
          },
        });
    }
    return gu++, n.then(wm, wm), n;
  }
  function wm() {
    if (--gu === 0 && tl !== null) {
      qa !== null && (qa.status = "fulfilled");
      var e = tl;
      (tl = null), (Ia = 0), (qa = null);
      for (var n = 0; n < e.length; n++) (0, e[n])();
    }
  }
  function rS(e, n) {
    var a = [],
      i = {
        status: "pending",
        value: null,
        reason: null,
        then: function (s) {
          a.push(s);
        },
      };
    return (
      e.then(
        function () {
          (i.status = "fulfilled"), (i.value = n);
          for (var s = 0; s < a.length; s++) (0, a[s])(n);
        },
        function (s) {
          for (i.status = "rejected", i.reason = s, s = 0; s < a.length; s++)
            (0, a[s])(void 0);
        }
      ),
      i
    );
  }
  var _m = z.S;
  z.S = function (e, n) {
    typeof n == "object" &&
      n !== null &&
      typeof n.then == "function" &&
      nS(e, n),
      _m !== null && _m(e, n);
  };
  var ia = q(null);
  function vu() {
    var e = ia.current;
    return e !== null ? e : Ve.pooledCache;
  }
  function Mi(e, n) {
    n === null ? Q(ia, ia.current) : Q(ia, n.pool);
  }
  function Em() {
    var e = vu();
    return e === null ? null : { parent: mt._currentValue, pool: e };
  }
  var nl = Error(l(460)),
    Cm = Error(l(474)),
    ki = Error(l(542)),
    yu = { then: function () {} };
  function Rm(e) {
    return (e = e.status), e === "fulfilled" || e === "rejected";
  }
  function Li() {}
  function Am(e, n, a) {
    switch (
      ((a = e[a]),
      a === void 0 ? e.push(n) : a !== n && (n.then(Li, Li), (n = a)),
      n.status)
    ) {
      case "fulfilled":
        return n.value;
      case "rejected":
        throw ((e = n.reason), Nm(e), e);
      default:
        if (typeof n.status == "string") n.then(Li, Li);
        else {
          if (((e = Ve), e !== null && 100 < e.shellSuspendCounter))
            throw Error(l(482));
          (e = n),
            (e.status = "pending"),
            e.then(
              function (i) {
                if (n.status === "pending") {
                  var s = n;
                  (s.status = "fulfilled"), (s.value = i);
                }
              },
              function (i) {
                if (n.status === "pending") {
                  var s = n;
                  (s.status = "rejected"), (s.reason = i);
                }
              }
            );
        }
        switch (n.status) {
          case "fulfilled":
            return n.value;
          case "rejected":
            throw ((e = n.reason), Nm(e), e);
        }
        throw ((rl = n), nl);
    }
  }
  var rl = null;
  function Tm() {
    if (rl === null) throw Error(l(459));
    var e = rl;
    return (rl = null), e;
  }
  function Nm(e) {
    if (e === nl || e === ki) throw Error(l(483));
  }
  var mr = !1;
  function bu(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function xu(e, n) {
    (e = e.updateQueue),
      n.updateQueue === e &&
        (n.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        });
  }
  function pr(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function gr(e, n, a) {
    var i = e.updateQueue;
    if (i === null) return null;
    if (((i = i.shared), (Le & 2) !== 0)) {
      var s = i.pending;
      return (
        s === null ? (n.next = n) : ((n.next = s.next), (s.next = n)),
        (i.pending = n),
        (n = Ti(e)),
        pm(e, null, a),
        n
      );
    }
    return Ai(e, i, n, a), Ti(e);
  }
  function al(e, n, a) {
    if (
      ((n = n.updateQueue), n !== null && ((n = n.shared), (a & 4194048) !== 0))
    ) {
      var i = n.lanes;
      (i &= e.pendingLanes), (a |= i), (n.lanes = a), bn(e, a);
    }
  }
  function Su(e, n) {
    var a = e.updateQueue,
      i = e.alternate;
    if (i !== null && ((i = i.updateQueue), a === i)) {
      var s = null,
        f = null;
      if (((a = a.firstBaseUpdate), a !== null)) {
        do {
          var b = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null,
          };
          f === null ? (s = f = b) : (f = f.next = b), (a = a.next);
        } while (a !== null);
        f === null ? (s = f = n) : (f = f.next = n);
      } else s = f = n;
      (a = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: f,
        shared: i.shared,
        callbacks: i.callbacks,
      }),
        (e.updateQueue = a);
      return;
    }
    (e = a.lastBaseUpdate),
      e === null ? (a.firstBaseUpdate = n) : (e.next = n),
      (a.lastBaseUpdate = n);
  }
  var wu = !1;
  function ol() {
    if (wu) {
      var e = qa;
      if (e !== null) throw e;
    }
  }
  function ll(e, n, a, i) {
    wu = !1;
    var s = e.updateQueue;
    mr = !1;
    var f = s.firstBaseUpdate,
      b = s.lastBaseUpdate,
      S = s.shared.pending;
    if (S !== null) {
      s.shared.pending = null;
      var A = S,
        U = A.next;
      (A.next = null), b === null ? (f = U) : (b.next = U), (b = A);
      var I = e.alternate;
      I !== null &&
        ((I = I.updateQueue),
        (S = I.lastBaseUpdate),
        S !== b &&
          (S === null ? (I.firstBaseUpdate = U) : (S.next = U),
          (I.lastBaseUpdate = A)));
    }
    if (f !== null) {
      var K = s.baseState;
      (b = 0), (I = U = A = null), (S = f);
      do {
        var Z = S.lane & -536870913,
          H = Z !== S.lane;
        if (H ? (je & Z) === Z : (i & Z) === Z) {
          Z !== 0 && Z === Ia && (wu = !0),
            I !== null &&
              (I = I.next =
                {
                  lane: 0,
                  tag: S.tag,
                  payload: S.payload,
                  callback: null,
                  next: null,
                });
          e: {
            var xe = e,
              ve = S;
            Z = n;
            var $e = a;
            switch (ve.tag) {
              case 1:
                if (((xe = ve.payload), typeof xe == "function")) {
                  K = xe.call($e, K, Z);
                  break e;
                }
                K = xe;
                break e;
              case 3:
                xe.flags = (xe.flags & -65537) | 128;
              case 0:
                if (
                  ((xe = ve.payload),
                  (Z = typeof xe == "function" ? xe.call($e, K, Z) : xe),
                  Z == null)
                )
                  break e;
                K = v({}, K, Z);
                break e;
              case 2:
                mr = !0;
            }
          }
          (Z = S.callback),
            Z !== null &&
              ((e.flags |= 64),
              H && (e.flags |= 8192),
              (H = s.callbacks),
              H === null ? (s.callbacks = [Z]) : H.push(Z));
        } else
          (H = {
            lane: Z,
            tag: S.tag,
            payload: S.payload,
            callback: S.callback,
            next: null,
          }),
            I === null ? ((U = I = H), (A = K)) : (I = I.next = H),
            (b |= Z);
        if (((S = S.next), S === null)) {
          if (((S = s.shared.pending), S === null)) break;
          (H = S),
            (S = H.next),
            (H.next = null),
            (s.lastBaseUpdate = H),
            (s.shared.pending = null);
        }
      } while (!0);
      I === null && (A = K),
        (s.baseState = A),
        (s.firstBaseUpdate = U),
        (s.lastBaseUpdate = I),
        f === null && (s.shared.lanes = 0),
        (Er |= b),
        (e.lanes = b),
        (e.memoizedState = K);
    }
  }
  function Om(e, n) {
    if (typeof e != "function") throw Error(l(191, e));
    e.call(n);
  }
  function Dm(e, n) {
    var a = e.callbacks;
    if (a !== null)
      for (e.callbacks = null, e = 0; e < a.length; e++) Om(a[e], n);
  }
  var Pa = q(null),
    Ui = q(0);
  function jm(e, n) {
    (e = ar), Q(Ui, e), Q(Pa, n), (ar = e | n.baseLanes);
  }
  function _u() {
    Q(Ui, ar), Q(Pa, Pa.current);
  }
  function Eu() {
    (ar = Ui.current), J(Pa), J(Ui);
  }
  var vr = 0,
    Re = null,
    Ze = null,
    st = null,
    Bi = !1,
    Xa = !1,
    ca = !1,
    Zi = 0,
    il = 0,
    Ka = null,
    aS = 0;
  function at() {
    throw Error(l(321));
  }
  function Cu(e, n) {
    if (n === null) return !1;
    for (var a = 0; a < n.length && a < e.length; a++)
      if (!It(e[a], n[a])) return !1;
    return !0;
  }
  function Ru(e, n, a, i, s, f) {
    return (
      (vr = f),
      (Re = n),
      (n.memoizedState = null),
      (n.updateQueue = null),
      (n.lanes = 0),
      (z.H = e === null || e.memoizedState === null ? pp : gp),
      (ca = !1),
      (f = a(i, s)),
      (ca = !1),
      Xa && (f = Mm(n, a, i, s)),
      zm(e),
      f
    );
  }
  function zm(e) {
    z.H = Ii;
    var n = Ze !== null && Ze.next !== null;
    if (((vr = 0), (st = Ze = Re = null), (Bi = !1), (il = 0), (Ka = null), n))
      throw Error(l(300));
    e === null ||
      bt ||
      ((e = e.dependencies), e !== null && ji(e) && (bt = !0));
  }
  function Mm(e, n, a, i) {
    Re = e;
    var s = 0;
    do {
      if ((Xa && (Ka = null), (il = 0), (Xa = !1), 25 <= s))
        throw Error(l(301));
      if (((s += 1), (st = Ze = null), e.updateQueue != null)) {
        var f = e.updateQueue;
        (f.lastEffect = null),
          (f.events = null),
          (f.stores = null),
          f.memoCache != null && (f.memoCache.index = 0);
      }
      (z.H = fS), (f = n(a, i));
    } while (Xa);
    return f;
  }
  function oS() {
    var e = z.H,
      n = e.useState()[0];
    return (
      (n = typeof n.then == "function" ? cl(n) : n),
      (e = e.useState()[0]),
      (Ze !== null ? Ze.memoizedState : null) !== e && (Re.flags |= 1024),
      n
    );
  }
  function Au() {
    var e = Zi !== 0;
    return (Zi = 0), e;
  }
  function Tu(e, n, a) {
    (n.updateQueue = e.updateQueue), (n.flags &= -2053), (e.lanes &= ~a);
  }
  function Nu(e) {
    if (Bi) {
      for (e = e.memoizedState; e !== null; ) {
        var n = e.queue;
        n !== null && (n.pending = null), (e = e.next);
      }
      Bi = !1;
    }
    (vr = 0), (st = Ze = Re = null), (Xa = !1), (il = Zi = 0), (Ka = null);
  }
  function Zt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return st === null ? (Re.memoizedState = st = e) : (st = st.next = e), st;
  }
  function ut() {
    if (Ze === null) {
      var e = Re.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ze.next;
    var n = st === null ? Re.memoizedState : st.next;
    if (n !== null) (st = n), (Ze = e);
    else {
      if (e === null)
        throw Re.alternate === null ? Error(l(467)) : Error(l(310));
      (Ze = e),
        (e = {
          memoizedState: Ze.memoizedState,
          baseState: Ze.baseState,
          baseQueue: Ze.baseQueue,
          queue: Ze.queue,
          next: null,
        }),
        st === null ? (Re.memoizedState = st = e) : (st = st.next = e);
    }
    return st;
  }
  function Ou() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function cl(e) {
    var n = il;
    return (
      (il += 1),
      Ka === null && (Ka = []),
      (e = Am(Ka, e, n)),
      (n = Re),
      (st === null ? n.memoizedState : st.next) === null &&
        ((n = n.alternate),
        (z.H = n === null || n.memoizedState === null ? pp : gp)),
      e
    );
  }
  function Hi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return cl(e);
      if (e.$$typeof === j) return jt(e);
    }
    throw Error(l(438, String(e)));
  }
  function Du(e) {
    var n = null,
      a = Re.updateQueue;
    if ((a !== null && (n = a.memoCache), n == null)) {
      var i = Re.alternate;
      i !== null &&
        ((i = i.updateQueue),
        i !== null &&
          ((i = i.memoCache),
          i != null &&
            (n = {
              data: i.data.map(function (s) {
                return s.slice();
              }),
              index: 0,
            })));
    }
    if (
      (n == null && (n = { data: [], index: 0 }),
      a === null && ((a = Ou()), (Re.updateQueue = a)),
      (a.memoCache = n),
      (a = n.data[n.index]),
      a === void 0)
    )
      for (a = n.data[n.index] = Array(e), i = 0; i < e; i++) a[i] = se;
    return n.index++, a;
  }
  function Jn(e, n) {
    return typeof n == "function" ? n(e) : n;
  }
  function $i(e) {
    var n = ut();
    return ju(n, Ze, e);
  }
  function ju(e, n, a) {
    var i = e.queue;
    if (i === null) throw Error(l(311));
    i.lastRenderedReducer = a;
    var s = e.baseQueue,
      f = i.pending;
    if (f !== null) {
      if (s !== null) {
        var b = s.next;
        (s.next = f.next), (f.next = b);
      }
      (n.baseQueue = s = f), (i.pending = null);
    }
    if (((f = e.baseState), s === null)) e.memoizedState = f;
    else {
      n = s.next;
      var S = (b = null),
        A = null,
        U = n,
        I = !1;
      do {
        var K = U.lane & -536870913;
        if (K !== U.lane ? (je & K) === K : (vr & K) === K) {
          var Z = U.revertLane;
          if (Z === 0)
            A !== null &&
              (A = A.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: U.action,
                  hasEagerState: U.hasEagerState,
                  eagerState: U.eagerState,
                  next: null,
                }),
              K === Ia && (I = !0);
          else if ((vr & Z) === Z) {
            (U = U.next), Z === Ia && (I = !0);
            continue;
          } else
            (K = {
              lane: 0,
              revertLane: U.revertLane,
              action: U.action,
              hasEagerState: U.hasEagerState,
              eagerState: U.eagerState,
              next: null,
            }),
              A === null ? ((S = A = K), (b = f)) : (A = A.next = K),
              (Re.lanes |= Z),
              (Er |= Z);
          (K = U.action),
            ca && a(f, K),
            (f = U.hasEagerState ? U.eagerState : a(f, K));
        } else
          (Z = {
            lane: K,
            revertLane: U.revertLane,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null,
          }),
            A === null ? ((S = A = Z), (b = f)) : (A = A.next = Z),
            (Re.lanes |= K),
            (Er |= K);
        U = U.next;
      } while (U !== null && U !== n);
      if (
        (A === null ? (b = f) : (A.next = S),
        !It(f, e.memoizedState) && ((bt = !0), I && ((a = qa), a !== null)))
      )
        throw a;
      (e.memoizedState = f),
        (e.baseState = b),
        (e.baseQueue = A),
        (i.lastRenderedState = f);
    }
    return s === null && (i.lanes = 0), [e.memoizedState, i.dispatch];
  }
  function zu(e) {
    var n = ut(),
      a = n.queue;
    if (a === null) throw Error(l(311));
    a.lastRenderedReducer = e;
    var i = a.dispatch,
      s = a.pending,
      f = n.memoizedState;
    if (s !== null) {
      a.pending = null;
      var b = (s = s.next);
      do (f = e(f, b.action)), (b = b.next);
      while (b !== s);
      It(f, n.memoizedState) || (bt = !0),
        (n.memoizedState = f),
        n.baseQueue === null && (n.baseState = f),
        (a.lastRenderedState = f);
    }
    return [f, i];
  }
  function km(e, n, a) {
    var i = Re,
      s = ut(),
      f = Me;
    if (f) {
      if (a === void 0) throw Error(l(407));
      a = a();
    } else a = n();
    var b = !It((Ze || s).memoizedState, a);
    b && ((s.memoizedState = a), (bt = !0)), (s = s.queue);
    var S = Bm.bind(null, i, s, e);
    if (
      (sl(2048, 8, S, [e]),
      s.getSnapshot !== n || b || (st !== null && st.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        Qa(9, Gi(), Um.bind(null, i, s, a, n), null),
        Ve === null)
      )
        throw Error(l(349));
      f || (vr & 124) !== 0 || Lm(i, n, a);
    }
    return a;
  }
  function Lm(e, n, a) {
    (e.flags |= 16384),
      (e = { getSnapshot: n, value: a }),
      (n = Re.updateQueue),
      n === null
        ? ((n = Ou()), (Re.updateQueue = n), (n.stores = [e]))
        : ((a = n.stores), a === null ? (n.stores = [e]) : a.push(e));
  }
  function Um(e, n, a, i) {
    (n.value = a), (n.getSnapshot = i), Zm(n) && Hm(e);
  }
  function Bm(e, n, a) {
    return a(function () {
      Zm(n) && Hm(e);
    });
  }
  function Zm(e) {
    var n = e.getSnapshot;
    e = e.value;
    try {
      var a = n();
      return !It(e, a);
    } catch {
      return !0;
    }
  }
  function Hm(e) {
    var n = $a(e, 2);
    n !== null && Ft(n, e, 2);
  }
  function Mu(e) {
    var n = Zt();
    if (typeof e == "function") {
      var a = e;
      if (((e = a()), ca)) {
        kt(!0);
        try {
          a();
        } finally {
          kt(!1);
        }
      }
    }
    return (
      (n.memoizedState = n.baseState = e),
      (n.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Jn,
        lastRenderedState: e,
      }),
      n
    );
  }
  function $m(e, n, a, i) {
    return (e.baseState = a), ju(e, Ze, typeof i == "function" ? i : Jn);
  }
  function lS(e, n, a, i, s) {
    if (Vi(e)) throw Error(l(485));
    if (((e = n.action), e !== null)) {
      var f = {
        payload: s,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (b) {
          f.listeners.push(b);
        },
      };
      z.T !== null ? a(!0) : (f.isTransition = !1),
        i(f),
        (a = n.pending),
        a === null
          ? ((f.next = n.pending = f), Gm(n, f))
          : ((f.next = a.next), (n.pending = a.next = f));
    }
  }
  function Gm(e, n) {
    var a = n.action,
      i = n.payload,
      s = e.state;
    if (n.isTransition) {
      var f = z.T,
        b = {};
      z.T = b;
      try {
        var S = a(s, i),
          A = z.S;
        A !== null && A(b, S), Ym(e, n, S);
      } catch (U) {
        ku(e, n, U);
      } finally {
        z.T = f;
      }
    } else
      try {
        (f = a(s, i)), Ym(e, n, f);
      } catch (U) {
        ku(e, n, U);
      }
  }
  function Ym(e, n, a) {
    a !== null && typeof a == "object" && typeof a.then == "function"
      ? a.then(
          function (i) {
            Vm(e, n, i);
          },
          function (i) {
            return ku(e, n, i);
          }
        )
      : Vm(e, n, a);
  }
  function Vm(e, n, a) {
    (n.status = "fulfilled"),
      (n.value = a),
      Im(n),
      (e.state = a),
      (n = e.pending),
      n !== null &&
        ((a = n.next),
        a === n ? (e.pending = null) : ((a = a.next), (n.next = a), Gm(e, a)));
  }
  function ku(e, n, a) {
    var i = e.pending;
    if (((e.pending = null), i !== null)) {
      i = i.next;
      do (n.status = "rejected"), (n.reason = a), Im(n), (n = n.next);
      while (n !== i);
    }
    e.action = null;
  }
  function Im(e) {
    e = e.listeners;
    for (var n = 0; n < e.length; n++) (0, e[n])();
  }
  function qm(e, n) {
    return n;
  }
  function Pm(e, n) {
    if (Me) {
      var a = Ve.formState;
      if (a !== null) {
        e: {
          var i = Re;
          if (Me) {
            if (et) {
              t: {
                for (var s = et, f = On; s.nodeType !== 8; ) {
                  if (!f) {
                    s = null;
                    break t;
                  }
                  if (((s = wn(s.nextSibling)), s === null)) {
                    s = null;
                    break t;
                  }
                }
                (f = s.data), (s = f === "F!" || f === "F" ? s : null);
              }
              if (s) {
                (et = wn(s.nextSibling)), (i = s.data === "F!");
                break e;
              }
            }
            aa(i);
          }
          i = !1;
        }
        i && (n = a[0]);
      }
    }
    return (
      (a = Zt()),
      (a.memoizedState = a.baseState = n),
      (i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: qm,
        lastRenderedState: n,
      }),
      (a.queue = i),
      (a = dp.bind(null, Re, i)),
      (i.dispatch = a),
      (i = Mu(!1)),
      (f = Hu.bind(null, Re, !1, i.queue)),
      (i = Zt()),
      (s = { state: n, dispatch: null, action: e, pending: null }),
      (i.queue = s),
      (a = lS.bind(null, Re, s, f, a)),
      (s.dispatch = a),
      (i.memoizedState = e),
      [n, a, !1]
    );
  }
  function Xm(e) {
    var n = ut();
    return Km(n, Ze, e);
  }
  function Km(e, n, a) {
    if (
      ((n = ju(e, n, qm)[0]),
      (e = $i(Jn)[0]),
      typeof n == "object" && n !== null && typeof n.then == "function")
    )
      try {
        var i = cl(n);
      } catch (b) {
        throw b === nl ? ki : b;
      }
    else i = n;
    n = ut();
    var s = n.queue,
      f = s.dispatch;
    return (
      a !== n.memoizedState &&
        ((Re.flags |= 2048), Qa(9, Gi(), iS.bind(null, s, a), null)),
      [i, f, e]
    );
  }
  function iS(e, n) {
    e.action = n;
  }
  function Qm(e) {
    var n = ut(),
      a = Ze;
    if (a !== null) return Km(n, a, e);
    ut(), (n = n.memoizedState), (a = ut());
    var i = a.queue.dispatch;
    return (a.memoizedState = e), [n, i, !1];
  }
  function Qa(e, n, a, i) {
    return (
      (e = { tag: e, create: a, deps: i, inst: n, next: null }),
      (n = Re.updateQueue),
      n === null && ((n = Ou()), (Re.updateQueue = n)),
      (a = n.lastEffect),
      a === null
        ? (n.lastEffect = e.next = e)
        : ((i = a.next), (a.next = e), (e.next = i), (n.lastEffect = e)),
      e
    );
  }
  function Gi() {
    return { destroy: void 0, resource: void 0 };
  }
  function Fm() {
    return ut().memoizedState;
  }
  function Yi(e, n, a, i) {
    var s = Zt();
    (i = i === void 0 ? null : i),
      (Re.flags |= e),
      (s.memoizedState = Qa(1 | n, Gi(), a, i));
  }
  function sl(e, n, a, i) {
    var s = ut();
    i = i === void 0 ? null : i;
    var f = s.memoizedState.inst;
    Ze !== null && i !== null && Cu(i, Ze.memoizedState.deps)
      ? (s.memoizedState = Qa(n, f, a, i))
      : ((Re.flags |= e), (s.memoizedState = Qa(1 | n, f, a, i)));
  }
  function Jm(e, n) {
    Yi(8390656, 8, e, n);
  }
  function Wm(e, n) {
    sl(2048, 8, e, n);
  }
  function ep(e, n) {
    return sl(4, 2, e, n);
  }
  function tp(e, n) {
    return sl(4, 4, e, n);
  }
  function np(e, n) {
    if (typeof n == "function") {
      e = e();
      var a = n(e);
      return function () {
        typeof a == "function" ? a() : n(null);
      };
    }
    if (n != null)
      return (
        (e = e()),
        (n.current = e),
        function () {
          n.current = null;
        }
      );
  }
  function rp(e, n, a) {
    (a = a != null ? a.concat([e]) : null), sl(4, 4, np.bind(null, n, e), a);
  }
  function Lu() {}
  function ap(e, n) {
    var a = ut();
    n = n === void 0 ? null : n;
    var i = a.memoizedState;
    return n !== null && Cu(n, i[1]) ? i[0] : ((a.memoizedState = [e, n]), e);
  }
  function op(e, n) {
    var a = ut();
    n = n === void 0 ? null : n;
    var i = a.memoizedState;
    if (n !== null && Cu(n, i[1])) return i[0];
    if (((i = e()), ca)) {
      kt(!0);
      try {
        e();
      } finally {
        kt(!1);
      }
    }
    return (a.memoizedState = [i, n]), i;
  }
  function Uu(e, n, a) {
    return a === void 0 || (vr & 1073741824) !== 0
      ? (e.memoizedState = n)
      : ((e.memoizedState = a), (e = cg()), (Re.lanes |= e), (Er |= e), a);
  }
  function lp(e, n, a, i) {
    return It(a, n)
      ? a
      : Pa.current !== null
      ? ((e = Uu(e, a, i)), It(e, n) || (bt = !0), e)
      : (vr & 42) === 0
      ? ((bt = !0), (e.memoizedState = a))
      : ((e = cg()), (Re.lanes |= e), (Er |= e), n);
  }
  function ip(e, n, a, i, s) {
    var f = V.p;
    V.p = f !== 0 && 8 > f ? f : 8;
    var b = z.T,
      S = {};
    (z.T = S), Hu(e, !1, n, a);
    try {
      var A = s(),
        U = z.S;
      if (
        (U !== null && U(S, A),
        A !== null && typeof A == "object" && typeof A.then == "function")
      ) {
        var I = rS(A, i);
        ul(e, n, I, Qt(e));
      } else ul(e, n, i, Qt(e));
    } catch (K) {
      ul(e, n, { then: function () {}, status: "rejected", reason: K }, Qt());
    } finally {
      (V.p = f), (z.T = b);
    }
  }
  function cS() {}
  function Bu(e, n, a, i) {
    if (e.tag !== 5) throw Error(l(476));
    var s = cp(e).queue;
    ip(
      e,
      s,
      n,
      $,
      a === null
        ? cS
        : function () {
            return sp(e), a(i);
          }
    );
  }
  function cp(e) {
    var n = e.memoizedState;
    if (n !== null) return n;
    n = {
      memoizedState: $,
      baseState: $,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Jn,
        lastRenderedState: $,
      },
      next: null,
    };
    var a = {};
    return (
      (n.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Jn,
          lastRenderedState: a,
        },
        next: null,
      }),
      (e.memoizedState = n),
      (e = e.alternate),
      e !== null && (e.memoizedState = n),
      n
    );
  }
  function sp(e) {
    var n = cp(e).next.queue;
    ul(e, n, {}, Qt());
  }
  function Zu() {
    return jt(Tl);
  }
  function up() {
    return ut().memoizedState;
  }
  function fp() {
    return ut().memoizedState;
  }
  function sS(e) {
    for (var n = e.return; n !== null; ) {
      switch (n.tag) {
        case 24:
        case 3:
          var a = Qt();
          e = pr(a);
          var i = gr(n, e, a);
          i !== null && (Ft(i, n, a), al(i, n, a)),
            (n = { cache: pu() }),
            (e.payload = n);
          return;
      }
      n = n.return;
    }
  }
  function uS(e, n, a) {
    var i = Qt();
    (a = {
      lane: i,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Vi(e)
        ? hp(n, a)
        : ((a = ou(e, n, a, i)), a !== null && (Ft(a, e, i), mp(a, n, i)));
  }
  function dp(e, n, a) {
    var i = Qt();
    ul(e, n, a, i);
  }
  function ul(e, n, a, i) {
    var s = {
      lane: i,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Vi(e)) hp(n, s);
    else {
      var f = e.alternate;
      if (
        e.lanes === 0 &&
        (f === null || f.lanes === 0) &&
        ((f = n.lastRenderedReducer), f !== null)
      )
        try {
          var b = n.lastRenderedState,
            S = f(b, a);
          if (((s.hasEagerState = !0), (s.eagerState = S), It(S, b)))
            return Ai(e, n, s, 0), Ve === null && Ri(), !1;
        } catch {
        } finally {
        }
      if (((a = ou(e, n, s, i)), a !== null))
        return Ft(a, e, i), mp(a, n, i), !0;
    }
    return !1;
  }
  function Hu(e, n, a, i) {
    if (
      ((i = {
        lane: 2,
        revertLane: bf(),
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Vi(e))
    ) {
      if (n) throw Error(l(479));
    } else (n = ou(e, a, i, 2)), n !== null && Ft(n, e, 2);
  }
  function Vi(e) {
    var n = e.alternate;
    return e === Re || (n !== null && n === Re);
  }
  function hp(e, n) {
    Xa = Bi = !0;
    var a = e.pending;
    a === null ? (n.next = n) : ((n.next = a.next), (a.next = n)),
      (e.pending = n);
  }
  function mp(e, n, a) {
    if ((a & 4194048) !== 0) {
      var i = n.lanes;
      (i &= e.pendingLanes), (a |= i), (n.lanes = a), bn(e, a);
    }
  }
  var Ii = {
      readContext: jt,
      use: Hi,
      useCallback: at,
      useContext: at,
      useEffect: at,
      useImperativeHandle: at,
      useLayoutEffect: at,
      useInsertionEffect: at,
      useMemo: at,
      useReducer: at,
      useRef: at,
      useState: at,
      useDebugValue: at,
      useDeferredValue: at,
      useTransition: at,
      useSyncExternalStore: at,
      useId: at,
      useHostTransitionStatus: at,
      useFormState: at,
      useActionState: at,
      useOptimistic: at,
      useMemoCache: at,
      useCacheRefresh: at,
    },
    pp = {
      readContext: jt,
      use: Hi,
      useCallback: function (e, n) {
        return (Zt().memoizedState = [e, n === void 0 ? null : n]), e;
      },
      useContext: jt,
      useEffect: Jm,
      useImperativeHandle: function (e, n, a) {
        (a = a != null ? a.concat([e]) : null),
          Yi(4194308, 4, np.bind(null, n, e), a);
      },
      useLayoutEffect: function (e, n) {
        return Yi(4194308, 4, e, n);
      },
      useInsertionEffect: function (e, n) {
        Yi(4, 2, e, n);
      },
      useMemo: function (e, n) {
        var a = Zt();
        n = n === void 0 ? null : n;
        var i = e();
        if (ca) {
          kt(!0);
          try {
            e();
          } finally {
            kt(!1);
          }
        }
        return (a.memoizedState = [i, n]), i;
      },
      useReducer: function (e, n, a) {
        var i = Zt();
        if (a !== void 0) {
          var s = a(n);
          if (ca) {
            kt(!0);
            try {
              a(n);
            } finally {
              kt(!1);
            }
          }
        } else s = n;
        return (
          (i.memoizedState = i.baseState = s),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: s,
          }),
          (i.queue = e),
          (e = e.dispatch = uS.bind(null, Re, e)),
          [i.memoizedState, e]
        );
      },
      useRef: function (e) {
        var n = Zt();
        return (e = { current: e }), (n.memoizedState = e);
      },
      useState: function (e) {
        e = Mu(e);
        var n = e.queue,
          a = dp.bind(null, Re, n);
        return (n.dispatch = a), [e.memoizedState, a];
      },
      useDebugValue: Lu,
      useDeferredValue: function (e, n) {
        var a = Zt();
        return Uu(a, e, n);
      },
      useTransition: function () {
        var e = Mu(!1);
        return (
          (e = ip.bind(null, Re, e.queue, !0, !1)),
          (Zt().memoizedState = e),
          [!1, e]
        );
      },
      useSyncExternalStore: function (e, n, a) {
        var i = Re,
          s = Zt();
        if (Me) {
          if (a === void 0) throw Error(l(407));
          a = a();
        } else {
          if (((a = n()), Ve === null)) throw Error(l(349));
          (je & 124) !== 0 || Lm(i, n, a);
        }
        s.memoizedState = a;
        var f = { value: a, getSnapshot: n };
        return (
          (s.queue = f),
          Jm(Bm.bind(null, i, f, e), [e]),
          (i.flags |= 2048),
          Qa(9, Gi(), Um.bind(null, i, f, a, n), null),
          a
        );
      },
      useId: function () {
        var e = Zt(),
          n = Ve.identifierPrefix;
        if (Me) {
          var a = Kn,
            i = Xn;
          (a = (i & ~(1 << (32 - ht(i) - 1))).toString(32) + a),
            (n = "«" + n + "R" + a),
            (a = Zi++),
            0 < a && (n += "H" + a.toString(32)),
            (n += "»");
        } else (a = aS++), (n = "«" + n + "r" + a.toString(32) + "»");
        return (e.memoizedState = n);
      },
      useHostTransitionStatus: Zu,
      useFormState: Pm,
      useActionState: Pm,
      useOptimistic: function (e) {
        var n = Zt();
        n.memoizedState = n.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (n.queue = a),
          (n = Hu.bind(null, Re, !0, a)),
          (a.dispatch = n),
          [e, n]
        );
      },
      useMemoCache: Du,
      useCacheRefresh: function () {
        return (Zt().memoizedState = sS.bind(null, Re));
      },
    },
    gp = {
      readContext: jt,
      use: Hi,
      useCallback: ap,
      useContext: jt,
      useEffect: Wm,
      useImperativeHandle: rp,
      useInsertionEffect: ep,
      useLayoutEffect: tp,
      useMemo: op,
      useReducer: $i,
      useRef: Fm,
      useState: function () {
        return $i(Jn);
      },
      useDebugValue: Lu,
      useDeferredValue: function (e, n) {
        var a = ut();
        return lp(a, Ze.memoizedState, e, n);
      },
      useTransition: function () {
        var e = $i(Jn)[0],
          n = ut().memoizedState;
        return [typeof e == "boolean" ? e : cl(e), n];
      },
      useSyncExternalStore: km,
      useId: up,
      useHostTransitionStatus: Zu,
      useFormState: Xm,
      useActionState: Xm,
      useOptimistic: function (e, n) {
        var a = ut();
        return $m(a, Ze, e, n);
      },
      useMemoCache: Du,
      useCacheRefresh: fp,
    },
    fS = {
      readContext: jt,
      use: Hi,
      useCallback: ap,
      useContext: jt,
      useEffect: Wm,
      useImperativeHandle: rp,
      useInsertionEffect: ep,
      useLayoutEffect: tp,
      useMemo: op,
      useReducer: zu,
      useRef: Fm,
      useState: function () {
        return zu(Jn);
      },
      useDebugValue: Lu,
      useDeferredValue: function (e, n) {
        var a = ut();
        return Ze === null ? Uu(a, e, n) : lp(a, Ze.memoizedState, e, n);
      },
      useTransition: function () {
        var e = zu(Jn)[0],
          n = ut().memoizedState;
        return [typeof e == "boolean" ? e : cl(e), n];
      },
      useSyncExternalStore: km,
      useId: up,
      useHostTransitionStatus: Zu,
      useFormState: Qm,
      useActionState: Qm,
      useOptimistic: function (e, n) {
        var a = ut();
        return Ze !== null
          ? $m(a, Ze, e, n)
          : ((a.baseState = e), [e, a.queue.dispatch]);
      },
      useMemoCache: Du,
      useCacheRefresh: fp,
    },
    Fa = null,
    fl = 0;
  function qi(e) {
    var n = fl;
    return (fl += 1), Fa === null && (Fa = []), Am(Fa, e, n);
  }
  function dl(e, n) {
    (n = n.props.ref), (e.ref = n !== void 0 ? n : null);
  }
  function Pi(e, n) {
    throw n.$$typeof === x
      ? Error(l(525))
      : ((e = Object.prototype.toString.call(n)),
        Error(
          l(
            31,
            e === "[object Object]"
              ? "object with keys {" + Object.keys(n).join(", ") + "}"
              : e
          )
        ));
  }
  function vp(e) {
    var n = e._init;
    return n(e._payload);
  }
  function yp(e) {
    function n(M, N) {
      if (e) {
        var k = M.deletions;
        k === null ? ((M.deletions = [N]), (M.flags |= 16)) : k.push(N);
      }
    }
    function a(M, N) {
      if (!e) return null;
      for (; N !== null; ) n(M, N), (N = N.sibling);
      return null;
    }
    function i(M) {
      for (var N = new Map(); M !== null; )
        M.key !== null ? N.set(M.key, M) : N.set(M.index, M), (M = M.sibling);
      return N;
    }
    function s(M, N) {
      return (M = Pn(M, N)), (M.index = 0), (M.sibling = null), M;
    }
    function f(M, N, k) {
      return (
        (M.index = k),
        e
          ? ((k = M.alternate),
            k !== null
              ? ((k = k.index), k < N ? ((M.flags |= 67108866), N) : k)
              : ((M.flags |= 67108866), N))
          : ((M.flags |= 1048576), N)
      );
    }
    function b(M) {
      return e && M.alternate === null && (M.flags |= 67108866), M;
    }
    function S(M, N, k, P) {
      return N === null || N.tag !== 6
        ? ((N = iu(k, M.mode, P)), (N.return = M), N)
        : ((N = s(N, k)), (N.return = M), N);
    }
    function A(M, N, k, P) {
      var oe = k.type;
      return oe === R
        ? I(M, N, k.props.children, P, k.key)
        : N !== null &&
          (N.elementType === oe ||
            (typeof oe == "object" &&
              oe !== null &&
              oe.$$typeof === G &&
              vp(oe) === N.type))
        ? ((N = s(N, k.props)), dl(N, k), (N.return = M), N)
        : ((N = Ni(k.type, k.key, k.props, null, M.mode, P)),
          dl(N, k),
          (N.return = M),
          N);
    }
    function U(M, N, k, P) {
      return N === null ||
        N.tag !== 4 ||
        N.stateNode.containerInfo !== k.containerInfo ||
        N.stateNode.implementation !== k.implementation
        ? ((N = cu(k, M.mode, P)), (N.return = M), N)
        : ((N = s(N, k.children || [])), (N.return = M), N);
    }
    function I(M, N, k, P, oe) {
      return N === null || N.tag !== 7
        ? ((N = ea(k, M.mode, P, oe)), (N.return = M), N)
        : ((N = s(N, k)), (N.return = M), N);
    }
    function K(M, N, k) {
      if (
        (typeof N == "string" && N !== "") ||
        typeof N == "number" ||
        typeof N == "bigint"
      )
        return (N = iu("" + N, M.mode, k)), (N.return = M), N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case _:
            return (
              (k = Ni(N.type, N.key, N.props, null, M.mode, k)),
              dl(k, N),
              (k.return = M),
              k
            );
          case E:
            return (N = cu(N, M.mode, k)), (N.return = M), N;
          case G:
            var P = N._init;
            return (N = P(N._payload)), K(M, N, k);
        }
        if (me(N) || ue(N))
          return (N = ea(N, M.mode, k, null)), (N.return = M), N;
        if (typeof N.then == "function") return K(M, qi(N), k);
        if (N.$$typeof === j) return K(M, zi(M, N), k);
        Pi(M, N);
      }
      return null;
    }
    function Z(M, N, k, P) {
      var oe = N !== null ? N.key : null;
      if (
        (typeof k == "string" && k !== "") ||
        typeof k == "number" ||
        typeof k == "bigint"
      )
        return oe !== null ? null : S(M, N, "" + k, P);
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case _:
            return k.key === oe ? A(M, N, k, P) : null;
          case E:
            return k.key === oe ? U(M, N, k, P) : null;
          case G:
            return (oe = k._init), (k = oe(k._payload)), Z(M, N, k, P);
        }
        if (me(k) || ue(k)) return oe !== null ? null : I(M, N, k, P, null);
        if (typeof k.then == "function") return Z(M, N, qi(k), P);
        if (k.$$typeof === j) return Z(M, N, zi(M, k), P);
        Pi(M, k);
      }
      return null;
    }
    function H(M, N, k, P, oe) {
      if (
        (typeof P == "string" && P !== "") ||
        typeof P == "number" ||
        typeof P == "bigint"
      )
        return (M = M.get(k) || null), S(N, M, "" + P, oe);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case _:
            return (
              (M = M.get(P.key === null ? k : P.key) || null), A(N, M, P, oe)
            );
          case E:
            return (
              (M = M.get(P.key === null ? k : P.key) || null), U(N, M, P, oe)
            );
          case G:
            var Te = P._init;
            return (P = Te(P._payload)), H(M, N, k, P, oe);
        }
        if (me(P) || ue(P)) return (M = M.get(k) || null), I(N, M, P, oe, null);
        if (typeof P.then == "function") return H(M, N, k, qi(P), oe);
        if (P.$$typeof === j) return H(M, N, k, zi(N, P), oe);
        Pi(N, P);
      }
      return null;
    }
    function xe(M, N, k, P) {
      for (
        var oe = null, Te = null, de = N, be = (N = 0), St = null;
        de !== null && be < k.length;
        be++
      ) {
        de.index > be ? ((St = de), (de = null)) : (St = de.sibling);
        var ze = Z(M, de, k[be], P);
        if (ze === null) {
          de === null && (de = St);
          break;
        }
        e && de && ze.alternate === null && n(M, de),
          (N = f(ze, N, be)),
          Te === null ? (oe = ze) : (Te.sibling = ze),
          (Te = ze),
          (de = St);
      }
      if (be === k.length) return a(M, de), Me && na(M, be), oe;
      if (de === null) {
        for (; be < k.length; be++)
          (de = K(M, k[be], P)),
            de !== null &&
              ((N = f(de, N, be)),
              Te === null ? (oe = de) : (Te.sibling = de),
              (Te = de));
        return Me && na(M, be), oe;
      }
      for (de = i(de); be < k.length; be++)
        (St = H(de, M, be, k[be], P)),
          St !== null &&
            (e &&
              St.alternate !== null &&
              de.delete(St.key === null ? be : St.key),
            (N = f(St, N, be)),
            Te === null ? (oe = St) : (Te.sibling = St),
            (Te = St));
      return (
        e &&
          de.forEach(function (zr) {
            return n(M, zr);
          }),
        Me && na(M, be),
        oe
      );
    }
    function ve(M, N, k, P) {
      if (k == null) throw Error(l(151));
      for (
        var oe = null,
          Te = null,
          de = N,
          be = (N = 0),
          St = null,
          ze = k.next();
        de !== null && !ze.done;
        be++, ze = k.next()
      ) {
        de.index > be ? ((St = de), (de = null)) : (St = de.sibling);
        var zr = Z(M, de, ze.value, P);
        if (zr === null) {
          de === null && (de = St);
          break;
        }
        e && de && zr.alternate === null && n(M, de),
          (N = f(zr, N, be)),
          Te === null ? (oe = zr) : (Te.sibling = zr),
          (Te = zr),
          (de = St);
      }
      if (ze.done) return a(M, de), Me && na(M, be), oe;
      if (de === null) {
        for (; !ze.done; be++, ze = k.next())
          (ze = K(M, ze.value, P)),
            ze !== null &&
              ((N = f(ze, N, be)),
              Te === null ? (oe = ze) : (Te.sibling = ze),
              (Te = ze));
        return Me && na(M, be), oe;
      }
      for (de = i(de); !ze.done; be++, ze = k.next())
        (ze = H(de, M, be, ze.value, P)),
          ze !== null &&
            (e &&
              ze.alternate !== null &&
              de.delete(ze.key === null ? be : ze.key),
            (N = f(ze, N, be)),
            Te === null ? (oe = ze) : (Te.sibling = ze),
            (Te = ze));
      return (
        e &&
          de.forEach(function (dw) {
            return n(M, dw);
          }),
        Me && na(M, be),
        oe
      );
    }
    function $e(M, N, k, P) {
      if (
        (typeof k == "object" &&
          k !== null &&
          k.type === R &&
          k.key === null &&
          (k = k.props.children),
        typeof k == "object" && k !== null)
      ) {
        switch (k.$$typeof) {
          case _:
            e: {
              for (var oe = k.key; N !== null; ) {
                if (N.key === oe) {
                  if (((oe = k.type), oe === R)) {
                    if (N.tag === 7) {
                      a(M, N.sibling),
                        (P = s(N, k.props.children)),
                        (P.return = M),
                        (M = P);
                      break e;
                    }
                  } else if (
                    N.elementType === oe ||
                    (typeof oe == "object" &&
                      oe !== null &&
                      oe.$$typeof === G &&
                      vp(oe) === N.type)
                  ) {
                    a(M, N.sibling),
                      (P = s(N, k.props)),
                      dl(P, k),
                      (P.return = M),
                      (M = P);
                    break e;
                  }
                  a(M, N);
                  break;
                } else n(M, N);
                N = N.sibling;
              }
              k.type === R
                ? ((P = ea(k.props.children, M.mode, P, k.key)),
                  (P.return = M),
                  (M = P))
                : ((P = Ni(k.type, k.key, k.props, null, M.mode, P)),
                  dl(P, k),
                  (P.return = M),
                  (M = P));
            }
            return b(M);
          case E:
            e: {
              for (oe = k.key; N !== null; ) {
                if (N.key === oe)
                  if (
                    N.tag === 4 &&
                    N.stateNode.containerInfo === k.containerInfo &&
                    N.stateNode.implementation === k.implementation
                  ) {
                    a(M, N.sibling),
                      (P = s(N, k.children || [])),
                      (P.return = M),
                      (M = P);
                    break e;
                  } else {
                    a(M, N);
                    break;
                  }
                else n(M, N);
                N = N.sibling;
              }
              (P = cu(k, M.mode, P)), (P.return = M), (M = P);
            }
            return b(M);
          case G:
            return (oe = k._init), (k = oe(k._payload)), $e(M, N, k, P);
        }
        if (me(k)) return xe(M, N, k, P);
        if (ue(k)) {
          if (((oe = ue(k)), typeof oe != "function")) throw Error(l(150));
          return (k = oe.call(k)), ve(M, N, k, P);
        }
        if (typeof k.then == "function") return $e(M, N, qi(k), P);
        if (k.$$typeof === j) return $e(M, N, zi(M, k), P);
        Pi(M, k);
      }
      return (typeof k == "string" && k !== "") ||
        typeof k == "number" ||
        typeof k == "bigint"
        ? ((k = "" + k),
          N !== null && N.tag === 6
            ? (a(M, N.sibling), (P = s(N, k)), (P.return = M), (M = P))
            : (a(M, N), (P = iu(k, M.mode, P)), (P.return = M), (M = P)),
          b(M))
        : a(M, N);
    }
    return function (M, N, k, P) {
      try {
        fl = 0;
        var oe = $e(M, N, k, P);
        return (Fa = null), oe;
      } catch (de) {
        if (de === nl || de === ki) throw de;
        var Te = qt(29, de, null, M.mode);
        return (Te.lanes = P), (Te.return = M), Te;
      } finally {
      }
    };
  }
  var Ja = yp(!0),
    bp = yp(!1),
    fn = q(null),
    Dn = null;
  function yr(e) {
    var n = e.alternate;
    Q(pt, pt.current & 1),
      Q(fn, e),
      Dn === null &&
        (n === null || Pa.current !== null || n.memoizedState !== null) &&
        (Dn = e);
  }
  function xp(e) {
    if (e.tag === 22) {
      if ((Q(pt, pt.current), Q(fn, e), Dn === null)) {
        var n = e.alternate;
        n !== null && n.memoizedState !== null && (Dn = e);
      }
    } else br();
  }
  function br() {
    Q(pt, pt.current), Q(fn, fn.current);
  }
  function Wn(e) {
    J(fn), Dn === e && (Dn = null), J(pt);
  }
  var pt = q(0);
  function Xi(e) {
    for (var n = e; n !== null; ) {
      if (n.tag === 13) {
        var a = n.memoizedState;
        if (
          a !== null &&
          ((a = a.dehydrated), a === null || a.data === "$?" || Df(a))
        )
          return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
        if ((n.flags & 128) !== 0) return n;
      } else if (n.child !== null) {
        (n.child.return = n), (n = n.child);
        continue;
      }
      if (n === e) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === e) return null;
        n = n.return;
      }
      (n.sibling.return = n.return), (n = n.sibling);
    }
    return null;
  }
  function $u(e, n, a, i) {
    (n = e.memoizedState),
      (a = a(i, n)),
      (a = a == null ? n : v({}, n, a)),
      (e.memoizedState = a),
      e.lanes === 0 && (e.updateQueue.baseState = a);
  }
  var Gu = {
    enqueueSetState: function (e, n, a) {
      e = e._reactInternals;
      var i = Qt(),
        s = pr(i);
      (s.payload = n),
        a != null && (s.callback = a),
        (n = gr(e, s, i)),
        n !== null && (Ft(n, e, i), al(n, e, i));
    },
    enqueueReplaceState: function (e, n, a) {
      e = e._reactInternals;
      var i = Qt(),
        s = pr(i);
      (s.tag = 1),
        (s.payload = n),
        a != null && (s.callback = a),
        (n = gr(e, s, i)),
        n !== null && (Ft(n, e, i), al(n, e, i));
    },
    enqueueForceUpdate: function (e, n) {
      e = e._reactInternals;
      var a = Qt(),
        i = pr(a);
      (i.tag = 2),
        n != null && (i.callback = n),
        (n = gr(e, i, a)),
        n !== null && (Ft(n, e, a), al(n, e, a));
    },
  };
  function Sp(e, n, a, i, s, f, b) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(i, f, b)
        : n.prototype && n.prototype.isPureReactComponent
        ? !Xo(a, i) || !Xo(s, f)
        : !0
    );
  }
  function wp(e, n, a, i) {
    (e = n.state),
      typeof n.componentWillReceiveProps == "function" &&
        n.componentWillReceiveProps(a, i),
      typeof n.UNSAFE_componentWillReceiveProps == "function" &&
        n.UNSAFE_componentWillReceiveProps(a, i),
      n.state !== e && Gu.enqueueReplaceState(n, n.state, null);
  }
  function sa(e, n) {
    var a = n;
    if ("ref" in n) {
      a = {};
      for (var i in n) i !== "ref" && (a[i] = n[i]);
    }
    if ((e = e.defaultProps)) {
      a === n && (a = v({}, a));
      for (var s in e) a[s] === void 0 && (a[s] = e[s]);
    }
    return a;
  }
  var Ki =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var n = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof e == "object" &&
                e !== null &&
                typeof e.message == "string"
                  ? String(e.message)
                  : String(e),
              error: e,
            });
            if (!window.dispatchEvent(n)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", e);
            return;
          }
          console.error(e);
        };
  function _p(e) {
    Ki(e);
  }
  function Ep(e) {
    console.error(e);
  }
  function Cp(e) {
    Ki(e);
  }
  function Qi(e, n) {
    try {
      var a = e.onUncaughtError;
      a(n.value, { componentStack: n.stack });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function Rp(e, n, a) {
    try {
      var i = e.onCaughtError;
      i(a.value, {
        componentStack: a.stack,
        errorBoundary: n.tag === 1 ? n.stateNode : null,
      });
    } catch (s) {
      setTimeout(function () {
        throw s;
      });
    }
  }
  function Yu(e, n, a) {
    return (
      (a = pr(a)),
      (a.tag = 3),
      (a.payload = { element: null }),
      (a.callback = function () {
        Qi(e, n);
      }),
      a
    );
  }
  function Ap(e) {
    return (e = pr(e)), (e.tag = 3), e;
  }
  function Tp(e, n, a, i) {
    var s = a.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var f = i.value;
      (e.payload = function () {
        return s(f);
      }),
        (e.callback = function () {
          Rp(n, a, i);
        });
    }
    var b = a.stateNode;
    b !== null &&
      typeof b.componentDidCatch == "function" &&
      (e.callback = function () {
        Rp(n, a, i),
          typeof s != "function" &&
            (Cr === null ? (Cr = new Set([this])) : Cr.add(this));
        var S = i.stack;
        this.componentDidCatch(i.value, {
          componentStack: S !== null ? S : "",
        });
      });
  }
  function dS(e, n, a, i, s) {
    if (
      ((a.flags |= 32768),
      i !== null && typeof i == "object" && typeof i.then == "function")
    ) {
      if (
        ((n = a.alternate),
        n !== null && Wo(n, a, s, !0),
        (a = fn.current),
        a !== null)
      ) {
        switch (a.tag) {
          case 13:
            return (
              Dn === null ? mf() : a.alternate === null && tt === 0 && (tt = 3),
              (a.flags &= -257),
              (a.flags |= 65536),
              (a.lanes = s),
              i === yu
                ? (a.flags |= 16384)
                : ((n = a.updateQueue),
                  n === null ? (a.updateQueue = new Set([i])) : n.add(i),
                  gf(e, i, s)),
              !1
            );
          case 22:
            return (
              (a.flags |= 65536),
              i === yu
                ? (a.flags |= 16384)
                : ((n = a.updateQueue),
                  n === null
                    ? ((n = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([i]),
                      }),
                      (a.updateQueue = n))
                    : ((a = n.retryQueue),
                      a === null ? (n.retryQueue = new Set([i])) : a.add(i)),
                  gf(e, i, s)),
              !1
            );
        }
        throw Error(l(435, a.tag));
      }
      return gf(e, i, s), mf(), !1;
    }
    if (Me)
      return (
        (n = fn.current),
        n !== null
          ? ((n.flags & 65536) === 0 && (n.flags |= 256),
            (n.flags |= 65536),
            (n.lanes = s),
            i !== fu && ((e = Error(l(422), { cause: i })), Jo(ln(e, a))))
          : (i !== fu && ((n = Error(l(423), { cause: i })), Jo(ln(n, a))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (s &= -s),
            (e.lanes |= s),
            (i = ln(i, a)),
            (s = Yu(e.stateNode, i, s)),
            Su(e, s),
            tt !== 4 && (tt = 2)),
        !1
      );
    var f = Error(l(520), { cause: i });
    if (
      ((f = ln(f, a)),
      bl === null ? (bl = [f]) : bl.push(f),
      tt !== 4 && (tt = 2),
      n === null)
    )
      return !0;
    (i = ln(i, a)), (a = n);
    do {
      switch (a.tag) {
        case 3:
          return (
            (a.flags |= 65536),
            (e = s & -s),
            (a.lanes |= e),
            (e = Yu(a.stateNode, i, e)),
            Su(a, e),
            !1
          );
        case 1:
          if (
            ((n = a.type),
            (f = a.stateNode),
            (a.flags & 128) === 0 &&
              (typeof n.getDerivedStateFromError == "function" ||
                (f !== null &&
                  typeof f.componentDidCatch == "function" &&
                  (Cr === null || !Cr.has(f)))))
          )
            return (
              (a.flags |= 65536),
              (s &= -s),
              (a.lanes |= s),
              (s = Ap(s)),
              Tp(s, e, a, i),
              Su(a, s),
              !1
            );
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Np = Error(l(461)),
    bt = !1;
  function Ct(e, n, a, i) {
    n.child = e === null ? bp(n, null, a, i) : Ja(n, e.child, a, i);
  }
  function Op(e, n, a, i, s) {
    a = a.render;
    var f = n.ref;
    if ("ref" in i) {
      var b = {};
      for (var S in i) S !== "ref" && (b[S] = i[S]);
    } else b = i;
    return (
      la(n),
      (i = Ru(e, n, a, b, f, s)),
      (S = Au()),
      e !== null && !bt
        ? (Tu(e, n, s), er(e, n, s))
        : (Me && S && su(n), (n.flags |= 1), Ct(e, n, i, s), n.child)
    );
  }
  function Dp(e, n, a, i, s) {
    if (e === null) {
      var f = a.type;
      return typeof f == "function" &&
        !lu(f) &&
        f.defaultProps === void 0 &&
        a.compare === null
        ? ((n.tag = 15), (n.type = f), jp(e, n, f, i, s))
        : ((e = Ni(a.type, null, i, n, n.mode, s)),
          (e.ref = n.ref),
          (e.return = n),
          (n.child = e));
    }
    if (((f = e.child), !Fu(e, s))) {
      var b = f.memoizedProps;
      if (
        ((a = a.compare), (a = a !== null ? a : Xo), a(b, i) && e.ref === n.ref)
      )
        return er(e, n, s);
    }
    return (
      (n.flags |= 1),
      (e = Pn(f, i)),
      (e.ref = n.ref),
      (e.return = n),
      (n.child = e)
    );
  }
  function jp(e, n, a, i, s) {
    if (e !== null) {
      var f = e.memoizedProps;
      if (Xo(f, i) && e.ref === n.ref)
        if (((bt = !1), (n.pendingProps = i = f), Fu(e, s)))
          (e.flags & 131072) !== 0 && (bt = !0);
        else return (n.lanes = e.lanes), er(e, n, s);
    }
    return Vu(e, n, a, i, s);
  }
  function zp(e, n, a) {
    var i = n.pendingProps,
      s = i.children,
      f = e !== null ? e.memoizedState : null;
    if (i.mode === "hidden") {
      if ((n.flags & 128) !== 0) {
        if (((i = f !== null ? f.baseLanes | a : a), e !== null)) {
          for (s = n.child = e.child, f = 0; s !== null; )
            (f = f | s.lanes | s.childLanes), (s = s.sibling);
          n.childLanes = f & ~i;
        } else (n.childLanes = 0), (n.child = null);
        return Mp(e, n, i, a);
      }
      if ((a & 536870912) !== 0)
        (n.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && Mi(n, f !== null ? f.cachePool : null),
          f !== null ? jm(n, f) : _u(),
          xp(n);
      else
        return (
          (n.lanes = n.childLanes = 536870912),
          Mp(e, n, f !== null ? f.baseLanes | a : a, a)
        );
    } else
      f !== null
        ? (Mi(n, f.cachePool), jm(n, f), br(), (n.memoizedState = null))
        : (e !== null && Mi(n, null), _u(), br());
    return Ct(e, n, s, a), n.child;
  }
  function Mp(e, n, a, i) {
    var s = vu();
    return (
      (s = s === null ? null : { parent: mt._currentValue, pool: s }),
      (n.memoizedState = { baseLanes: a, cachePool: s }),
      e !== null && Mi(n, null),
      _u(),
      xp(n),
      e !== null && Wo(e, n, i, !0),
      null
    );
  }
  function Fi(e, n) {
    var a = n.ref;
    if (a === null) e !== null && e.ref !== null && (n.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object") throw Error(l(284));
      (e === null || e.ref !== a) && (n.flags |= 4194816);
    }
  }
  function Vu(e, n, a, i, s) {
    return (
      la(n),
      (a = Ru(e, n, a, i, void 0, s)),
      (i = Au()),
      e !== null && !bt
        ? (Tu(e, n, s), er(e, n, s))
        : (Me && i && su(n), (n.flags |= 1), Ct(e, n, a, s), n.child)
    );
  }
  function kp(e, n, a, i, s, f) {
    return (
      la(n),
      (n.updateQueue = null),
      (a = Mm(n, i, a, s)),
      zm(e),
      (i = Au()),
      e !== null && !bt
        ? (Tu(e, n, f), er(e, n, f))
        : (Me && i && su(n), (n.flags |= 1), Ct(e, n, a, f), n.child)
    );
  }
  function Lp(e, n, a, i, s) {
    if ((la(n), n.stateNode === null)) {
      var f = Ga,
        b = a.contextType;
      typeof b == "object" && b !== null && (f = jt(b)),
        (f = new a(i, f)),
        (n.memoizedState =
          f.state !== null && f.state !== void 0 ? f.state : null),
        (f.updater = Gu),
        (n.stateNode = f),
        (f._reactInternals = n),
        (f = n.stateNode),
        (f.props = i),
        (f.state = n.memoizedState),
        (f.refs = {}),
        bu(n),
        (b = a.contextType),
        (f.context = typeof b == "object" && b !== null ? jt(b) : Ga),
        (f.state = n.memoizedState),
        (b = a.getDerivedStateFromProps),
        typeof b == "function" && ($u(n, a, b, i), (f.state = n.memoizedState)),
        typeof a.getDerivedStateFromProps == "function" ||
          typeof f.getSnapshotBeforeUpdate == "function" ||
          (typeof f.UNSAFE_componentWillMount != "function" &&
            typeof f.componentWillMount != "function") ||
          ((b = f.state),
          typeof f.componentWillMount == "function" && f.componentWillMount(),
          typeof f.UNSAFE_componentWillMount == "function" &&
            f.UNSAFE_componentWillMount(),
          b !== f.state && Gu.enqueueReplaceState(f, f.state, null),
          ll(n, i, f, s),
          ol(),
          (f.state = n.memoizedState)),
        typeof f.componentDidMount == "function" && (n.flags |= 4194308),
        (i = !0);
    } else if (e === null) {
      f = n.stateNode;
      var S = n.memoizedProps,
        A = sa(a, S);
      f.props = A;
      var U = f.context,
        I = a.contextType;
      (b = Ga), typeof I == "object" && I !== null && (b = jt(I));
      var K = a.getDerivedStateFromProps;
      (I =
        typeof K == "function" ||
        typeof f.getSnapshotBeforeUpdate == "function"),
        (S = n.pendingProps !== S),
        I ||
          (typeof f.UNSAFE_componentWillReceiveProps != "function" &&
            typeof f.componentWillReceiveProps != "function") ||
          ((S || U !== b) && wp(n, f, i, b)),
        (mr = !1);
      var Z = n.memoizedState;
      (f.state = Z),
        ll(n, i, f, s),
        ol(),
        (U = n.memoizedState),
        S || Z !== U || mr
          ? (typeof K == "function" && ($u(n, a, K, i), (U = n.memoizedState)),
            (A = mr || Sp(n, a, A, i, Z, U, b))
              ? (I ||
                  (typeof f.UNSAFE_componentWillMount != "function" &&
                    typeof f.componentWillMount != "function") ||
                  (typeof f.componentWillMount == "function" &&
                    f.componentWillMount(),
                  typeof f.UNSAFE_componentWillMount == "function" &&
                    f.UNSAFE_componentWillMount()),
                typeof f.componentDidMount == "function" &&
                  (n.flags |= 4194308))
              : (typeof f.componentDidMount == "function" &&
                  (n.flags |= 4194308),
                (n.memoizedProps = i),
                (n.memoizedState = U)),
            (f.props = i),
            (f.state = U),
            (f.context = b),
            (i = A))
          : (typeof f.componentDidMount == "function" && (n.flags |= 4194308),
            (i = !1));
    } else {
      (f = n.stateNode),
        xu(e, n),
        (b = n.memoizedProps),
        (I = sa(a, b)),
        (f.props = I),
        (K = n.pendingProps),
        (Z = f.context),
        (U = a.contextType),
        (A = Ga),
        typeof U == "object" && U !== null && (A = jt(U)),
        (S = a.getDerivedStateFromProps),
        (U =
          typeof S == "function" ||
          typeof f.getSnapshotBeforeUpdate == "function") ||
          (typeof f.UNSAFE_componentWillReceiveProps != "function" &&
            typeof f.componentWillReceiveProps != "function") ||
          ((b !== K || Z !== A) && wp(n, f, i, A)),
        (mr = !1),
        (Z = n.memoizedState),
        (f.state = Z),
        ll(n, i, f, s),
        ol();
      var H = n.memoizedState;
      b !== K ||
      Z !== H ||
      mr ||
      (e !== null && e.dependencies !== null && ji(e.dependencies))
        ? (typeof S == "function" && ($u(n, a, S, i), (H = n.memoizedState)),
          (I =
            mr ||
            Sp(n, a, I, i, Z, H, A) ||
            (e !== null && e.dependencies !== null && ji(e.dependencies)))
            ? (U ||
                (typeof f.UNSAFE_componentWillUpdate != "function" &&
                  typeof f.componentWillUpdate != "function") ||
                (typeof f.componentWillUpdate == "function" &&
                  f.componentWillUpdate(i, H, A),
                typeof f.UNSAFE_componentWillUpdate == "function" &&
                  f.UNSAFE_componentWillUpdate(i, H, A)),
              typeof f.componentDidUpdate == "function" && (n.flags |= 4),
              typeof f.getSnapshotBeforeUpdate == "function" &&
                (n.flags |= 1024))
            : (typeof f.componentDidUpdate != "function" ||
                (b === e.memoizedProps && Z === e.memoizedState) ||
                (n.flags |= 4),
              typeof f.getSnapshotBeforeUpdate != "function" ||
                (b === e.memoizedProps && Z === e.memoizedState) ||
                (n.flags |= 1024),
              (n.memoizedProps = i),
              (n.memoizedState = H)),
          (f.props = i),
          (f.state = H),
          (f.context = A),
          (i = I))
        : (typeof f.componentDidUpdate != "function" ||
            (b === e.memoizedProps && Z === e.memoizedState) ||
            (n.flags |= 4),
          typeof f.getSnapshotBeforeUpdate != "function" ||
            (b === e.memoizedProps && Z === e.memoizedState) ||
            (n.flags |= 1024),
          (i = !1));
    }
    return (
      (f = i),
      Fi(e, n),
      (i = (n.flags & 128) !== 0),
      f || i
        ? ((f = n.stateNode),
          (a =
            i && typeof a.getDerivedStateFromError != "function"
              ? null
              : f.render()),
          (n.flags |= 1),
          e !== null && i
            ? ((n.child = Ja(n, e.child, null, s)),
              (n.child = Ja(n, null, a, s)))
            : Ct(e, n, a, s),
          (n.memoizedState = f.state),
          (e = n.child))
        : (e = er(e, n, s)),
      e
    );
  }
  function Up(e, n, a, i) {
    return Fo(), (n.flags |= 256), Ct(e, n, a, i), n.child;
  }
  var Iu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function qu(e) {
    return { baseLanes: e, cachePool: Em() };
  }
  function Pu(e, n, a) {
    return (e = e !== null ? e.childLanes & ~a : 0), n && (e |= dn), e;
  }
  function Bp(e, n, a) {
    var i = n.pendingProps,
      s = !1,
      f = (n.flags & 128) !== 0,
      b;
    if (
      ((b = f) ||
        (b =
          e !== null && e.memoizedState === null ? !1 : (pt.current & 2) !== 0),
      b && ((s = !0), (n.flags &= -129)),
      (b = (n.flags & 32) !== 0),
      (n.flags &= -33),
      e === null)
    ) {
      if (Me) {
        if ((s ? yr(n) : br(), Me)) {
          var S = et,
            A;
          if ((A = S)) {
            e: {
              for (A = S, S = On; A.nodeType !== 8; ) {
                if (!S) {
                  S = null;
                  break e;
                }
                if (((A = wn(A.nextSibling)), A === null)) {
                  S = null;
                  break e;
                }
              }
              S = A;
            }
            S !== null
              ? ((n.memoizedState = {
                  dehydrated: S,
                  treeContext: ta !== null ? { id: Xn, overflow: Kn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (A = qt(18, null, null, 0)),
                (A.stateNode = S),
                (A.return = n),
                (n.child = A),
                (Ut = n),
                (et = null),
                (A = !0))
              : (A = !1);
          }
          A || aa(n);
        }
        if (
          ((S = n.memoizedState),
          S !== null && ((S = S.dehydrated), S !== null))
        )
          return Df(S) ? (n.lanes = 32) : (n.lanes = 536870912), null;
        Wn(n);
      }
      return (
        (S = i.children),
        (i = i.fallback),
        s
          ? (br(),
            (s = n.mode),
            (S = Ji({ mode: "hidden", children: S }, s)),
            (i = ea(i, s, a, null)),
            (S.return = n),
            (i.return = n),
            (S.sibling = i),
            (n.child = S),
            (s = n.child),
            (s.memoizedState = qu(a)),
            (s.childLanes = Pu(e, b, a)),
            (n.memoizedState = Iu),
            i)
          : (yr(n), Xu(n, S))
      );
    }
    if (
      ((A = e.memoizedState), A !== null && ((S = A.dehydrated), S !== null))
    ) {
      if (f)
        n.flags & 256
          ? (yr(n), (n.flags &= -257), (n = Ku(e, n, a)))
          : n.memoizedState !== null
          ? (br(), (n.child = e.child), (n.flags |= 128), (n = null))
          : (br(),
            (s = i.fallback),
            (S = n.mode),
            (i = Ji({ mode: "visible", children: i.children }, S)),
            (s = ea(s, S, a, null)),
            (s.flags |= 2),
            (i.return = n),
            (s.return = n),
            (i.sibling = s),
            (n.child = i),
            Ja(n, e.child, null, a),
            (i = n.child),
            (i.memoizedState = qu(a)),
            (i.childLanes = Pu(e, b, a)),
            (n.memoizedState = Iu),
            (n = s));
      else if ((yr(n), Df(S))) {
        if (((b = S.nextSibling && S.nextSibling.dataset), b)) var U = b.dgst;
        (b = U),
          (i = Error(l(419))),
          (i.stack = ""),
          (i.digest = b),
          Jo({ value: i, source: null, stack: null }),
          (n = Ku(e, n, a));
      } else if (
        (bt || Wo(e, n, a, !1), (b = (a & e.childLanes) !== 0), bt || b)
      ) {
        if (
          ((b = Ve),
          b !== null &&
            ((i = a & -a),
            (i = (i & 42) !== 0 ? 1 : Ot(i)),
            (i = (i & (b.suspendedLanes | a)) !== 0 ? 0 : i),
            i !== 0 && i !== A.retryLane))
        )
          throw ((A.retryLane = i), $a(e, i), Ft(b, e, i), Np);
        S.data === "$?" || mf(), (n = Ku(e, n, a));
      } else
        S.data === "$?"
          ? ((n.flags |= 192), (n.child = e.child), (n = null))
          : ((e = A.treeContext),
            (et = wn(S.nextSibling)),
            (Ut = n),
            (Me = !0),
            (ra = null),
            (On = !1),
            e !== null &&
              ((sn[un++] = Xn),
              (sn[un++] = Kn),
              (sn[un++] = ta),
              (Xn = e.id),
              (Kn = e.overflow),
              (ta = n)),
            (n = Xu(n, i.children)),
            (n.flags |= 4096));
      return n;
    }
    return s
      ? (br(),
        (s = i.fallback),
        (S = n.mode),
        (A = e.child),
        (U = A.sibling),
        (i = Pn(A, { mode: "hidden", children: i.children })),
        (i.subtreeFlags = A.subtreeFlags & 65011712),
        U !== null ? (s = Pn(U, s)) : ((s = ea(s, S, a, null)), (s.flags |= 2)),
        (s.return = n),
        (i.return = n),
        (i.sibling = s),
        (n.child = i),
        (i = s),
        (s = n.child),
        (S = e.child.memoizedState),
        S === null
          ? (S = qu(a))
          : ((A = S.cachePool),
            A !== null
              ? ((U = mt._currentValue),
                (A = A.parent !== U ? { parent: U, pool: U } : A))
              : (A = Em()),
            (S = { baseLanes: S.baseLanes | a, cachePool: A })),
        (s.memoizedState = S),
        (s.childLanes = Pu(e, b, a)),
        (n.memoizedState = Iu),
        i)
      : (yr(n),
        (a = e.child),
        (e = a.sibling),
        (a = Pn(a, { mode: "visible", children: i.children })),
        (a.return = n),
        (a.sibling = null),
        e !== null &&
          ((b = n.deletions),
          b === null ? ((n.deletions = [e]), (n.flags |= 16)) : b.push(e)),
        (n.child = a),
        (n.memoizedState = null),
        a);
  }
  function Xu(e, n) {
    return (
      (n = Ji({ mode: "visible", children: n }, e.mode)),
      (n.return = e),
      (e.child = n)
    );
  }
  function Ji(e, n) {
    return (
      (e = qt(22, e, null, n)),
      (e.lanes = 0),
      (e.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null,
      }),
      e
    );
  }
  function Ku(e, n, a) {
    return (
      Ja(n, e.child, null, a),
      (e = Xu(n, n.pendingProps.children)),
      (e.flags |= 2),
      (n.memoizedState = null),
      e
    );
  }
  function Zp(e, n, a) {
    e.lanes |= n;
    var i = e.alternate;
    i !== null && (i.lanes |= n), hu(e.return, n, a);
  }
  function Qu(e, n, a, i, s) {
    var f = e.memoizedState;
    f === null
      ? (e.memoizedState = {
          isBackwards: n,
          rendering: null,
          renderingStartTime: 0,
          last: i,
          tail: a,
          tailMode: s,
        })
      : ((f.isBackwards = n),
        (f.rendering = null),
        (f.renderingStartTime = 0),
        (f.last = i),
        (f.tail = a),
        (f.tailMode = s));
  }
  function Hp(e, n, a) {
    var i = n.pendingProps,
      s = i.revealOrder,
      f = i.tail;
    if ((Ct(e, n, i.children, a), (i = pt.current), (i & 2) !== 0))
      (i = (i & 1) | 2), (n.flags |= 128);
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = n.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && Zp(e, a, n);
          else if (e.tag === 19) Zp(e, a, n);
          else if (e.child !== null) {
            (e.child.return = e), (e = e.child);
            continue;
          }
          if (e === n) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === n) break e;
            e = e.return;
          }
          (e.sibling.return = e.return), (e = e.sibling);
        }
      i &= 1;
    }
    switch ((Q(pt, i), s)) {
      case "forwards":
        for (a = n.child, s = null; a !== null; )
          (e = a.alternate),
            e !== null && Xi(e) === null && (s = a),
            (a = a.sibling);
        (a = s),
          a === null
            ? ((s = n.child), (n.child = null))
            : ((s = a.sibling), (a.sibling = null)),
          Qu(n, !1, s, a, f);
        break;
      case "backwards":
        for (a = null, s = n.child, n.child = null; s !== null; ) {
          if (((e = s.alternate), e !== null && Xi(e) === null)) {
            n.child = s;
            break;
          }
          (e = s.sibling), (s.sibling = a), (a = s), (s = e);
        }
        Qu(n, !0, a, null, f);
        break;
      case "together":
        Qu(n, !1, null, null, void 0);
        break;
      default:
        n.memoizedState = null;
    }
    return n.child;
  }
  function er(e, n, a) {
    if (
      (e !== null && (n.dependencies = e.dependencies),
      (Er |= n.lanes),
      (a & n.childLanes) === 0)
    )
      if (e !== null) {
        if ((Wo(e, n, a, !1), (a & n.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && n.child !== e.child) throw Error(l(153));
    if (n.child !== null) {
      for (
        e = n.child, a = Pn(e, e.pendingProps), n.child = a, a.return = n;
        e.sibling !== null;

      )
        (e = e.sibling),
          (a = a.sibling = Pn(e, e.pendingProps)),
          (a.return = n);
      a.sibling = null;
    }
    return n.child;
  }
  function Fu(e, n) {
    return (e.lanes & n) !== 0
      ? !0
      : ((e = e.dependencies), !!(e !== null && ji(e)));
  }
  function hS(e, n, a) {
    switch (n.tag) {
      case 3:
        fe(n, n.stateNode.containerInfo),
          hr(n, mt, e.memoizedState.cache),
          Fo();
        break;
      case 27:
      case 5:
        ce(n);
        break;
      case 4:
        fe(n, n.stateNode.containerInfo);
        break;
      case 10:
        hr(n, n.type, n.memoizedProps.value);
        break;
      case 13:
        var i = n.memoizedState;
        if (i !== null)
          return i.dehydrated !== null
            ? (yr(n), (n.flags |= 128), null)
            : (a & n.child.childLanes) !== 0
            ? Bp(e, n, a)
            : (yr(n), (e = er(e, n, a)), e !== null ? e.sibling : null);
        yr(n);
        break;
      case 19:
        var s = (e.flags & 128) !== 0;
        if (
          ((i = (a & n.childLanes) !== 0),
          i || (Wo(e, n, a, !1), (i = (a & n.childLanes) !== 0)),
          s)
        ) {
          if (i) return Hp(e, n, a);
          n.flags |= 128;
        }
        if (
          ((s = n.memoizedState),
          s !== null &&
            ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
          Q(pt, pt.current),
          i)
        )
          break;
        return null;
      case 22:
      case 23:
        return (n.lanes = 0), zp(e, n, a);
      case 24:
        hr(n, mt, e.memoizedState.cache);
    }
    return er(e, n, a);
  }
  function $p(e, n, a) {
    if (e !== null)
      if (e.memoizedProps !== n.pendingProps) bt = !0;
      else {
        if (!Fu(e, a) && (n.flags & 128) === 0) return (bt = !1), hS(e, n, a);
        bt = (e.flags & 131072) !== 0;
      }
    else (bt = !1), Me && (n.flags & 1048576) !== 0 && vm(n, Di, n.index);
    switch (((n.lanes = 0), n.tag)) {
      case 16:
        e: {
          e = n.pendingProps;
          var i = n.elementType,
            s = i._init;
          if (((i = s(i._payload)), (n.type = i), typeof i == "function"))
            lu(i)
              ? ((e = sa(i, e)), (n.tag = 1), (n = Lp(null, n, i, e, a)))
              : ((n.tag = 0), (n = Vu(null, n, i, e, a)));
          else {
            if (i != null) {
              if (((s = i.$$typeof), s === B)) {
                (n.tag = 11), (n = Op(null, n, i, e, a));
                break e;
              } else if (s === Y) {
                (n.tag = 14), (n = Dp(null, n, i, e, a));
                break e;
              }
            }
            throw ((n = he(i) || i), Error(l(306, n, "")));
          }
        }
        return n;
      case 0:
        return Vu(e, n, n.type, n.pendingProps, a);
      case 1:
        return (i = n.type), (s = sa(i, n.pendingProps)), Lp(e, n, i, s, a);
      case 3:
        e: {
          if ((fe(n, n.stateNode.containerInfo), e === null))
            throw Error(l(387));
          i = n.pendingProps;
          var f = n.memoizedState;
          (s = f.element), xu(e, n), ll(n, i, null, a);
          var b = n.memoizedState;
          if (
            ((i = b.cache),
            hr(n, mt, i),
            i !== f.cache && mu(n, [mt], a, !0),
            ol(),
            (i = b.element),
            f.isDehydrated)
          )
            if (
              ((f = { element: i, isDehydrated: !1, cache: b.cache }),
              (n.updateQueue.baseState = f),
              (n.memoizedState = f),
              n.flags & 256)
            ) {
              n = Up(e, n, i, a);
              break e;
            } else if (i !== s) {
              (s = ln(Error(l(424)), n)), Jo(s), (n = Up(e, n, i, a));
              break e;
            } else {
              switch (((e = n.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (
                et = wn(e.firstChild),
                  Ut = n,
                  Me = !0,
                  ra = null,
                  On = !0,
                  a = bp(n, null, i, a),
                  n.child = a;
                a;

              )
                (a.flags = (a.flags & -3) | 4096), (a = a.sibling);
            }
          else {
            if ((Fo(), i === s)) {
              n = er(e, n, a);
              break e;
            }
            Ct(e, n, i, a);
          }
          n = n.child;
        }
        return n;
      case 26:
        return (
          Fi(e, n),
          e === null
            ? (a = Ig(n.type, null, n.pendingProps, null))
              ? (n.memoizedState = a)
              : Me ||
                ((a = n.type),
                (e = n.pendingProps),
                (i = dc(ne.current).createElement(a)),
                (i[qe] = n),
                (i[Pe] = e),
                At(i, a, e),
                yt(i),
                (n.stateNode = i))
            : (n.memoizedState = Ig(
                n.type,
                e.memoizedProps,
                n.pendingProps,
                e.memoizedState
              )),
          null
        );
      case 27:
        return (
          ce(n),
          e === null &&
            Me &&
            ((i = n.stateNode = Gg(n.type, n.pendingProps, ne.current)),
            (Ut = n),
            (On = !0),
            (s = et),
            Tr(n.type) ? ((jf = s), (et = wn(i.firstChild))) : (et = s)),
          Ct(e, n, n.pendingProps.children, a),
          Fi(e, n),
          e === null && (n.flags |= 4194304),
          n.child
        );
      case 5:
        return (
          e === null &&
            Me &&
            ((s = i = et) &&
              ((i = $S(i, n.type, n.pendingProps, On)),
              i !== null
                ? ((n.stateNode = i),
                  (Ut = n),
                  (et = wn(i.firstChild)),
                  (On = !1),
                  (s = !0))
                : (s = !1)),
            s || aa(n)),
          ce(n),
          (s = n.type),
          (f = n.pendingProps),
          (b = e !== null ? e.memoizedProps : null),
          (i = f.children),
          Tf(s, f) ? (i = null) : b !== null && Tf(s, b) && (n.flags |= 32),
          n.memoizedState !== null &&
            ((s = Ru(e, n, oS, null, null, a)), (Tl._currentValue = s)),
          Fi(e, n),
          Ct(e, n, i, a),
          n.child
        );
      case 6:
        return (
          e === null &&
            Me &&
            ((e = a = et) &&
              ((a = GS(a, n.pendingProps, On)),
              a !== null
                ? ((n.stateNode = a), (Ut = n), (et = null), (e = !0))
                : (e = !1)),
            e || aa(n)),
          null
        );
      case 13:
        return Bp(e, n, a);
      case 4:
        return (
          fe(n, n.stateNode.containerInfo),
          (i = n.pendingProps),
          e === null ? (n.child = Ja(n, null, i, a)) : Ct(e, n, i, a),
          n.child
        );
      case 11:
        return Op(e, n, n.type, n.pendingProps, a);
      case 7:
        return Ct(e, n, n.pendingProps, a), n.child;
      case 8:
        return Ct(e, n, n.pendingProps.children, a), n.child;
      case 12:
        return Ct(e, n, n.pendingProps.children, a), n.child;
      case 10:
        return (
          (i = n.pendingProps),
          hr(n, n.type, i.value),
          Ct(e, n, i.children, a),
          n.child
        );
      case 9:
        return (
          (s = n.type._context),
          (i = n.pendingProps.children),
          la(n),
          (s = jt(s)),
          (i = i(s)),
          (n.flags |= 1),
          Ct(e, n, i, a),
          n.child
        );
      case 14:
        return Dp(e, n, n.type, n.pendingProps, a);
      case 15:
        return jp(e, n, n.type, n.pendingProps, a);
      case 19:
        return Hp(e, n, a);
      case 31:
        return (
          (i = n.pendingProps),
          (a = n.mode),
          (i = { mode: i.mode, children: i.children }),
          e === null
            ? ((a = Ji(i, a)),
              (a.ref = n.ref),
              (n.child = a),
              (a.return = n),
              (n = a))
            : ((a = Pn(e.child, i)),
              (a.ref = n.ref),
              (n.child = a),
              (a.return = n),
              (n = a)),
          n
        );
      case 22:
        return zp(e, n, a);
      case 24:
        return (
          la(n),
          (i = jt(mt)),
          e === null
            ? ((s = vu()),
              s === null &&
                ((s = Ve),
                (f = pu()),
                (s.pooledCache = f),
                f.refCount++,
                f !== null && (s.pooledCacheLanes |= a),
                (s = f)),
              (n.memoizedState = { parent: i, cache: s }),
              bu(n),
              hr(n, mt, s))
            : ((e.lanes & a) !== 0 && (xu(e, n), ll(n, null, null, a), ol()),
              (s = e.memoizedState),
              (f = n.memoizedState),
              s.parent !== i
                ? ((s = { parent: i, cache: i }),
                  (n.memoizedState = s),
                  n.lanes === 0 &&
                    (n.memoizedState = n.updateQueue.baseState = s),
                  hr(n, mt, i))
                : ((i = f.cache),
                  hr(n, mt, i),
                  i !== s.cache && mu(n, [mt], a, !0))),
          Ct(e, n, n.pendingProps.children, a),
          n.child
        );
      case 29:
        throw n.pendingProps;
    }
    throw Error(l(156, n.tag));
  }
  function tr(e) {
    e.flags |= 4;
  }
  function Gp(e, n) {
    if (n.type !== "stylesheet" || (n.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (((e.flags |= 16777216), !Qg(n))) {
      if (
        ((n = fn.current),
        n !== null &&
          ((je & 4194048) === je
            ? Dn !== null
            : ((je & 62914560) !== je && (je & 536870912) === 0) || n !== Dn))
      )
        throw ((rl = yu), Cm);
      e.flags |= 8192;
    }
  }
  function Wi(e, n) {
    n !== null && (e.flags |= 4),
      e.flags & 16384 &&
        ((n = e.tag !== 22 ? mi() : 536870912), (e.lanes |= n), (no |= n));
  }
  function hl(e, n) {
    if (!Me)
      switch (e.tailMode) {
        case "hidden":
          n = e.tail;
          for (var a = null; n !== null; )
            n.alternate !== null && (a = n), (n = n.sibling);
          a === null ? (e.tail = null) : (a.sibling = null);
          break;
        case "collapsed":
          a = e.tail;
          for (var i = null; a !== null; )
            a.alternate !== null && (i = a), (a = a.sibling);
          i === null
            ? n || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (i.sibling = null);
      }
  }
  function Fe(e) {
    var n = e.alternate !== null && e.alternate.child === e.child,
      a = 0,
      i = 0;
    if (n)
      for (var s = e.child; s !== null; )
        (a |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags & 65011712),
          (i |= s.flags & 65011712),
          (s.return = e),
          (s = s.sibling);
    else
      for (s = e.child; s !== null; )
        (a |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags),
          (i |= s.flags),
          (s.return = e),
          (s = s.sibling);
    return (e.subtreeFlags |= i), (e.childLanes = a), n;
  }
  function mS(e, n, a) {
    var i = n.pendingProps;
    switch ((uu(n), n.tag)) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Fe(n), null;
      case 1:
        return Fe(n), null;
      case 3:
        return (
          (a = n.stateNode),
          (i = null),
          e !== null && (i = e.memoizedState.cache),
          n.memoizedState.cache !== i && (n.flags |= 2048),
          Fn(mt),
          Ee(),
          a.pendingContext &&
            ((a.context = a.pendingContext), (a.pendingContext = null)),
          (e === null || e.child === null) &&
            (Qo(n)
              ? tr(n)
              : e === null ||
                (e.memoizedState.isDehydrated && (n.flags & 256) === 0) ||
                ((n.flags |= 1024), xm())),
          Fe(n),
          null
        );
      case 26:
        return (
          (a = n.memoizedState),
          e === null
            ? (tr(n),
              a !== null ? (Fe(n), Gp(n, a)) : (Fe(n), (n.flags &= -16777217)))
            : a
            ? a !== e.memoizedState
              ? (tr(n), Fe(n), Gp(n, a))
              : (Fe(n), (n.flags &= -16777217))
            : (e.memoizedProps !== i && tr(n), Fe(n), (n.flags &= -16777217)),
          null
        );
      case 27:
        Ce(n), (a = ne.current);
        var s = n.type;
        if (e !== null && n.stateNode != null) e.memoizedProps !== i && tr(n);
        else {
          if (!i) {
            if (n.stateNode === null) throw Error(l(166));
            return Fe(n), null;
          }
          (e = ee.current),
            Qo(n) ? ym(n) : ((e = Gg(s, i, a)), (n.stateNode = e), tr(n));
        }
        return Fe(n), null;
      case 5:
        if ((Ce(n), (a = n.type), e !== null && n.stateNode != null))
          e.memoizedProps !== i && tr(n);
        else {
          if (!i) {
            if (n.stateNode === null) throw Error(l(166));
            return Fe(n), null;
          }
          if (((e = ee.current), Qo(n))) ym(n);
          else {
            switch (((s = dc(ne.current)), e)) {
              case 1:
                e = s.createElementNS("http://www.w3.org/2000/svg", a);
                break;
              case 2:
                e = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                break;
              default:
                switch (a) {
                  case "svg":
                    e = s.createElementNS("http://www.w3.org/2000/svg", a);
                    break;
                  case "math":
                    e = s.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      a
                    );
                    break;
                  case "script":
                    (e = s.createElement("div")),
                      (e.innerHTML = "<script></script>"),
                      (e = e.removeChild(e.firstChild));
                    break;
                  case "select":
                    (e =
                      typeof i.is == "string"
                        ? s.createElement("select", { is: i.is })
                        : s.createElement("select")),
                      i.multiple
                        ? (e.multiple = !0)
                        : i.size && (e.size = i.size);
                    break;
                  default:
                    e =
                      typeof i.is == "string"
                        ? s.createElement(a, { is: i.is })
                        : s.createElement(a);
                }
            }
            (e[qe] = n), (e[Pe] = i);
            e: for (s = n.child; s !== null; ) {
              if (s.tag === 5 || s.tag === 6) e.appendChild(s.stateNode);
              else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                (s.child.return = s), (s = s.child);
                continue;
              }
              if (s === n) break e;
              for (; s.sibling === null; ) {
                if (s.return === null || s.return === n) break e;
                s = s.return;
              }
              (s.sibling.return = s.return), (s = s.sibling);
            }
            n.stateNode = e;
            e: switch ((At(e, a, i), a)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!i.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && tr(n);
          }
        }
        return Fe(n), (n.flags &= -16777217), null;
      case 6:
        if (e && n.stateNode != null) e.memoizedProps !== i && tr(n);
        else {
          if (typeof i != "string" && n.stateNode === null) throw Error(l(166));
          if (((e = ne.current), Qo(n))) {
            if (
              ((e = n.stateNode),
              (a = n.memoizedProps),
              (i = null),
              (s = Ut),
              s !== null)
            )
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            (e[qe] = n),
              (e = !!(
                e.nodeValue === a ||
                (i !== null && i.suppressHydrationWarning === !0) ||
                kg(e.nodeValue, a)
              )),
              e || aa(n);
          } else (e = dc(e).createTextNode(i)), (e[qe] = n), (n.stateNode = e);
        }
        return Fe(n), null;
      case 13:
        if (
          ((i = n.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((s = Qo(n)), i !== null && i.dehydrated !== null)) {
            if (e === null) {
              if (!s) throw Error(l(318));
              if (
                ((s = n.memoizedState),
                (s = s !== null ? s.dehydrated : null),
                !s)
              )
                throw Error(l(317));
              s[qe] = n;
            } else
              Fo(),
                (n.flags & 128) === 0 && (n.memoizedState = null),
                (n.flags |= 4);
            Fe(n), (s = !1);
          } else
            (s = xm()),
              e !== null &&
                e.memoizedState !== null &&
                (e.memoizedState.hydrationErrors = s),
              (s = !0);
          if (!s) return n.flags & 256 ? (Wn(n), n) : (Wn(n), null);
        }
        if ((Wn(n), (n.flags & 128) !== 0)) return (n.lanes = a), n;
        if (
          ((a = i !== null), (e = e !== null && e.memoizedState !== null), a)
        ) {
          (i = n.child),
            (s = null),
            i.alternate !== null &&
              i.alternate.memoizedState !== null &&
              i.alternate.memoizedState.cachePool !== null &&
              (s = i.alternate.memoizedState.cachePool.pool);
          var f = null;
          i.memoizedState !== null &&
            i.memoizedState.cachePool !== null &&
            (f = i.memoizedState.cachePool.pool),
            f !== s && (i.flags |= 2048);
        }
        return (
          a !== e && a && (n.child.flags |= 8192),
          Wi(n, n.updateQueue),
          Fe(n),
          null
        );
      case 4:
        return Ee(), e === null && _f(n.stateNode.containerInfo), Fe(n), null;
      case 10:
        return Fn(n.type), Fe(n), null;
      case 19:
        if ((J(pt), (s = n.memoizedState), s === null)) return Fe(n), null;
        if (((i = (n.flags & 128) !== 0), (f = s.rendering), f === null))
          if (i) hl(s, !1);
          else {
            if (tt !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = n.child; e !== null; ) {
                if (((f = Xi(e)), f !== null)) {
                  for (
                    n.flags |= 128,
                      hl(s, !1),
                      e = f.updateQueue,
                      n.updateQueue = e,
                      Wi(n, e),
                      n.subtreeFlags = 0,
                      e = a,
                      a = n.child;
                    a !== null;

                  )
                    gm(a, e), (a = a.sibling);
                  return Q(pt, (pt.current & 1) | 2), n.child;
                }
                e = e.sibling;
              }
            s.tail !== null &&
              _t() > nc &&
              ((n.flags |= 128), (i = !0), hl(s, !1), (n.lanes = 4194304));
          }
        else {
          if (!i)
            if (((e = Xi(f)), e !== null)) {
              if (
                ((n.flags |= 128),
                (i = !0),
                (e = e.updateQueue),
                (n.updateQueue = e),
                Wi(n, e),
                hl(s, !0),
                s.tail === null &&
                  s.tailMode === "hidden" &&
                  !f.alternate &&
                  !Me)
              )
                return Fe(n), null;
            } else
              2 * _t() - s.renderingStartTime > nc &&
                a !== 536870912 &&
                ((n.flags |= 128), (i = !0), hl(s, !1), (n.lanes = 4194304));
          s.isBackwards
            ? ((f.sibling = n.child), (n.child = f))
            : ((e = s.last),
              e !== null ? (e.sibling = f) : (n.child = f),
              (s.last = f));
        }
        return s.tail !== null
          ? ((n = s.tail),
            (s.rendering = n),
            (s.tail = n.sibling),
            (s.renderingStartTime = _t()),
            (n.sibling = null),
            (e = pt.current),
            Q(pt, i ? (e & 1) | 2 : e & 1),
            n)
          : (Fe(n), null);
      case 22:
      case 23:
        return (
          Wn(n),
          Eu(),
          (i = n.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== i && (n.flags |= 8192)
            : i && (n.flags |= 8192),
          i
            ? (a & 536870912) !== 0 &&
              (n.flags & 128) === 0 &&
              (Fe(n), n.subtreeFlags & 6 && (n.flags |= 8192))
            : Fe(n),
          (a = n.updateQueue),
          a !== null && Wi(n, a.retryQueue),
          (a = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (a = e.memoizedState.cachePool.pool),
          (i = null),
          n.memoizedState !== null &&
            n.memoizedState.cachePool !== null &&
            (i = n.memoizedState.cachePool.pool),
          i !== a && (n.flags |= 2048),
          e !== null && J(ia),
          null
        );
      case 24:
        return (
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          n.memoizedState.cache !== a && (n.flags |= 2048),
          Fn(mt),
          Fe(n),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(l(156, n.tag));
  }
  function pS(e, n) {
    switch ((uu(n), n.tag)) {
      case 1:
        return (
          (e = n.flags), e & 65536 ? ((n.flags = (e & -65537) | 128), n) : null
        );
      case 3:
        return (
          Fn(mt),
          Ee(),
          (e = n.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((n.flags = (e & -65537) | 128), n)
            : null
        );
      case 26:
      case 27:
      case 5:
        return Ce(n), null;
      case 13:
        if (
          (Wn(n), (e = n.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (n.alternate === null) throw Error(l(340));
          Fo();
        }
        return (
          (e = n.flags), e & 65536 ? ((n.flags = (e & -65537) | 128), n) : null
        );
      case 19:
        return J(pt), null;
      case 4:
        return Ee(), null;
      case 10:
        return Fn(n.type), null;
      case 22:
      case 23:
        return (
          Wn(n),
          Eu(),
          e !== null && J(ia),
          (e = n.flags),
          e & 65536 ? ((n.flags = (e & -65537) | 128), n) : null
        );
      case 24:
        return Fn(mt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Yp(e, n) {
    switch ((uu(n), n.tag)) {
      case 3:
        Fn(mt), Ee();
        break;
      case 26:
      case 27:
      case 5:
        Ce(n);
        break;
      case 4:
        Ee();
        break;
      case 13:
        Wn(n);
        break;
      case 19:
        J(pt);
        break;
      case 10:
        Fn(n.type);
        break;
      case 22:
      case 23:
        Wn(n), Eu(), e !== null && J(ia);
        break;
      case 24:
        Fn(mt);
    }
  }
  function ml(e, n) {
    try {
      var a = n.updateQueue,
        i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            i = void 0;
            var f = a.create,
              b = a.inst;
            (i = f()), (b.destroy = i);
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (S) {
      Ge(n, n.return, S);
    }
  }
  function xr(e, n, a) {
    try {
      var i = n.updateQueue,
        s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var f = s.next;
        i = f;
        do {
          if ((i.tag & e) === e) {
            var b = i.inst,
              S = b.destroy;
            if (S !== void 0) {
              (b.destroy = void 0), (s = n);
              var A = a,
                U = S;
              try {
                U();
              } catch (I) {
                Ge(s, A, I);
              }
            }
          }
          i = i.next;
        } while (i !== f);
      }
    } catch (I) {
      Ge(n, n.return, I);
    }
  }
  function Vp(e) {
    var n = e.updateQueue;
    if (n !== null) {
      var a = e.stateNode;
      try {
        Dm(n, a);
      } catch (i) {
        Ge(e, e.return, i);
      }
    }
  }
  function Ip(e, n, a) {
    (a.props = sa(e.type, e.memoizedProps)), (a.state = e.memoizedState);
    try {
      a.componentWillUnmount();
    } catch (i) {
      Ge(e, n, i);
    }
  }
  function pl(e, n) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var i = e.stateNode;
            break;
          case 30:
            i = e.stateNode;
            break;
          default:
            i = e.stateNode;
        }
        typeof a == "function" ? (e.refCleanup = a(i)) : (a.current = i);
      }
    } catch (s) {
      Ge(e, n, s);
    }
  }
  function jn(e, n) {
    var a = e.ref,
      i = e.refCleanup;
    if (a !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (s) {
          Ge(e, n, s);
        } finally {
          (e.refCleanup = null),
            (e = e.alternate),
            e != null && (e.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (s) {
          Ge(e, n, s);
        }
      else a.current = null;
  }
  function qp(e) {
    var n = e.type,
      a = e.memoizedProps,
      i = e.stateNode;
    try {
      e: switch (n) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && i.focus();
          break e;
        case "img":
          a.src ? (i.src = a.src) : a.srcSet && (i.srcset = a.srcSet);
      }
    } catch (s) {
      Ge(e, e.return, s);
    }
  }
  function Ju(e, n, a) {
    try {
      var i = e.stateNode;
      LS(i, e.type, a, n), (i[Pe] = n);
    } catch (s) {
      Ge(e, e.return, s);
    }
  }
  function Pp(e) {
    return (
      e.tag === 5 ||
      e.tag === 3 ||
      e.tag === 26 ||
      (e.tag === 27 && Tr(e.type)) ||
      e.tag === 4
    );
  }
  function Wu(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || Pp(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

      ) {
        if (
          (e.tag === 27 && Tr(e.type)) ||
          e.flags & 2 ||
          e.child === null ||
          e.tag === 4
        )
          continue e;
        (e.child.return = e), (e = e.child);
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ef(e, n, a) {
    var i = e.tag;
    if (i === 5 || i === 6)
      (e = e.stateNode),
        n
          ? (a.nodeType === 9
              ? a.body
              : a.nodeName === "HTML"
              ? a.ownerDocument.body
              : a
            ).insertBefore(e, n)
          : ((n =
              a.nodeType === 9
                ? a.body
                : a.nodeName === "HTML"
                ? a.ownerDocument.body
                : a),
            n.appendChild(e),
            (a = a._reactRootContainer),
            a != null || n.onclick !== null || (n.onclick = fc));
    else if (
      i !== 4 &&
      (i === 27 && Tr(e.type) && ((a = e.stateNode), (n = null)),
      (e = e.child),
      e !== null)
    )
      for (ef(e, n, a), e = e.sibling; e !== null; )
        ef(e, n, a), (e = e.sibling);
  }
  function ec(e, n, a) {
    var i = e.tag;
    if (i === 5 || i === 6)
      (e = e.stateNode), n ? a.insertBefore(e, n) : a.appendChild(e);
    else if (
      i !== 4 &&
      (i === 27 && Tr(e.type) && (a = e.stateNode), (e = e.child), e !== null)
    )
      for (ec(e, n, a), e = e.sibling; e !== null; )
        ec(e, n, a), (e = e.sibling);
  }
  function Xp(e) {
    var n = e.stateNode,
      a = e.memoizedProps;
    try {
      for (var i = e.type, s = n.attributes; s.length; )
        n.removeAttributeNode(s[0]);
      At(n, i, a), (n[qe] = e), (n[Pe] = a);
    } catch (f) {
      Ge(e, e.return, f);
    }
  }
  var nr = !1,
    ot = !1,
    tf = !1,
    Kp = typeof WeakSet == "function" ? WeakSet : Set,
    xt = null;
  function gS(e, n) {
    if (((e = e.containerInfo), (Rf = yc), (e = lm(e)), Ws(e))) {
      if ("selectionStart" in e)
        var a = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          a = ((a = e.ownerDocument) && a.defaultView) || window;
          var i = a.getSelection && a.getSelection();
          if (i && i.rangeCount !== 0) {
            a = i.anchorNode;
            var s = i.anchorOffset,
              f = i.focusNode;
            i = i.focusOffset;
            try {
              a.nodeType, f.nodeType;
            } catch {
              a = null;
              break e;
            }
            var b = 0,
              S = -1,
              A = -1,
              U = 0,
              I = 0,
              K = e,
              Z = null;
            t: for (;;) {
              for (
                var H;
                K !== a || (s !== 0 && K.nodeType !== 3) || (S = b + s),
                  K !== f || (i !== 0 && K.nodeType !== 3) || (A = b + i),
                  K.nodeType === 3 && (b += K.nodeValue.length),
                  (H = K.firstChild) !== null;

              )
                (Z = K), (K = H);
              for (;;) {
                if (K === e) break t;
                if (
                  (Z === a && ++U === s && (S = b),
                  Z === f && ++I === i && (A = b),
                  (H = K.nextSibling) !== null)
                )
                  break;
                (K = Z), (Z = K.parentNode);
              }
              K = H;
            }
            a = S === -1 || A === -1 ? null : { start: S, end: A };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (
      Af = { focusedElem: e, selectionRange: a }, yc = !1, xt = n;
      xt !== null;

    )
      if (
        ((n = xt), (e = n.child), (n.subtreeFlags & 1024) !== 0 && e !== null)
      )
        (e.return = n), (xt = e);
      else
        for (; xt !== null; ) {
          switch (((n = xt), (f = n.alternate), (e = n.flags), n.tag)) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && f !== null) {
                (e = void 0),
                  (a = n),
                  (s = f.memoizedProps),
                  (f = f.memoizedState),
                  (i = a.stateNode);
                try {
                  var xe = sa(a.type, s, a.elementType === a.type);
                  (e = i.getSnapshotBeforeUpdate(xe, f)),
                    (i.__reactInternalSnapshotBeforeUpdate = e);
                } catch (ve) {
                  Ge(a, a.return, ve);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (
                  ((e = n.stateNode.containerInfo), (a = e.nodeType), a === 9)
                )
                  Of(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Of(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(l(163));
          }
          if (((e = n.sibling), e !== null)) {
            (e.return = n.return), (xt = e);
            break;
          }
          xt = n.return;
        }
  }
  function Qp(e, n, a) {
    var i = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Sr(e, a), i & 4 && ml(5, a);
        break;
      case 1:
        if ((Sr(e, a), i & 4))
          if (((e = a.stateNode), n === null))
            try {
              e.componentDidMount();
            } catch (b) {
              Ge(a, a.return, b);
            }
          else {
            var s = sa(a.type, n.memoizedProps);
            n = n.memoizedState;
            try {
              e.componentDidUpdate(s, n, e.__reactInternalSnapshotBeforeUpdate);
            } catch (b) {
              Ge(a, a.return, b);
            }
          }
        i & 64 && Vp(a), i & 512 && pl(a, a.return);
        break;
      case 3:
        if ((Sr(e, a), i & 64 && ((e = a.updateQueue), e !== null))) {
          if (((n = null), a.child !== null))
            switch (a.child.tag) {
              case 27:
              case 5:
                n = a.child.stateNode;
                break;
              case 1:
                n = a.child.stateNode;
            }
          try {
            Dm(e, n);
          } catch (b) {
            Ge(a, a.return, b);
          }
        }
        break;
      case 27:
        n === null && i & 4 && Xp(a);
      case 26:
      case 5:
        Sr(e, a), n === null && i & 4 && qp(a), i & 512 && pl(a, a.return);
        break;
      case 12:
        Sr(e, a);
        break;
      case 13:
        Sr(e, a),
          i & 4 && Wp(e, a),
          i & 64 &&
            ((e = a.memoizedState),
            e !== null &&
              ((e = e.dehydrated),
              e !== null && ((a = CS.bind(null, a)), YS(e, a))));
        break;
      case 22:
        if (((i = a.memoizedState !== null || nr), !i)) {
          (n = (n !== null && n.memoizedState !== null) || ot), (s = nr);
          var f = ot;
          (nr = i),
            (ot = n) && !f ? wr(e, a, (a.subtreeFlags & 8772) !== 0) : Sr(e, a),
            (nr = s),
            (ot = f);
        }
        break;
      case 30:
        break;
      default:
        Sr(e, a);
    }
  }
  function Fp(e) {
    var n = e.alternate;
    n !== null && ((e.alternate = null), Fp(n)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((n = e.stateNode), n !== null && Ms(n)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null);
  }
  var Xe = null,
    Ht = !1;
  function rr(e, n, a) {
    for (a = a.child; a !== null; ) Jp(e, n, a), (a = a.sibling);
  }
  function Jp(e, n, a) {
    if (ct && typeof ct.onCommitFiberUnmount == "function")
      try {
        ct.onCommitFiberUnmount(qr, a);
      } catch {}
    switch (a.tag) {
      case 26:
        ot || jn(a, n),
          rr(e, n, a),
          a.memoizedState
            ? a.memoizedState.count--
            : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a));
        break;
      case 27:
        ot || jn(a, n);
        var i = Xe,
          s = Ht;
        Tr(a.type) && ((Xe = a.stateNode), (Ht = !1)),
          rr(e, n, a),
          El(a.stateNode),
          (Xe = i),
          (Ht = s);
        break;
      case 5:
        ot || jn(a, n);
      case 6:
        if (
          ((i = Xe),
          (s = Ht),
          (Xe = null),
          rr(e, n, a),
          (Xe = i),
          (Ht = s),
          Xe !== null)
        )
          if (Ht)
            try {
              (Xe.nodeType === 9
                ? Xe.body
                : Xe.nodeName === "HTML"
                ? Xe.ownerDocument.body
                : Xe
              ).removeChild(a.stateNode);
            } catch (f) {
              Ge(a, n, f);
            }
          else
            try {
              Xe.removeChild(a.stateNode);
            } catch (f) {
              Ge(a, n, f);
            }
        break;
      case 18:
        Xe !== null &&
          (Ht
            ? ((e = Xe),
              Hg(
                e.nodeType === 9
                  ? e.body
                  : e.nodeName === "HTML"
                  ? e.ownerDocument.body
                  : e,
                a.stateNode
              ),
              jl(e))
            : Hg(Xe, a.stateNode));
        break;
      case 4:
        (i = Xe),
          (s = Ht),
          (Xe = a.stateNode.containerInfo),
          (Ht = !0),
          rr(e, n, a),
          (Xe = i),
          (Ht = s);
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ot || xr(2, a, n), ot || xr(4, a, n), rr(e, n, a);
        break;
      case 1:
        ot ||
          (jn(a, n),
          (i = a.stateNode),
          typeof i.componentWillUnmount == "function" && Ip(a, n, i)),
          rr(e, n, a);
        break;
      case 21:
        rr(e, n, a);
        break;
      case 22:
        (ot = (i = ot) || a.memoizedState !== null), rr(e, n, a), (ot = i);
        break;
      default:
        rr(e, n, a);
    }
  }
  function Wp(e, n) {
    if (
      n.memoizedState === null &&
      ((e = n.alternate),
      e !== null &&
        ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        jl(e);
      } catch (a) {
        Ge(n, n.return, a);
      }
  }
  function vS(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var n = e.stateNode;
        return n === null && (n = e.stateNode = new Kp()), n;
      case 22:
        return (
          (e = e.stateNode),
          (n = e._retryCache),
          n === null && (n = e._retryCache = new Kp()),
          n
        );
      default:
        throw Error(l(435, e.tag));
    }
  }
  function nf(e, n) {
    var a = vS(e);
    n.forEach(function (i) {
      var s = RS.bind(null, e, i);
      a.has(i) || (a.add(i), i.then(s, s));
    });
  }
  function Pt(e, n) {
    var a = n.deletions;
    if (a !== null)
      for (var i = 0; i < a.length; i++) {
        var s = a[i],
          f = e,
          b = n,
          S = b;
        e: for (; S !== null; ) {
          switch (S.tag) {
            case 27:
              if (Tr(S.type)) {
                (Xe = S.stateNode), (Ht = !1);
                break e;
              }
              break;
            case 5:
              (Xe = S.stateNode), (Ht = !1);
              break e;
            case 3:
            case 4:
              (Xe = S.stateNode.containerInfo), (Ht = !0);
              break e;
          }
          S = S.return;
        }
        if (Xe === null) throw Error(l(160));
        Jp(f, b, s),
          (Xe = null),
          (Ht = !1),
          (f = s.alternate),
          f !== null && (f.return = null),
          (s.return = null);
      }
    if (n.subtreeFlags & 13878)
      for (n = n.child; n !== null; ) eg(n, e), (n = n.sibling);
  }
  var Sn = null;
  function eg(e, n) {
    var a = e.alternate,
      i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Pt(n, e),
          Xt(e),
          i & 4 && (xr(3, e, e.return), ml(3, e), xr(5, e, e.return));
        break;
      case 1:
        Pt(n, e),
          Xt(e),
          i & 512 && (ot || a === null || jn(a, a.return)),
          i & 64 &&
            nr &&
            ((e = e.updateQueue),
            e !== null &&
              ((i = e.callbacks),
              i !== null &&
                ((a = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = a === null ? i : a.concat(i)))));
        break;
      case 26:
        var s = Sn;
        if (
          (Pt(n, e),
          Xt(e),
          i & 512 && (ot || a === null || jn(a, a.return)),
          i & 4)
        ) {
          var f = a !== null ? a.memoizedState : null;
          if (((i = e.memoizedState), a === null))
            if (i === null)
              if (e.stateNode === null) {
                e: {
                  (i = e.type),
                    (a = e.memoizedProps),
                    (s = s.ownerDocument || s);
                  t: switch (i) {
                    case "title":
                      (f = s.getElementsByTagName("title")[0]),
                        (!f ||
                          f[Vn] ||
                          f[qe] ||
                          f.namespaceURI === "http://www.w3.org/2000/svg" ||
                          f.hasAttribute("itemprop")) &&
                          ((f = s.createElement(i)),
                          s.head.insertBefore(
                            f,
                            s.querySelector("head > title")
                          )),
                        At(f, i, a),
                        (f[qe] = e),
                        yt(f),
                        (i = f);
                      break e;
                    case "link":
                      var b = Xg("link", "href", s).get(i + (a.href || ""));
                      if (b) {
                        for (var S = 0; S < b.length; S++)
                          if (
                            ((f = b[S]),
                            f.getAttribute("href") ===
                              (a.href == null || a.href === ""
                                ? null
                                : a.href) &&
                              f.getAttribute("rel") ===
                                (a.rel == null ? null : a.rel) &&
                              f.getAttribute("title") ===
                                (a.title == null ? null : a.title) &&
                              f.getAttribute("crossorigin") ===
                                (a.crossOrigin == null ? null : a.crossOrigin))
                          ) {
                            b.splice(S, 1);
                            break t;
                          }
                      }
                      (f = s.createElement(i)),
                        At(f, i, a),
                        s.head.appendChild(f);
                      break;
                    case "meta":
                      if (
                        (b = Xg("meta", "content", s).get(
                          i + (a.content || "")
                        ))
                      ) {
                        for (S = 0; S < b.length; S++)
                          if (
                            ((f = b[S]),
                            f.getAttribute("content") ===
                              (a.content == null ? null : "" + a.content) &&
                              f.getAttribute("name") ===
                                (a.name == null ? null : a.name) &&
                              f.getAttribute("property") ===
                                (a.property == null ? null : a.property) &&
                              f.getAttribute("http-equiv") ===
                                (a.httpEquiv == null ? null : a.httpEquiv) &&
                              f.getAttribute("charset") ===
                                (a.charSet == null ? null : a.charSet))
                          ) {
                            b.splice(S, 1);
                            break t;
                          }
                      }
                      (f = s.createElement(i)),
                        At(f, i, a),
                        s.head.appendChild(f);
                      break;
                    default:
                      throw Error(l(468, i));
                  }
                  (f[qe] = e), yt(f), (i = f);
                }
                e.stateNode = i;
              } else Kg(s, e.type, e.stateNode);
            else e.stateNode = Pg(s, i, e.memoizedProps);
          else
            f !== i
              ? (f === null
                  ? a.stateNode !== null &&
                    ((a = a.stateNode), a.parentNode.removeChild(a))
                  : f.count--,
                i === null
                  ? Kg(s, e.type, e.stateNode)
                  : Pg(s, i, e.memoizedProps))
              : i === null &&
                e.stateNode !== null &&
                Ju(e, e.memoizedProps, a.memoizedProps);
        }
        break;
      case 27:
        Pt(n, e),
          Xt(e),
          i & 512 && (ot || a === null || jn(a, a.return)),
          a !== null && i & 4 && Ju(e, e.memoizedProps, a.memoizedProps);
        break;
      case 5:
        if (
          (Pt(n, e),
          Xt(e),
          i & 512 && (ot || a === null || jn(a, a.return)),
          e.flags & 32)
        ) {
          s = e.stateNode;
          try {
            Ma(s, "");
          } catch (H) {
            Ge(e, e.return, H);
          }
        }
        i & 4 &&
          e.stateNode != null &&
          ((s = e.memoizedProps), Ju(e, s, a !== null ? a.memoizedProps : s)),
          i & 1024 && (tf = !0);
        break;
      case 6:
        if ((Pt(n, e), Xt(e), i & 4)) {
          if (e.stateNode === null) throw Error(l(162));
          (i = e.memoizedProps), (a = e.stateNode);
          try {
            a.nodeValue = i;
          } catch (H) {
            Ge(e, e.return, H);
          }
        }
        break;
      case 3:
        if (
          ((pc = null),
          (s = Sn),
          (Sn = hc(n.containerInfo)),
          Pt(n, e),
          (Sn = s),
          Xt(e),
          i & 4 && a !== null && a.memoizedState.isDehydrated)
        )
          try {
            jl(n.containerInfo);
          } catch (H) {
            Ge(e, e.return, H);
          }
        tf && ((tf = !1), tg(e));
        break;
      case 4:
        (i = Sn),
          (Sn = hc(e.stateNode.containerInfo)),
          Pt(n, e),
          Xt(e),
          (Sn = i);
        break;
      case 12:
        Pt(n, e), Xt(e);
        break;
      case 13:
        Pt(n, e),
          Xt(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) !=
              (a !== null && a.memoizedState !== null) &&
            (sf = _t()),
          i & 4 &&
            ((i = e.updateQueue),
            i !== null && ((e.updateQueue = null), nf(e, i)));
        break;
      case 22:
        s = e.memoizedState !== null;
        var A = a !== null && a.memoizedState !== null,
          U = nr,
          I = ot;
        if (
          ((nr = U || s),
          (ot = I || A),
          Pt(n, e),
          (ot = I),
          (nr = U),
          Xt(e),
          i & 8192)
        )
          e: for (
            n = e.stateNode,
              n._visibility = s ? n._visibility & -2 : n._visibility | 1,
              s && (a === null || A || nr || ot || ua(e)),
              a = null,
              n = e;
            ;

          ) {
            if (n.tag === 5 || n.tag === 26) {
              if (a === null) {
                A = a = n;
                try {
                  if (((f = A.stateNode), s))
                    (b = f.style),
                      typeof b.setProperty == "function"
                        ? b.setProperty("display", "none", "important")
                        : (b.display = "none");
                  else {
                    S = A.stateNode;
                    var K = A.memoizedProps.style,
                      Z =
                        K != null && K.hasOwnProperty("display")
                          ? K.display
                          : null;
                    S.style.display =
                      Z == null || typeof Z == "boolean" ? "" : ("" + Z).trim();
                  }
                } catch (H) {
                  Ge(A, A.return, H);
                }
              }
            } else if (n.tag === 6) {
              if (a === null) {
                A = n;
                try {
                  A.stateNode.nodeValue = s ? "" : A.memoizedProps;
                } catch (H) {
                  Ge(A, A.return, H);
                }
              }
            } else if (
              ((n.tag !== 22 && n.tag !== 23) ||
                n.memoizedState === null ||
                n === e) &&
              n.child !== null
            ) {
              (n.child.return = n), (n = n.child);
              continue;
            }
            if (n === e) break e;
            for (; n.sibling === null; ) {
              if (n.return === null || n.return === e) break e;
              a === n && (a = null), (n = n.return);
            }
            a === n && (a = null),
              (n.sibling.return = n.return),
              (n = n.sibling);
          }
        i & 4 &&
          ((i = e.updateQueue),
          i !== null &&
            ((a = i.retryQueue),
            a !== null && ((i.retryQueue = null), nf(e, a))));
        break;
      case 19:
        Pt(n, e),
          Xt(e),
          i & 4 &&
            ((i = e.updateQueue),
            i !== null && ((e.updateQueue = null), nf(e, i)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Pt(n, e), Xt(e);
    }
  }
  function Xt(e) {
    var n = e.flags;
    if (n & 2) {
      try {
        for (var a, i = e.return; i !== null; ) {
          if (Pp(i)) {
            a = i;
            break;
          }
          i = i.return;
        }
        if (a == null) throw Error(l(160));
        switch (a.tag) {
          case 27:
            var s = a.stateNode,
              f = Wu(e);
            ec(e, f, s);
            break;
          case 5:
            var b = a.stateNode;
            a.flags & 32 && (Ma(b, ""), (a.flags &= -33));
            var S = Wu(e);
            ec(e, S, b);
            break;
          case 3:
          case 4:
            var A = a.stateNode.containerInfo,
              U = Wu(e);
            ef(e, U, A);
            break;
          default:
            throw Error(l(161));
        }
      } catch (I) {
        Ge(e, e.return, I);
      }
      e.flags &= -3;
    }
    n & 4096 && (e.flags &= -4097);
  }
  function tg(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var n = e;
        tg(n),
          n.tag === 5 && n.flags & 1024 && n.stateNode.reset(),
          (e = e.sibling);
      }
  }
  function Sr(e, n) {
    if (n.subtreeFlags & 8772)
      for (n = n.child; n !== null; ) Qp(e, n.alternate, n), (n = n.sibling);
  }
  function ua(e) {
    for (e = e.child; e !== null; ) {
      var n = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          xr(4, n, n.return), ua(n);
          break;
        case 1:
          jn(n, n.return);
          var a = n.stateNode;
          typeof a.componentWillUnmount == "function" && Ip(n, n.return, a),
            ua(n);
          break;
        case 27:
          El(n.stateNode);
        case 26:
        case 5:
          jn(n, n.return), ua(n);
          break;
        case 22:
          n.memoizedState === null && ua(n);
          break;
        case 30:
          ua(n);
          break;
        default:
          ua(n);
      }
      e = e.sibling;
    }
  }
  function wr(e, n, a) {
    for (a = a && (n.subtreeFlags & 8772) !== 0, n = n.child; n !== null; ) {
      var i = n.alternate,
        s = e,
        f = n,
        b = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          wr(s, f, a), ml(4, f);
          break;
        case 1:
          if (
            (wr(s, f, a),
            (i = f),
            (s = i.stateNode),
            typeof s.componentDidMount == "function")
          )
            try {
              s.componentDidMount();
            } catch (U) {
              Ge(i, i.return, U);
            }
          if (((i = f), (s = i.updateQueue), s !== null)) {
            var S = i.stateNode;
            try {
              var A = s.shared.hiddenCallbacks;
              if (A !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < A.length; s++)
                  Om(A[s], S);
            } catch (U) {
              Ge(i, i.return, U);
            }
          }
          a && b & 64 && Vp(f), pl(f, f.return);
          break;
        case 27:
          Xp(f);
        case 26:
        case 5:
          wr(s, f, a), a && i === null && b & 4 && qp(f), pl(f, f.return);
          break;
        case 12:
          wr(s, f, a);
          break;
        case 13:
          wr(s, f, a), a && b & 4 && Wp(s, f);
          break;
        case 22:
          f.memoizedState === null && wr(s, f, a), pl(f, f.return);
          break;
        case 30:
          break;
        default:
          wr(s, f, a);
      }
      n = n.sibling;
    }
  }
  function rf(e, n) {
    var a = null;
    e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (a = e.memoizedState.cachePool.pool),
      (e = null),
      n.memoizedState !== null &&
        n.memoizedState.cachePool !== null &&
        (e = n.memoizedState.cachePool.pool),
      e !== a && (e != null && e.refCount++, a != null && el(a));
  }
  function af(e, n) {
    (e = null),
      n.alternate !== null && (e = n.alternate.memoizedState.cache),
      (n = n.memoizedState.cache),
      n !== e && (n.refCount++, e != null && el(e));
  }
  function zn(e, n, a, i) {
    if (n.subtreeFlags & 10256)
      for (n = n.child; n !== null; ) ng(e, n, a, i), (n = n.sibling);
  }
  function ng(e, n, a, i) {
    var s = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        zn(e, n, a, i), s & 2048 && ml(9, n);
        break;
      case 1:
        zn(e, n, a, i);
        break;
      case 3:
        zn(e, n, a, i),
          s & 2048 &&
            ((e = null),
            n.alternate !== null && (e = n.alternate.memoizedState.cache),
            (n = n.memoizedState.cache),
            n !== e && (n.refCount++, e != null && el(e)));
        break;
      case 12:
        if (s & 2048) {
          zn(e, n, a, i), (e = n.stateNode);
          try {
            var f = n.memoizedProps,
              b = f.id,
              S = f.onPostCommit;
            typeof S == "function" &&
              S(
                b,
                n.alternate === null ? "mount" : "update",
                e.passiveEffectDuration,
                -0
              );
          } catch (A) {
            Ge(n, n.return, A);
          }
        } else zn(e, n, a, i);
        break;
      case 13:
        zn(e, n, a, i);
        break;
      case 23:
        break;
      case 22:
        (f = n.stateNode),
          (b = n.alternate),
          n.memoizedState !== null
            ? f._visibility & 2
              ? zn(e, n, a, i)
              : gl(e, n)
            : f._visibility & 2
            ? zn(e, n, a, i)
            : ((f._visibility |= 2),
              Wa(e, n, a, i, (n.subtreeFlags & 10256) !== 0)),
          s & 2048 && rf(b, n);
        break;
      case 24:
        zn(e, n, a, i), s & 2048 && af(n.alternate, n);
        break;
      default:
        zn(e, n, a, i);
    }
  }
  function Wa(e, n, a, i, s) {
    for (s = s && (n.subtreeFlags & 10256) !== 0, n = n.child; n !== null; ) {
      var f = e,
        b = n,
        S = a,
        A = i,
        U = b.flags;
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          Wa(f, b, S, A, s), ml(8, b);
          break;
        case 23:
          break;
        case 22:
          var I = b.stateNode;
          b.memoizedState !== null
            ? I._visibility & 2
              ? Wa(f, b, S, A, s)
              : gl(f, b)
            : ((I._visibility |= 2), Wa(f, b, S, A, s)),
            s && U & 2048 && rf(b.alternate, b);
          break;
        case 24:
          Wa(f, b, S, A, s), s && U & 2048 && af(b.alternate, b);
          break;
        default:
          Wa(f, b, S, A, s);
      }
      n = n.sibling;
    }
  }
  function gl(e, n) {
    if (n.subtreeFlags & 10256)
      for (n = n.child; n !== null; ) {
        var a = e,
          i = n,
          s = i.flags;
        switch (i.tag) {
          case 22:
            gl(a, i), s & 2048 && rf(i.alternate, i);
            break;
          case 24:
            gl(a, i), s & 2048 && af(i.alternate, i);
            break;
          default:
            gl(a, i);
        }
        n = n.sibling;
      }
  }
  var vl = 8192;
  function eo(e) {
    if (e.subtreeFlags & vl)
      for (e = e.child; e !== null; ) rg(e), (e = e.sibling);
  }
  function rg(e) {
    switch (e.tag) {
      case 26:
        eo(e),
          e.flags & vl &&
            e.memoizedState !== null &&
            nw(Sn, e.memoizedState, e.memoizedProps);
        break;
      case 5:
        eo(e);
        break;
      case 3:
      case 4:
        var n = Sn;
        (Sn = hc(e.stateNode.containerInfo)), eo(e), (Sn = n);
        break;
      case 22:
        e.memoizedState === null &&
          ((n = e.alternate),
          n !== null && n.memoizedState !== null
            ? ((n = vl), (vl = 16777216), eo(e), (vl = n))
            : eo(e));
        break;
      default:
        eo(e);
    }
  }
  function ag(e) {
    var n = e.alternate;
    if (n !== null && ((e = n.child), e !== null)) {
      n.child = null;
      do (n = e.sibling), (e.sibling = null), (e = n);
      while (e !== null);
    }
  }
  function yl(e) {
    var n = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (n !== null)
        for (var a = 0; a < n.length; a++) {
          var i = n[a];
          (xt = i), lg(i, e);
        }
      ag(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) og(e), (e = e.sibling);
  }
  function og(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        yl(e), e.flags & 2048 && xr(9, e, e.return);
        break;
      case 3:
        yl(e);
        break;
      case 12:
        yl(e);
        break;
      case 22:
        var n = e.stateNode;
        e.memoizedState !== null &&
        n._visibility & 2 &&
        (e.return === null || e.return.tag !== 13)
          ? ((n._visibility &= -3), tc(e))
          : yl(e);
        break;
      default:
        yl(e);
    }
  }
  function tc(e) {
    var n = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (n !== null)
        for (var a = 0; a < n.length; a++) {
          var i = n[a];
          (xt = i), lg(i, e);
        }
      ag(e);
    }
    for (e = e.child; e !== null; ) {
      switch (((n = e), n.tag)) {
        case 0:
        case 11:
        case 15:
          xr(8, n, n.return), tc(n);
          break;
        case 22:
          (a = n.stateNode),
            a._visibility & 2 && ((a._visibility &= -3), tc(n));
          break;
        default:
          tc(n);
      }
      e = e.sibling;
    }
  }
  function lg(e, n) {
    for (; xt !== null; ) {
      var a = xt;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          xr(8, a, n);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var i = a.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          el(a.memoizedState.cache);
      }
      if (((i = a.child), i !== null)) (i.return = a), (xt = i);
      else
        e: for (a = e; xt !== null; ) {
          i = xt;
          var s = i.sibling,
            f = i.return;
          if ((Fp(i), i === a)) {
            xt = null;
            break e;
          }
          if (s !== null) {
            (s.return = f), (xt = s);
            break e;
          }
          xt = f;
        }
    }
  }
  var yS = {
      getCacheForType: function (e) {
        var n = jt(mt),
          a = n.data.get(e);
        return a === void 0 && ((a = e()), n.data.set(e, a)), a;
      },
    },
    bS = typeof WeakMap == "function" ? WeakMap : Map,
    Le = 0,
    Ve = null,
    Ne = null,
    je = 0,
    Ue = 0,
    Kt = null,
    _r = !1,
    to = !1,
    of = !1,
    ar = 0,
    tt = 0,
    Er = 0,
    fa = 0,
    lf = 0,
    dn = 0,
    no = 0,
    bl = null,
    $t = null,
    cf = !1,
    sf = 0,
    nc = 1 / 0,
    rc = null,
    Cr = null,
    Rt = 0,
    Rr = null,
    ro = null,
    ao = 0,
    uf = 0,
    ff = null,
    ig = null,
    xl = 0,
    df = null;
  function Qt() {
    if ((Le & 2) !== 0 && je !== 0) return je & -je;
    if (z.T !== null) {
      var e = Ia;
      return e !== 0 ? e : bf();
    }
    return Vt();
  }
  function cg() {
    dn === 0 && (dn = (je & 536870912) === 0 || Me ? hi() : 536870912);
    var e = fn.current;
    return e !== null && (e.flags |= 32), dn;
  }
  function Ft(e, n, a) {
    ((e === Ve && (Ue === 2 || Ue === 9)) || e.cancelPendingCommit !== null) &&
      (oo(e, 0), Ar(e, je, dn, !1)),
      We(e, a),
      ((Le & 2) === 0 || e !== Ve) &&
        (e === Ve &&
          ((Le & 2) === 0 && (fa |= a), tt === 4 && Ar(e, je, dn, !1)),
        Mn(e));
  }
  function sg(e, n, a) {
    if ((Le & 6) !== 0) throw Error(l(327));
    var i = (!a && (n & 124) === 0 && (n & e.expiredLanes) === 0) || Xr(e, n),
      s = i ? wS(e, n) : pf(e, n, !0),
      f = i;
    do {
      if (s === 0) {
        to && !i && Ar(e, n, 0, !1);
        break;
      } else {
        if (((a = e.current.alternate), f && !xS(a))) {
          (s = pf(e, n, !1)), (f = !1);
          continue;
        }
        if (s === 2) {
          if (((f = n), e.errorRecoveryDisabledLanes & f)) var b = 0;
          else
            (b = e.pendingLanes & -536870913),
              (b = b !== 0 ? b : b & 536870912 ? 536870912 : 0);
          if (b !== 0) {
            n = b;
            e: {
              var S = e;
              s = bl;
              var A = S.current.memoizedState.isDehydrated;
              if ((A && (oo(S, b).flags |= 256), (b = pf(S, b, !1)), b !== 2)) {
                if (of && !A) {
                  (S.errorRecoveryDisabledLanes |= f), (fa |= f), (s = 4);
                  break e;
                }
                (f = $t),
                  ($t = s),
                  f !== null && ($t === null ? ($t = f) : $t.push.apply($t, f));
              }
              s = b;
            }
            if (((f = !1), s !== 2)) continue;
          }
        }
        if (s === 1) {
          oo(e, 0), Ar(e, n, 0, !0);
          break;
        }
        e: {
          switch (((i = e), (f = s), f)) {
            case 0:
            case 1:
              throw Error(l(345));
            case 4:
              if ((n & 4194048) !== n) break;
            case 6:
              Ar(i, n, dn, !_r);
              break e;
            case 2:
              $t = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(l(329));
          }
          if ((n & 62914560) === n && ((s = sf + 300 - _t()), 10 < s)) {
            if ((Ar(i, n, dn, !_r), Pr(i, 0, !0) !== 0)) break e;
            i.timeoutHandle = Bg(
              ug.bind(null, i, a, $t, rc, cf, n, dn, fa, no, _r, f, 2, -0, 0),
              s
            );
            break e;
          }
          ug(i, a, $t, rc, cf, n, dn, fa, no, _r, f, 0, -0, 0);
        }
      }
      break;
    } while (!0);
    Mn(e);
  }
  function ug(e, n, a, i, s, f, b, S, A, U, I, K, Z, H) {
    if (
      ((e.timeoutHandle = -1),
      (K = n.subtreeFlags),
      (K & 8192 || (K & 16785408) === 16785408) &&
        ((Al = { stylesheets: null, count: 0, unsuspend: tw }),
        rg(n),
        (K = rw()),
        K !== null))
    ) {
      (e.cancelPendingCommit = K(
        vg.bind(null, e, n, f, a, i, s, b, S, A, I, 1, Z, H)
      )),
        Ar(e, f, b, !U);
      return;
    }
    vg(e, n, f, a, i, s, b, S, A);
  }
  function xS(e) {
    for (var n = e; ; ) {
      var a = n.tag;
      if (
        (a === 0 || a === 11 || a === 15) &&
        n.flags & 16384 &&
        ((a = n.updateQueue), a !== null && ((a = a.stores), a !== null))
      )
        for (var i = 0; i < a.length; i++) {
          var s = a[i],
            f = s.getSnapshot;
          s = s.value;
          try {
            if (!It(f(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (((a = n.child), n.subtreeFlags & 16384 && a !== null))
        (a.return = n), (n = a);
      else {
        if (n === e) break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === e) return !0;
          n = n.return;
        }
        (n.sibling.return = n.return), (n = n.sibling);
      }
    }
    return !0;
  }
  function Ar(e, n, a, i) {
    (n &= ~lf),
      (n &= ~fa),
      (e.suspendedLanes |= n),
      (e.pingedLanes &= ~n),
      i && (e.warmLanes |= n),
      (i = e.expirationTimes);
    for (var s = n; 0 < s; ) {
      var f = 31 - ht(s),
        b = 1 << f;
      (i[f] = -1), (s &= ~b);
    }
    a !== 0 && Nt(e, a, n);
  }
  function ac() {
    return (Le & 6) === 0 ? (Sl(0), !1) : !0;
  }
  function hf() {
    if (Ne !== null) {
      if (Ue === 0) var e = Ne.return;
      else (e = Ne), (Qn = oa = null), Nu(e), (Fa = null), (fl = 0), (e = Ne);
      for (; e !== null; ) Yp(e.alternate, e), (e = e.return);
      Ne = null;
    }
  }
  function oo(e, n) {
    var a = e.timeoutHandle;
    a !== -1 && ((e.timeoutHandle = -1), BS(a)),
      (a = e.cancelPendingCommit),
      a !== null && ((e.cancelPendingCommit = null), a()),
      hf(),
      (Ve = e),
      (Ne = a = Pn(e.current, null)),
      (je = n),
      (Ue = 0),
      (Kt = null),
      (_r = !1),
      (to = Xr(e, n)),
      (of = !1),
      (no = dn = lf = fa = Er = tt = 0),
      ($t = bl = null),
      (cf = !1),
      (n & 8) !== 0 && (n |= n & 32);
    var i = e.entangledLanes;
    if (i !== 0)
      for (e = e.entanglements, i &= n; 0 < i; ) {
        var s = 31 - ht(i),
          f = 1 << s;
        (n |= e[s]), (i &= ~f);
      }
    return (ar = n), Ri(), a;
  }
  function fg(e, n) {
    (Re = null),
      (z.H = Ii),
      n === nl || n === ki
        ? ((n = Tm()), (Ue = 3))
        : n === Cm
        ? ((n = Tm()), (Ue = 4))
        : (Ue =
            n === Np
              ? 8
              : n !== null &&
                typeof n == "object" &&
                typeof n.then == "function"
              ? 6
              : 1),
      (Kt = n),
      Ne === null && ((tt = 1), Qi(e, ln(n, e.current)));
  }
  function dg() {
    var e = z.H;
    return (z.H = Ii), e === null ? Ii : e;
  }
  function hg() {
    var e = z.A;
    return (z.A = yS), e;
  }
  function mf() {
    (tt = 4),
      _r || ((je & 4194048) !== je && fn.current !== null) || (to = !0),
      ((Er & 134217727) === 0 && (fa & 134217727) === 0) ||
        Ve === null ||
        Ar(Ve, je, dn, !1);
  }
  function pf(e, n, a) {
    var i = Le;
    Le |= 2;
    var s = dg(),
      f = hg();
    (Ve !== e || je !== n) && ((rc = null), oo(e, n)), (n = !1);
    var b = tt;
    e: do
      try {
        if (Ue !== 0 && Ne !== null) {
          var S = Ne,
            A = Kt;
          switch (Ue) {
            case 8:
              hf(), (b = 6);
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              fn.current === null && (n = !0);
              var U = Ue;
              if (((Ue = 0), (Kt = null), lo(e, S, A, U), a && to)) {
                b = 0;
                break e;
              }
              break;
            default:
              (U = Ue), (Ue = 0), (Kt = null), lo(e, S, A, U);
          }
        }
        SS(), (b = tt);
        break;
      } catch (I) {
        fg(e, I);
      }
    while (!0);
    return (
      n && e.shellSuspendCounter++,
      (Qn = oa = null),
      (Le = i),
      (z.H = s),
      (z.A = f),
      Ne === null && ((Ve = null), (je = 0), Ri()),
      b
    );
  }
  function SS() {
    for (; Ne !== null; ) mg(Ne);
  }
  function wS(e, n) {
    var a = Le;
    Le |= 2;
    var i = dg(),
      s = hg();
    Ve !== e || je !== n
      ? ((rc = null), (nc = _t() + 500), oo(e, n))
      : (to = Xr(e, n));
    e: do
      try {
        if (Ue !== 0 && Ne !== null) {
          n = Ne;
          var f = Kt;
          t: switch (Ue) {
            case 1:
              (Ue = 0), (Kt = null), lo(e, n, f, 1);
              break;
            case 2:
            case 9:
              if (Rm(f)) {
                (Ue = 0), (Kt = null), pg(n);
                break;
              }
              (n = function () {
                (Ue !== 2 && Ue !== 9) || Ve !== e || (Ue = 7), Mn(e);
              }),
                f.then(n, n);
              break e;
            case 3:
              Ue = 7;
              break e;
            case 4:
              Ue = 5;
              break e;
            case 7:
              Rm(f)
                ? ((Ue = 0), (Kt = null), pg(n))
                : ((Ue = 0), (Kt = null), lo(e, n, f, 7));
              break;
            case 5:
              var b = null;
              switch (Ne.tag) {
                case 26:
                  b = Ne.memoizedState;
                case 5:
                case 27:
                  var S = Ne;
                  if (!b || Qg(b)) {
                    (Ue = 0), (Kt = null);
                    var A = S.sibling;
                    if (A !== null) Ne = A;
                    else {
                      var U = S.return;
                      U !== null ? ((Ne = U), oc(U)) : (Ne = null);
                    }
                    break t;
                  }
              }
              (Ue = 0), (Kt = null), lo(e, n, f, 5);
              break;
            case 6:
              (Ue = 0), (Kt = null), lo(e, n, f, 6);
              break;
            case 8:
              hf(), (tt = 6);
              break e;
            default:
              throw Error(l(462));
          }
        }
        _S();
        break;
      } catch (I) {
        fg(e, I);
      }
    while (!0);
    return (
      (Qn = oa = null),
      (z.H = i),
      (z.A = s),
      (Le = a),
      Ne !== null ? 0 : ((Ve = null), (je = 0), Ri(), tt)
    );
  }
  function _S() {
    for (; Ne !== null && !nn(); ) mg(Ne);
  }
  function mg(e) {
    var n = $p(e.alternate, e, ar);
    (e.memoizedProps = e.pendingProps), n === null ? oc(e) : (Ne = n);
  }
  function pg(e) {
    var n = e,
      a = n.alternate;
    switch (n.tag) {
      case 15:
      case 0:
        n = kp(a, n, n.pendingProps, n.type, void 0, je);
        break;
      case 11:
        n = kp(a, n, n.pendingProps, n.type.render, n.ref, je);
        break;
      case 5:
        Nu(n);
      default:
        Yp(a, n), (n = Ne = gm(n, ar)), (n = $p(a, n, ar));
    }
    (e.memoizedProps = e.pendingProps), n === null ? oc(e) : (Ne = n);
  }
  function lo(e, n, a, i) {
    (Qn = oa = null), Nu(n), (Fa = null), (fl = 0);
    var s = n.return;
    try {
      if (dS(e, s, n, a, je)) {
        (tt = 1), Qi(e, ln(a, e.current)), (Ne = null);
        return;
      }
    } catch (f) {
      if (s !== null) throw ((Ne = s), f);
      (tt = 1), Qi(e, ln(a, e.current)), (Ne = null);
      return;
    }
    n.flags & 32768
      ? (Me || i === 1
          ? (e = !0)
          : to || (je & 536870912) !== 0
          ? (e = !1)
          : ((_r = e = !0),
            (i === 2 || i === 9 || i === 3 || i === 6) &&
              ((i = fn.current),
              i !== null && i.tag === 13 && (i.flags |= 16384))),
        gg(n, e))
      : oc(n);
  }
  function oc(e) {
    var n = e;
    do {
      if ((n.flags & 32768) !== 0) {
        gg(n, _r);
        return;
      }
      e = n.return;
      var a = mS(n.alternate, n, ar);
      if (a !== null) {
        Ne = a;
        return;
      }
      if (((n = n.sibling), n !== null)) {
        Ne = n;
        return;
      }
      Ne = n = e;
    } while (n !== null);
    tt === 0 && (tt = 5);
  }
  function gg(e, n) {
    do {
      var a = pS(e.alternate, e);
      if (a !== null) {
        (a.flags &= 32767), (Ne = a);
        return;
      }
      if (
        ((a = e.return),
        a !== null &&
          ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
        !n && ((e = e.sibling), e !== null))
      ) {
        Ne = e;
        return;
      }
      Ne = e = a;
    } while (e !== null);
    (tt = 6), (Ne = null);
  }
  function vg(e, n, a, i, s, f, b, S, A) {
    e.cancelPendingCommit = null;
    do lc();
    while (Rt !== 0);
    if ((Le & 6) !== 0) throw Error(l(327));
    if (n !== null) {
      if (n === e.current) throw Error(l(177));
      if (
        ((f = n.lanes | n.childLanes),
        (f |= au),
        Lt(e, a, f, b, S, A),
        e === Ve && ((Ne = Ve = null), (je = 0)),
        (ro = n),
        (Rr = e),
        (ao = a),
        (uf = f),
        (ff = s),
        (ig = i),
        (n.subtreeFlags & 10256) !== 0 || (n.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            AS(Gn, function () {
              return wg(), null;
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (i = (n.flags & 13878) !== 0),
        (n.subtreeFlags & 13878) !== 0 || i)
      ) {
        (i = z.T), (z.T = null), (s = V.p), (V.p = 2), (b = Le), (Le |= 4);
        try {
          gS(e, n, a);
        } finally {
          (Le = b), (V.p = s), (z.T = i);
        }
      }
      (Rt = 1), yg(), bg(), xg();
    }
  }
  function yg() {
    if (Rt === 1) {
      Rt = 0;
      var e = Rr,
        n = ro,
        a = (n.flags & 13878) !== 0;
      if ((n.subtreeFlags & 13878) !== 0 || a) {
        (a = z.T), (z.T = null);
        var i = V.p;
        V.p = 2;
        var s = Le;
        Le |= 4;
        try {
          eg(n, e);
          var f = Af,
            b = lm(e.containerInfo),
            S = f.focusedElem,
            A = f.selectionRange;
          if (
            b !== S &&
            S &&
            S.ownerDocument &&
            om(S.ownerDocument.documentElement, S)
          ) {
            if (A !== null && Ws(S)) {
              var U = A.start,
                I = A.end;
              if ((I === void 0 && (I = U), "selectionStart" in S))
                (S.selectionStart = U),
                  (S.selectionEnd = Math.min(I, S.value.length));
              else {
                var K = S.ownerDocument || document,
                  Z = (K && K.defaultView) || window;
                if (Z.getSelection) {
                  var H = Z.getSelection(),
                    xe = S.textContent.length,
                    ve = Math.min(A.start, xe),
                    $e = A.end === void 0 ? ve : Math.min(A.end, xe);
                  !H.extend && ve > $e && ((b = $e), ($e = ve), (ve = b));
                  var M = am(S, ve),
                    N = am(S, $e);
                  if (
                    M &&
                    N &&
                    (H.rangeCount !== 1 ||
                      H.anchorNode !== M.node ||
                      H.anchorOffset !== M.offset ||
                      H.focusNode !== N.node ||
                      H.focusOffset !== N.offset)
                  ) {
                    var k = K.createRange();
                    k.setStart(M.node, M.offset),
                      H.removeAllRanges(),
                      ve > $e
                        ? (H.addRange(k), H.extend(N.node, N.offset))
                        : (k.setEnd(N.node, N.offset), H.addRange(k));
                  }
                }
              }
            }
            for (K = [], H = S; (H = H.parentNode); )
              H.nodeType === 1 &&
                K.push({ element: H, left: H.scrollLeft, top: H.scrollTop });
            for (
              typeof S.focus == "function" && S.focus(), S = 0;
              S < K.length;
              S++
            ) {
              var P = K[S];
              (P.element.scrollLeft = P.left), (P.element.scrollTop = P.top);
            }
          }
          (yc = !!Rf), (Af = Rf = null);
        } finally {
          (Le = s), (V.p = i), (z.T = a);
        }
      }
      (e.current = n), (Rt = 2);
    }
  }
  function bg() {
    if (Rt === 2) {
      Rt = 0;
      var e = Rr,
        n = ro,
        a = (n.flags & 8772) !== 0;
      if ((n.subtreeFlags & 8772) !== 0 || a) {
        (a = z.T), (z.T = null);
        var i = V.p;
        V.p = 2;
        var s = Le;
        Le |= 4;
        try {
          Qp(e, n.alternate, n);
        } finally {
          (Le = s), (V.p = i), (z.T = a);
        }
      }
      Rt = 3;
    }
  }
  function xg() {
    if (Rt === 4 || Rt === 3) {
      (Rt = 0), rn();
      var e = Rr,
        n = ro,
        a = ao,
        i = ig;
      (n.subtreeFlags & 10256) !== 0 || (n.flags & 10256) !== 0
        ? (Rt = 5)
        : ((Rt = 0), (ro = Rr = null), Sg(e, e.pendingLanes));
      var s = e.pendingLanes;
      if (
        (s === 0 && (Cr = null),
        Et(a),
        (n = n.stateNode),
        ct && typeof ct.onCommitFiberRoot == "function")
      )
        try {
          ct.onCommitFiberRoot(qr, n, void 0, (n.current.flags & 128) === 128);
        } catch {}
      if (i !== null) {
        (n = z.T), (s = V.p), (V.p = 2), (z.T = null);
        try {
          for (var f = e.onRecoverableError, b = 0; b < i.length; b++) {
            var S = i[b];
            f(S.value, { componentStack: S.stack });
          }
        } finally {
          (z.T = n), (V.p = s);
        }
      }
      (ao & 3) !== 0 && lc(),
        Mn(e),
        (s = e.pendingLanes),
        (a & 4194090) !== 0 && (s & 42) !== 0
          ? e === df
            ? xl++
            : ((xl = 0), (df = e))
          : (xl = 0),
        Sl(0);
    }
  }
  function Sg(e, n) {
    (e.pooledCacheLanes &= n) === 0 &&
      ((n = e.pooledCache), n != null && ((e.pooledCache = null), el(n)));
  }
  function lc(e) {
    return yg(), bg(), xg(), wg();
  }
  function wg() {
    if (Rt !== 5) return !1;
    var e = Rr,
      n = uf;
    uf = 0;
    var a = Et(ao),
      i = z.T,
      s = V.p;
    try {
      (V.p = 32 > a ? 32 : a), (z.T = null), (a = ff), (ff = null);
      var f = Rr,
        b = ao;
      if (((Rt = 0), (ro = Rr = null), (ao = 0), (Le & 6) !== 0))
        throw Error(l(331));
      var S = Le;
      if (
        ((Le |= 4),
        og(f.current),
        ng(f, f.current, b, a),
        (Le = S),
        Sl(0, !1),
        ct && typeof ct.onPostCommitFiberRoot == "function")
      )
        try {
          ct.onPostCommitFiberRoot(qr, f);
        } catch {}
      return !0;
    } finally {
      (V.p = s), (z.T = i), Sg(e, n);
    }
  }
  function _g(e, n, a) {
    (n = ln(a, n)),
      (n = Yu(e.stateNode, n, 2)),
      (e = gr(e, n, 2)),
      e !== null && (We(e, 2), Mn(e));
  }
  function Ge(e, n, a) {
    if (e.tag === 3) _g(e, e, a);
    else
      for (; n !== null; ) {
        if (n.tag === 3) {
          _g(n, e, a);
          break;
        } else if (n.tag === 1) {
          var i = n.stateNode;
          if (
            typeof n.type.getDerivedStateFromError == "function" ||
            (typeof i.componentDidCatch == "function" &&
              (Cr === null || !Cr.has(i)))
          ) {
            (e = ln(a, e)),
              (a = Ap(2)),
              (i = gr(n, a, 2)),
              i !== null && (Tp(a, i, n, e), We(i, 2), Mn(i));
            break;
          }
        }
        n = n.return;
      }
  }
  function gf(e, n, a) {
    var i = e.pingCache;
    if (i === null) {
      i = e.pingCache = new bS();
      var s = new Set();
      i.set(n, s);
    } else (s = i.get(n)), s === void 0 && ((s = new Set()), i.set(n, s));
    s.has(a) ||
      ((of = !0), s.add(a), (e = ES.bind(null, e, n, a)), n.then(e, e));
  }
  function ES(e, n, a) {
    var i = e.pingCache;
    i !== null && i.delete(n),
      (e.pingedLanes |= e.suspendedLanes & a),
      (e.warmLanes &= ~a),
      Ve === e &&
        (je & a) === a &&
        (tt === 4 || (tt === 3 && (je & 62914560) === je && 300 > _t() - sf)
          ? (Le & 2) === 0 && oo(e, 0)
          : (lf |= a),
        no === je && (no = 0)),
      Mn(e);
  }
  function Eg(e, n) {
    n === 0 && (n = mi()), (e = $a(e, n)), e !== null && (We(e, n), Mn(e));
  }
  function CS(e) {
    var n = e.memoizedState,
      a = 0;
    n !== null && (a = n.retryLane), Eg(e, a);
  }
  function RS(e, n) {
    var a = 0;
    switch (e.tag) {
      case 13:
        var i = e.stateNode,
          s = e.memoizedState;
        s !== null && (a = s.retryLane);
        break;
      case 19:
        i = e.stateNode;
        break;
      case 22:
        i = e.stateNode._retryCache;
        break;
      default:
        throw Error(l(314));
    }
    i !== null && i.delete(n), Eg(e, a);
  }
  function AS(e, n) {
    return Qe(e, n);
  }
  var ic = null,
    io = null,
    vf = !1,
    cc = !1,
    yf = !1,
    da = 0;
  function Mn(e) {
    e !== io &&
      e.next === null &&
      (io === null ? (ic = io = e) : (io = io.next = e)),
      (cc = !0),
      vf || ((vf = !0), NS());
  }
  function Sl(e, n) {
    if (!yf && cc) {
      yf = !0;
      do
        for (var a = !1, i = ic; i !== null; ) {
          if (e !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var f = 0;
            else {
              var b = i.suspendedLanes,
                S = i.pingedLanes;
              (f = (1 << (31 - ht(42 | e) + 1)) - 1),
                (f &= s & ~(b & ~S)),
                (f = f & 201326741 ? (f & 201326741) | 1 : f ? f | 2 : 0);
            }
            f !== 0 && ((a = !0), Tg(i, f));
          } else
            (f = je),
              (f = Pr(
                i,
                i === Ve ? f : 0,
                i.cancelPendingCommit !== null || i.timeoutHandle !== -1
              )),
              (f & 3) === 0 || Xr(i, f) || ((a = !0), Tg(i, f));
          i = i.next;
        }
      while (a);
      yf = !1;
    }
  }
  function TS() {
    Cg();
  }
  function Cg() {
    cc = vf = !1;
    var e = 0;
    da !== 0 && (US() && (e = da), (da = 0));
    for (var n = _t(), a = null, i = ic; i !== null; ) {
      var s = i.next,
        f = Rg(i, n);
      f === 0
        ? ((i.next = null),
          a === null ? (ic = s) : (a.next = s),
          s === null && (io = a))
        : ((a = i), (e !== 0 || (f & 3) !== 0) && (cc = !0)),
        (i = s);
    }
    Sl(e);
  }
  function Rg(e, n) {
    for (
      var a = e.suspendedLanes,
        i = e.pingedLanes,
        s = e.expirationTimes,
        f = e.pendingLanes & -62914561;
      0 < f;

    ) {
      var b = 31 - ht(f),
        S = 1 << b,
        A = s[b];
      A === -1
        ? ((S & a) === 0 || (S & i) !== 0) && (s[b] = di(S, n))
        : A <= n && (e.expiredLanes |= S),
        (f &= ~S);
    }
    if (
      ((n = Ve),
      (a = je),
      (a = Pr(
        e,
        e === n ? a : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1
      )),
      (i = e.callbackNode),
      a === 0 ||
        (e === n && (Ue === 2 || Ue === 9)) ||
        e.cancelPendingCommit !== null)
    )
      return (
        i !== null && i !== null && rt(i),
        (e.callbackNode = null),
        (e.callbackPriority = 0)
      );
    if ((a & 3) === 0 || Xr(e, a)) {
      if (((n = a & -a), n === e.callbackPriority)) return n;
      switch ((i !== null && rt(i), Et(a))) {
        case 2:
        case 8:
          a = vn;
          break;
        case 32:
          a = Gn;
          break;
        case 268435456:
          a = Bo;
          break;
        default:
          a = Gn;
      }
      return (
        (i = Ag.bind(null, e)),
        (a = Qe(a, i)),
        (e.callbackPriority = n),
        (e.callbackNode = a),
        n
      );
    }
    return (
      i !== null && i !== null && rt(i),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function Ag(e, n) {
    if (Rt !== 0 && Rt !== 5)
      return (e.callbackNode = null), (e.callbackPriority = 0), null;
    var a = e.callbackNode;
    if (lc() && e.callbackNode !== a) return null;
    var i = je;
    return (
      (i = Pr(
        e,
        e === Ve ? i : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1
      )),
      i === 0
        ? null
        : (sg(e, i, n),
          Rg(e, _t()),
          e.callbackNode != null && e.callbackNode === a
            ? Ag.bind(null, e)
            : null)
    );
  }
  function Tg(e, n) {
    if (lc()) return null;
    sg(e, n, !0);
  }
  function NS() {
    ZS(function () {
      (Le & 6) !== 0 ? Qe(Ea, TS) : Cg();
    });
  }
  function bf() {
    return da === 0 && (da = hi()), da;
  }
  function Ng(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean"
      ? null
      : typeof e == "function"
      ? e
      : bi("" + e);
  }
  function Og(e, n) {
    var a = n.ownerDocument.createElement("input");
    return (
      (a.name = n.name),
      (a.value = n.value),
      e.id && a.setAttribute("form", e.id),
      n.parentNode.insertBefore(a, n),
      (e = new FormData(e)),
      a.parentNode.removeChild(a),
      e
    );
  }
  function OS(e, n, a, i, s) {
    if (n === "submit" && a && a.stateNode === s) {
      var f = Ng((s[Pe] || null).action),
        b = i.submitter;
      b &&
        ((n = (n = b[Pe] || null)
          ? Ng(n.formAction)
          : b.getAttribute("formAction")),
        n !== null && ((f = n), (b = null)));
      var S = new _i("action", "action", null, i, s);
      e.push({
        event: S,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (i.defaultPrevented) {
                if (da !== 0) {
                  var A = b ? Og(s, b) : new FormData(s);
                  Bu(
                    a,
                    { pending: !0, data: A, method: s.method, action: f },
                    null,
                    A
                  );
                }
              } else
                typeof f == "function" &&
                  (S.preventDefault(),
                  (A = b ? Og(s, b) : new FormData(s)),
                  Bu(
                    a,
                    { pending: !0, data: A, method: s.method, action: f },
                    f,
                    A
                  ));
            },
            currentTarget: s,
          },
        ],
      });
    }
  }
  for (var xf = 0; xf < ru.length; xf++) {
    var Sf = ru[xf],
      DS = Sf.toLowerCase(),
      jS = Sf[0].toUpperCase() + Sf.slice(1);
    xn(DS, "on" + jS);
  }
  xn(sm, "onAnimationEnd"),
    xn(um, "onAnimationIteration"),
    xn(fm, "onAnimationStart"),
    xn("dblclick", "onDoubleClick"),
    xn("focusin", "onFocus"),
    xn("focusout", "onBlur"),
    xn(K1, "onTransitionRun"),
    xn(Q1, "onTransitionStart"),
    xn(F1, "onTransitionCancel"),
    xn(dm, "onTransitionEnd"),
    Da("onMouseEnter", ["mouseout", "mouseover"]),
    Da("onMouseLeave", ["mouseout", "mouseover"]),
    Da("onPointerEnter", ["pointerout", "pointerover"]),
    Da("onPointerLeave", ["pointerout", "pointerover"]),
    Qr(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " "
      )
    ),
    Qr(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    ),
    Qr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    Qr(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    ),
    Qr(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    ),
    Qr(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
  var wl =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      ),
    zS = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(wl)
    );
  function Dg(e, n) {
    n = (n & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var i = e[a],
        s = i.event;
      i = i.listeners;
      e: {
        var f = void 0;
        if (n)
          for (var b = i.length - 1; 0 <= b; b--) {
            var S = i[b],
              A = S.instance,
              U = S.currentTarget;
            if (((S = S.listener), A !== f && s.isPropagationStopped()))
              break e;
            (f = S), (s.currentTarget = U);
            try {
              f(s);
            } catch (I) {
              Ki(I);
            }
            (s.currentTarget = null), (f = A);
          }
        else
          for (b = 0; b < i.length; b++) {
            if (
              ((S = i[b]),
              (A = S.instance),
              (U = S.currentTarget),
              (S = S.listener),
              A !== f && s.isPropagationStopped())
            )
              break e;
            (f = S), (s.currentTarget = U);
            try {
              f(s);
            } catch (I) {
              Ki(I);
            }
            (s.currentTarget = null), (f = A);
          }
      }
    }
  }
  function Oe(e, n) {
    var a = n[Yn];
    a === void 0 && (a = n[Yn] = new Set());
    var i = e + "__bubble";
    a.has(i) || (jg(n, e, 2, !1), a.add(i));
  }
  function wf(e, n, a) {
    var i = 0;
    n && (i |= 4), jg(a, e, i, n);
  }
  var sc = "_reactListening" + Math.random().toString(36).slice(2);
  function _f(e) {
    if (!e[sc]) {
      (e[sc] = !0),
        Ch.forEach(function (a) {
          a !== "selectionchange" && (zS.has(a) || wf(a, !1, e), wf(a, !0, e));
        });
      var n = e.nodeType === 9 ? e : e.ownerDocument;
      n === null || n[sc] || ((n[sc] = !0), wf("selectionchange", !1, n));
    }
  }
  function jg(e, n, a, i) {
    switch (nv(n)) {
      case 2:
        var s = lw;
        break;
      case 8:
        s = iw;
        break;
      default:
        s = Uf;
    }
    (a = s.bind(null, n, a, e)),
      (s = void 0),
      !Vs ||
        (n !== "touchstart" && n !== "touchmove" && n !== "wheel") ||
        (s = !0),
      i
        ? s !== void 0
          ? e.addEventListener(n, a, { capture: !0, passive: s })
          : e.addEventListener(n, a, !0)
        : s !== void 0
        ? e.addEventListener(n, a, { passive: s })
        : e.addEventListener(n, a, !1);
  }
  function Ef(e, n, a, i, s) {
    var f = i;
    if ((n & 1) === 0 && (n & 2) === 0 && i !== null)
      e: for (;;) {
        if (i === null) return;
        var b = i.tag;
        if (b === 3 || b === 4) {
          var S = i.stateNode.containerInfo;
          if (S === s) break;
          if (b === 4)
            for (b = i.return; b !== null; ) {
              var A = b.tag;
              if ((A === 3 || A === 4) && b.stateNode.containerInfo === s)
                return;
              b = b.return;
            }
          for (; S !== null; ) {
            if (((b = Ta(S)), b === null)) return;
            if (((A = b.tag), A === 5 || A === 6 || A === 26 || A === 27)) {
              i = f = b;
              continue e;
            }
            S = S.parentNode;
          }
        }
        i = i.return;
      }
    Zh(function () {
      var U = f,
        I = Gs(a),
        K = [];
      e: {
        var Z = hm.get(e);
        if (Z !== void 0) {
          var H = _i,
            xe = e;
          switch (e) {
            case "keypress":
              if (Si(a) === 0) break e;
            case "keydown":
            case "keyup":
              H = A1;
              break;
            case "focusin":
              (xe = "focus"), (H = Xs);
              break;
            case "focusout":
              (xe = "blur"), (H = Xs);
              break;
            case "beforeblur":
            case "afterblur":
              H = Xs;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              H = Gh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              H = p1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              H = O1;
              break;
            case sm:
            case um:
            case fm:
              H = y1;
              break;
            case dm:
              H = j1;
              break;
            case "scroll":
            case "scrollend":
              H = h1;
              break;
            case "wheel":
              H = M1;
              break;
            case "copy":
            case "cut":
            case "paste":
              H = x1;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              H = Vh;
              break;
            case "toggle":
            case "beforetoggle":
              H = L1;
          }
          var ve = (n & 4) !== 0,
            $e = !ve && (e === "scroll" || e === "scrollend"),
            M = ve ? (Z !== null ? Z + "Capture" : null) : Z;
          ve = [];
          for (var N = U, k; N !== null; ) {
            var P = N;
            if (
              ((k = P.stateNode),
              (P = P.tag),
              (P !== 5 && P !== 26 && P !== 27) ||
                k === null ||
                M === null ||
                ((P = $o(N, M)), P != null && ve.push(_l(N, P, k))),
              $e)
            )
              break;
            N = N.return;
          }
          0 < ve.length &&
            ((Z = new H(Z, xe, null, a, I)),
            K.push({ event: Z, listeners: ve }));
        }
      }
      if ((n & 7) === 0) {
        e: {
          if (
            ((Z = e === "mouseover" || e === "pointerover"),
            (H = e === "mouseout" || e === "pointerout"),
            Z &&
              a !== $s &&
              (xe = a.relatedTarget || a.fromElement) &&
              (Ta(xe) || xe[Dt]))
          )
            break e;
          if (
            (H || Z) &&
            ((Z =
              I.window === I
                ? I
                : (Z = I.ownerDocument)
                ? Z.defaultView || Z.parentWindow
                : window),
            H
              ? ((xe = a.relatedTarget || a.toElement),
                (H = U),
                (xe = xe ? Ta(xe) : null),
                xe !== null &&
                  (($e = u(xe)),
                  (ve = xe.tag),
                  xe !== $e || (ve !== 5 && ve !== 27 && ve !== 6)) &&
                  (xe = null))
              : ((H = null), (xe = U)),
            H !== xe)
          ) {
            if (
              ((ve = Gh),
              (P = "onMouseLeave"),
              (M = "onMouseEnter"),
              (N = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((ve = Vh),
                (P = "onPointerLeave"),
                (M = "onPointerEnter"),
                (N = "pointer")),
              ($e = H == null ? Z : Ho(H)),
              (k = xe == null ? Z : Ho(xe)),
              (Z = new ve(P, N + "leave", H, a, I)),
              (Z.target = $e),
              (Z.relatedTarget = k),
              (P = null),
              Ta(I) === U &&
                ((ve = new ve(M, N + "enter", xe, a, I)),
                (ve.target = k),
                (ve.relatedTarget = $e),
                (P = ve)),
              ($e = P),
              H && xe)
            )
              t: {
                for (ve = H, M = xe, N = 0, k = ve; k; k = co(k)) N++;
                for (k = 0, P = M; P; P = co(P)) k++;
                for (; 0 < N - k; ) (ve = co(ve)), N--;
                for (; 0 < k - N; ) (M = co(M)), k--;
                for (; N--; ) {
                  if (ve === M || (M !== null && ve === M.alternate)) break t;
                  (ve = co(ve)), (M = co(M));
                }
                ve = null;
              }
            else ve = null;
            H !== null && zg(K, Z, H, ve, !1),
              xe !== null && $e !== null && zg(K, $e, xe, ve, !0);
          }
        }
        e: {
          if (
            ((Z = U ? Ho(U) : window),
            (H = Z.nodeName && Z.nodeName.toLowerCase()),
            H === "select" || (H === "input" && Z.type === "file"))
          )
            var oe = Jh;
          else if (Qh(Z))
            if (Wh) oe = q1;
            else {
              oe = V1;
              var Te = Y1;
            }
          else
            (H = Z.nodeName),
              !H ||
              H.toLowerCase() !== "input" ||
              (Z.type !== "checkbox" && Z.type !== "radio")
                ? U && Hs(U.elementType) && (oe = Jh)
                : (oe = I1);
          if (oe && (oe = oe(e, U))) {
            Fh(K, oe, a, I);
            break e;
          }
          Te && Te(e, Z, U),
            e === "focusout" &&
              U &&
              Z.type === "number" &&
              U.memoizedProps.value != null &&
              Zs(Z, "number", Z.value);
        }
        switch (((Te = U ? Ho(U) : window), e)) {
          case "focusin":
            (Qh(Te) || Te.contentEditable === "true") &&
              ((Ba = Te), (eu = U), (Ko = null));
            break;
          case "focusout":
            Ko = eu = Ba = null;
            break;
          case "mousedown":
            tu = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            (tu = !1), im(K, a, I);
            break;
          case "selectionchange":
            if (X1) break;
          case "keydown":
          case "keyup":
            im(K, a, I);
        }
        var de;
        if (Qs)
          e: {
            switch (e) {
              case "compositionstart":
                var be = "onCompositionStart";
                break e;
              case "compositionend":
                be = "onCompositionEnd";
                break e;
              case "compositionupdate":
                be = "onCompositionUpdate";
                break e;
            }
            be = void 0;
          }
        else
          Ua
            ? Xh(e, a) && (be = "onCompositionEnd")
            : e === "keydown" &&
              a.keyCode === 229 &&
              (be = "onCompositionStart");
        be &&
          (Ih &&
            a.locale !== "ko" &&
            (Ua || be !== "onCompositionStart"
              ? be === "onCompositionEnd" && Ua && (de = Hh())
              : ((dr = I),
                (Is = "value" in dr ? dr.value : dr.textContent),
                (Ua = !0))),
          (Te = uc(U, be)),
          0 < Te.length &&
            ((be = new Yh(be, e, null, a, I)),
            K.push({ event: be, listeners: Te }),
            de
              ? (be.data = de)
              : ((de = Kh(a)), de !== null && (be.data = de)))),
          (de = B1 ? Z1(e, a) : H1(e, a)) &&
            ((be = uc(U, "onBeforeInput")),
            0 < be.length &&
              ((Te = new Yh("onBeforeInput", "beforeinput", null, a, I)),
              K.push({ event: Te, listeners: be }),
              (Te.data = de))),
          OS(K, e, U, a, I);
      }
      Dg(K, n);
    });
  }
  function _l(e, n, a) {
    return { instance: e, listener: n, currentTarget: a };
  }
  function uc(e, n) {
    for (var a = n + "Capture", i = []; e !== null; ) {
      var s = e,
        f = s.stateNode;
      if (
        ((s = s.tag),
        (s !== 5 && s !== 26 && s !== 27) ||
          f === null ||
          ((s = $o(e, a)),
          s != null && i.unshift(_l(e, s, f)),
          (s = $o(e, n)),
          s != null && i.push(_l(e, s, f))),
        e.tag === 3)
      )
        return i;
      e = e.return;
    }
    return [];
  }
  function co(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function zg(e, n, a, i, s) {
    for (var f = n._reactName, b = []; a !== null && a !== i; ) {
      var S = a,
        A = S.alternate,
        U = S.stateNode;
      if (((S = S.tag), A !== null && A === i)) break;
      (S !== 5 && S !== 26 && S !== 27) ||
        U === null ||
        ((A = U),
        s
          ? ((U = $o(a, f)), U != null && b.unshift(_l(a, U, A)))
          : s || ((U = $o(a, f)), U != null && b.push(_l(a, U, A)))),
        (a = a.return);
    }
    b.length !== 0 && e.push({ event: n, listeners: b });
  }
  var MS = /\r\n?/g,
    kS = /\u0000|\uFFFD/g;
  function Mg(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        MS,
        `
`
      )
      .replace(kS, "");
  }
  function kg(e, n) {
    return (n = Mg(n)), Mg(e) === n;
  }
  function fc() {}
  function He(e, n, a, i, s, f) {
    switch (a) {
      case "children":
        typeof i == "string"
          ? n === "body" || (n === "textarea" && i === "") || Ma(e, i)
          : (typeof i == "number" || typeof i == "bigint") &&
            n !== "body" &&
            Ma(e, "" + i);
        break;
      case "className":
        gi(e, "class", i);
        break;
      case "tabIndex":
        gi(e, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        gi(e, a, i);
        break;
      case "style":
        Uh(e, i, f);
        break;
      case "data":
        if (n !== "object") {
          gi(e, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (n !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (
          i == null ||
          typeof i == "function" ||
          typeof i == "symbol" ||
          typeof i == "boolean"
        ) {
          e.removeAttribute(a);
          break;
        }
        (i = bi("" + i)), e.setAttribute(a, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof f == "function" &&
            (a === "formAction"
              ? (n !== "input" && He(e, n, "name", s.name, s, null),
                He(e, n, "formEncType", s.formEncType, s, null),
                He(e, n, "formMethod", s.formMethod, s, null),
                He(e, n, "formTarget", s.formTarget, s, null))
              : (He(e, n, "encType", s.encType, s, null),
                He(e, n, "method", s.method, s, null),
                He(e, n, "target", s.target, s, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          e.removeAttribute(a);
          break;
        }
        (i = bi("" + i)), e.setAttribute(a, i);
        break;
      case "onClick":
        i != null && (e.onclick = fc);
        break;
      case "onScroll":
        i != null && Oe("scroll", e);
        break;
      case "onScrollEnd":
        i != null && Oe("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(l(61));
          if (((a = i.__html), a != null)) {
            if (s.children != null) throw Error(l(60));
            e.innerHTML = a;
          }
        }
        break;
      case "multiple":
        e.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        e.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          i == null ||
          typeof i == "function" ||
          typeof i == "boolean" ||
          typeof i == "symbol"
        ) {
          e.removeAttribute("xlink:href");
          break;
        }
        (a = bi("" + i)),
          e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol"
          ? e.setAttribute(a, "" + i)
          : e.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol"
          ? e.setAttribute(a, "")
          : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        i === !0
          ? e.setAttribute(a, "")
          : i !== !1 &&
            i != null &&
            typeof i != "function" &&
            typeof i != "symbol"
          ? e.setAttribute(a, i)
          : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null &&
        typeof i != "function" &&
        typeof i != "symbol" &&
        !isNaN(i) &&
        1 <= i
          ? e.setAttribute(a, i)
          : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i)
          ? e.removeAttribute(a)
          : e.setAttribute(a, i);
        break;
      case "popover":
        Oe("beforetoggle", e), Oe("toggle", e), pi(e, "popover", i);
        break;
      case "xlinkActuate":
        In(e, "http://www.w3.org/1999/xlink", "xlink:actuate", i);
        break;
      case "xlinkArcrole":
        In(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", i);
        break;
      case "xlinkRole":
        In(e, "http://www.w3.org/1999/xlink", "xlink:role", i);
        break;
      case "xlinkShow":
        In(e, "http://www.w3.org/1999/xlink", "xlink:show", i);
        break;
      case "xlinkTitle":
        In(e, "http://www.w3.org/1999/xlink", "xlink:title", i);
        break;
      case "xlinkType":
        In(e, "http://www.w3.org/1999/xlink", "xlink:type", i);
        break;
      case "xmlBase":
        In(e, "http://www.w3.org/XML/1998/namespace", "xml:base", i);
        break;
      case "xmlLang":
        In(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", i);
        break;
      case "xmlSpace":
        In(e, "http://www.w3.org/XML/1998/namespace", "xml:space", i);
        break;
      case "is":
        pi(e, "is", i);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) ||
          (a[0] !== "o" && a[0] !== "O") ||
          (a[1] !== "n" && a[1] !== "N")) &&
          ((a = f1.get(a) || a), pi(e, a, i));
    }
  }
  function Cf(e, n, a, i, s, f) {
    switch (a) {
      case "style":
        Uh(e, i, f);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(l(61));
          if (((a = i.__html), a != null)) {
            if (s.children != null) throw Error(l(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof i == "string"
          ? Ma(e, i)
          : (typeof i == "number" || typeof i == "bigint") && Ma(e, "" + i);
        break;
      case "onScroll":
        i != null && Oe("scroll", e);
        break;
      case "onScrollEnd":
        i != null && Oe("scrollend", e);
        break;
      case "onClick":
        i != null && (e.onclick = fc);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Rh.hasOwnProperty(a))
          e: {
            if (
              a[0] === "o" &&
              a[1] === "n" &&
              ((s = a.endsWith("Capture")),
              (n = a.slice(2, s ? a.length - 7 : void 0)),
              (f = e[Pe] || null),
              (f = f != null ? f[a] : null),
              typeof f == "function" && e.removeEventListener(n, f, s),
              typeof i == "function")
            ) {
              typeof f != "function" &&
                f !== null &&
                (a in e
                  ? (e[a] = null)
                  : e.hasAttribute(a) && e.removeAttribute(a)),
                e.addEventListener(n, i, s);
              break e;
            }
            a in e
              ? (e[a] = i)
              : i === !0
              ? e.setAttribute(a, "")
              : pi(e, a, i);
          }
    }
  }
  function At(e, n, a) {
    switch (n) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Oe("error", e), Oe("load", e);
        var i = !1,
          s = !1,
          f;
        for (f in a)
          if (a.hasOwnProperty(f)) {
            var b = a[f];
            if (b != null)
              switch (f) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  s = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(l(137, n));
                default:
                  He(e, n, f, b, a, null);
              }
          }
        s && He(e, n, "srcSet", a.srcSet, a, null),
          i && He(e, n, "src", a.src, a, null);
        return;
      case "input":
        Oe("invalid", e);
        var S = (f = b = s = null),
          A = null,
          U = null;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var I = a[i];
            if (I != null)
              switch (i) {
                case "name":
                  s = I;
                  break;
                case "type":
                  b = I;
                  break;
                case "checked":
                  A = I;
                  break;
                case "defaultChecked":
                  U = I;
                  break;
                case "value":
                  f = I;
                  break;
                case "defaultValue":
                  S = I;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (I != null) throw Error(l(137, n));
                  break;
                default:
                  He(e, n, i, I, a, null);
              }
          }
        zh(e, f, S, A, U, b, s, !1), vi(e);
        return;
      case "select":
        Oe("invalid", e), (i = b = f = null);
        for (s in a)
          if (a.hasOwnProperty(s) && ((S = a[s]), S != null))
            switch (s) {
              case "value":
                f = S;
                break;
              case "defaultValue":
                b = S;
                break;
              case "multiple":
                i = S;
              default:
                He(e, n, s, S, a, null);
            }
        (n = f),
          (a = b),
          (e.multiple = !!i),
          n != null ? za(e, !!i, n, !1) : a != null && za(e, !!i, a, !0);
        return;
      case "textarea":
        Oe("invalid", e), (f = s = i = null);
        for (b in a)
          if (a.hasOwnProperty(b) && ((S = a[b]), S != null))
            switch (b) {
              case "value":
                i = S;
                break;
              case "defaultValue":
                s = S;
                break;
              case "children":
                f = S;
                break;
              case "dangerouslySetInnerHTML":
                if (S != null) throw Error(l(91));
                break;
              default:
                He(e, n, b, S, a, null);
            }
        kh(e, i, s, f), vi(e);
        return;
      case "option":
        for (A in a)
          if (a.hasOwnProperty(A) && ((i = a[A]), i != null))
            switch (A) {
              case "selected":
                e.selected =
                  i && typeof i != "function" && typeof i != "symbol";
                break;
              default:
                He(e, n, A, i, a, null);
            }
        return;
      case "dialog":
        Oe("beforetoggle", e), Oe("toggle", e), Oe("cancel", e), Oe("close", e);
        break;
      case "iframe":
      case "object":
        Oe("load", e);
        break;
      case "video":
      case "audio":
        for (i = 0; i < wl.length; i++) Oe(wl[i], e);
        break;
      case "image":
        Oe("error", e), Oe("load", e);
        break;
      case "details":
        Oe("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Oe("error", e), Oe("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (U in a)
          if (a.hasOwnProperty(U) && ((i = a[U]), i != null))
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(l(137, n));
              default:
                He(e, n, U, i, a, null);
            }
        return;
      default:
        if (Hs(n)) {
          for (I in a)
            a.hasOwnProperty(I) &&
              ((i = a[I]), i !== void 0 && Cf(e, n, I, i, a, void 0));
          return;
        }
    }
    for (S in a)
      a.hasOwnProperty(S) && ((i = a[S]), i != null && He(e, n, S, i, a, null));
  }
  function LS(e, n, a, i) {
    switch (n) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var s = null,
          f = null,
          b = null,
          S = null,
          A = null,
          U = null,
          I = null;
        for (H in a) {
          var K = a[H];
          if (a.hasOwnProperty(H) && K != null)
            switch (H) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                A = K;
              default:
                i.hasOwnProperty(H) || He(e, n, H, null, i, K);
            }
        }
        for (var Z in i) {
          var H = i[Z];
          if (((K = a[Z]), i.hasOwnProperty(Z) && (H != null || K != null)))
            switch (Z) {
              case "type":
                f = H;
                break;
              case "name":
                s = H;
                break;
              case "checked":
                U = H;
                break;
              case "defaultChecked":
                I = H;
                break;
              case "value":
                b = H;
                break;
              case "defaultValue":
                S = H;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (H != null) throw Error(l(137, n));
                break;
              default:
                H !== K && He(e, n, Z, H, i, K);
            }
        }
        Bs(e, b, S, A, U, I, f, s);
        return;
      case "select":
        H = b = S = Z = null;
        for (f in a)
          if (((A = a[f]), a.hasOwnProperty(f) && A != null))
            switch (f) {
              case "value":
                break;
              case "multiple":
                H = A;
              default:
                i.hasOwnProperty(f) || He(e, n, f, null, i, A);
            }
        for (s in i)
          if (
            ((f = i[s]),
            (A = a[s]),
            i.hasOwnProperty(s) && (f != null || A != null))
          )
            switch (s) {
              case "value":
                Z = f;
                break;
              case "defaultValue":
                S = f;
                break;
              case "multiple":
                b = f;
              default:
                f !== A && He(e, n, s, f, i, A);
            }
        (n = S),
          (a = b),
          (i = H),
          Z != null
            ? za(e, !!a, Z, !1)
            : !!i != !!a &&
              (n != null ? za(e, !!a, n, !0) : za(e, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        H = Z = null;
        for (S in a)
          if (
            ((s = a[S]),
            a.hasOwnProperty(S) && s != null && !i.hasOwnProperty(S))
          )
            switch (S) {
              case "value":
                break;
              case "children":
                break;
              default:
                He(e, n, S, null, i, s);
            }
        for (b in i)
          if (
            ((s = i[b]),
            (f = a[b]),
            i.hasOwnProperty(b) && (s != null || f != null))
          )
            switch (b) {
              case "value":
                Z = s;
                break;
              case "defaultValue":
                H = s;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(l(91));
                break;
              default:
                s !== f && He(e, n, b, s, i, f);
            }
        Mh(e, Z, H);
        return;
      case "option":
        for (var xe in a)
          if (
            ((Z = a[xe]),
            a.hasOwnProperty(xe) && Z != null && !i.hasOwnProperty(xe))
          )
            switch (xe) {
              case "selected":
                e.selected = !1;
                break;
              default:
                He(e, n, xe, null, i, Z);
            }
        for (A in i)
          if (
            ((Z = i[A]),
            (H = a[A]),
            i.hasOwnProperty(A) && Z !== H && (Z != null || H != null))
          )
            switch (A) {
              case "selected":
                e.selected =
                  Z && typeof Z != "function" && typeof Z != "symbol";
                break;
              default:
                He(e, n, A, Z, i, H);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ve in a)
          (Z = a[ve]),
            a.hasOwnProperty(ve) &&
              Z != null &&
              !i.hasOwnProperty(ve) &&
              He(e, n, ve, null, i, Z);
        for (U in i)
          if (
            ((Z = i[U]),
            (H = a[U]),
            i.hasOwnProperty(U) && Z !== H && (Z != null || H != null))
          )
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (Z != null) throw Error(l(137, n));
                break;
              default:
                He(e, n, U, Z, i, H);
            }
        return;
      default:
        if (Hs(n)) {
          for (var $e in a)
            (Z = a[$e]),
              a.hasOwnProperty($e) &&
                Z !== void 0 &&
                !i.hasOwnProperty($e) &&
                Cf(e, n, $e, void 0, i, Z);
          for (I in i)
            (Z = i[I]),
              (H = a[I]),
              !i.hasOwnProperty(I) ||
                Z === H ||
                (Z === void 0 && H === void 0) ||
                Cf(e, n, I, Z, i, H);
          return;
        }
    }
    for (var M in a)
      (Z = a[M]),
        a.hasOwnProperty(M) &&
          Z != null &&
          !i.hasOwnProperty(M) &&
          He(e, n, M, null, i, Z);
    for (K in i)
      (Z = i[K]),
        (H = a[K]),
        !i.hasOwnProperty(K) ||
          Z === H ||
          (Z == null && H == null) ||
          He(e, n, K, Z, i, H);
  }
  var Rf = null,
    Af = null;
  function dc(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Lg(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Ug(e, n) {
    if (e === 0)
      switch (n) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && n === "foreignObject" ? 0 : e;
  }
  function Tf(e, n) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof n.children == "string" ||
      typeof n.children == "number" ||
      typeof n.children == "bigint" ||
      (typeof n.dangerouslySetInnerHTML == "object" &&
        n.dangerouslySetInnerHTML !== null &&
        n.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Nf = null;
  function US() {
    var e = window.event;
    return e && e.type === "popstate"
      ? e === Nf
        ? !1
        : ((Nf = e), !0)
      : ((Nf = null), !1);
  }
  var Bg = typeof setTimeout == "function" ? setTimeout : void 0,
    BS = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Zg = typeof Promise == "function" ? Promise : void 0,
    ZS =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Zg < "u"
        ? function (e) {
            return Zg.resolve(null).then(e).catch(HS);
          }
        : Bg;
  function HS(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Tr(e) {
    return e === "head";
  }
  function Hg(e, n) {
    var a = n,
      i = 0,
      s = 0;
    do {
      var f = a.nextSibling;
      if ((e.removeChild(a), f && f.nodeType === 8))
        if (((a = f.data), a === "/$")) {
          if (0 < i && 8 > i) {
            a = i;
            var b = e.ownerDocument;
            if ((a & 1 && El(b.documentElement), a & 2 && El(b.body), a & 4))
              for (a = b.head, El(a), b = a.firstChild; b; ) {
                var S = b.nextSibling,
                  A = b.nodeName;
                b[Vn] ||
                  A === "SCRIPT" ||
                  A === "STYLE" ||
                  (A === "LINK" && b.rel.toLowerCase() === "stylesheet") ||
                  a.removeChild(b),
                  (b = S);
              }
          }
          if (s === 0) {
            e.removeChild(f), jl(n);
            return;
          }
          s--;
        } else
          a === "$" || a === "$?" || a === "$!"
            ? s++
            : (i = a.charCodeAt(0) - 48);
      else i = 0;
      a = f;
    } while (a);
    jl(n);
  }
  function Of(e) {
    var n = e.firstChild;
    for (n && n.nodeType === 10 && (n = n.nextSibling); n; ) {
      var a = n;
      switch (((n = n.nextSibling), a.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Of(a), Ms(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function $S(e, n, a, i) {
    for (; e.nodeType === 1; ) {
      var s = a;
      if (e.nodeName.toLowerCase() !== n.toLowerCase()) {
        if (!i && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (i) {
        if (!e[Vn])
          switch (n) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (
                ((f = e.getAttribute("rel")),
                f === "stylesheet" && e.hasAttribute("data-precedence"))
              )
                break;
              if (
                f !== s.rel ||
                e.getAttribute("href") !==
                  (s.href == null || s.href === "" ? null : s.href) ||
                e.getAttribute("crossorigin") !==
                  (s.crossOrigin == null ? null : s.crossOrigin) ||
                e.getAttribute("title") !== (s.title == null ? null : s.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((f = e.getAttribute("src")),
                (f !== (s.src == null ? null : s.src) ||
                  e.getAttribute("type") !== (s.type == null ? null : s.type) ||
                  e.getAttribute("crossorigin") !==
                    (s.crossOrigin == null ? null : s.crossOrigin)) &&
                  f &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (n === "input" && e.type === "hidden") {
        var f = s.name == null ? null : "" + s.name;
        if (s.type === "hidden" && e.getAttribute("name") === f) return e;
      } else return e;
      if (((e = wn(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function GS(e, n, a) {
    if (n === "") return null;
    for (; e.nodeType !== 3; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") &&
          !a) ||
        ((e = wn(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Df(e) {
    return (
      e.data === "$!" ||
      (e.data === "$?" && e.ownerDocument.readyState === "complete")
    );
  }
  function YS(e, n) {
    var a = e.ownerDocument;
    if (e.data !== "$?" || a.readyState === "complete") n();
    else {
      var i = function () {
        n(), a.removeEventListener("DOMContentLoaded", i);
      };
      a.addEventListener("DOMContentLoaded", i), (e._reactRetry = i);
    }
  }
  function wn(e) {
    for (; e != null; e = e.nextSibling) {
      var n = e.nodeType;
      if (n === 1 || n === 3) break;
      if (n === 8) {
        if (
          ((n = e.data),
          n === "$" || n === "$!" || n === "$?" || n === "F!" || n === "F")
        )
          break;
        if (n === "/$") return null;
      }
    }
    return e;
  }
  var jf = null;
  function $g(e) {
    e = e.previousSibling;
    for (var n = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?") {
          if (n === 0) return e;
          n--;
        } else a === "/$" && n++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Gg(e, n, a) {
    switch (((n = dc(a)), e)) {
      case "html":
        if (((e = n.documentElement), !e)) throw Error(l(452));
        return e;
      case "head":
        if (((e = n.head), !e)) throw Error(l(453));
        return e;
      case "body":
        if (((e = n.body), !e)) throw Error(l(454));
        return e;
      default:
        throw Error(l(451));
    }
  }
  function El(e) {
    for (var n = e.attributes; n.length; ) e.removeAttributeNode(n[0]);
    Ms(e);
  }
  var hn = new Map(),
    Yg = new Set();
  function hc(e) {
    return typeof e.getRootNode == "function"
      ? e.getRootNode()
      : e.nodeType === 9
      ? e
      : e.ownerDocument;
  }
  var or = V.d;
  V.d = { f: VS, r: IS, D: qS, C: PS, L: XS, m: KS, X: FS, S: QS, M: JS };
  function VS() {
    var e = or.f(),
      n = ac();
    return e || n;
  }
  function IS(e) {
    var n = Na(e);
    n !== null && n.tag === 5 && n.type === "form" ? sp(n) : or.r(e);
  }
  var so = typeof document > "u" ? null : document;
  function Vg(e, n, a) {
    var i = so;
    if (i && typeof n == "string" && n) {
      var s = on(n);
      (s = 'link[rel="' + e + '"][href="' + s + '"]'),
        typeof a == "string" && (s += '[crossorigin="' + a + '"]'),
        Yg.has(s) ||
          (Yg.add(s),
          (e = { rel: e, crossOrigin: a, href: n }),
          i.querySelector(s) === null &&
            ((n = i.createElement("link")),
            At(n, "link", e),
            yt(n),
            i.head.appendChild(n)));
    }
  }
  function qS(e) {
    or.D(e), Vg("dns-prefetch", e, null);
  }
  function PS(e, n) {
    or.C(e, n), Vg("preconnect", e, n);
  }
  function XS(e, n, a) {
    or.L(e, n, a);
    var i = so;
    if (i && e && n) {
      var s = 'link[rel="preload"][as="' + on(n) + '"]';
      n === "image" && a && a.imageSrcSet
        ? ((s += '[imagesrcset="' + on(a.imageSrcSet) + '"]'),
          typeof a.imageSizes == "string" &&
            (s += '[imagesizes="' + on(a.imageSizes) + '"]'))
        : (s += '[href="' + on(e) + '"]');
      var f = s;
      switch (n) {
        case "style":
          f = uo(e);
          break;
        case "script":
          f = fo(e);
      }
      hn.has(f) ||
        ((e = v(
          {
            rel: "preload",
            href: n === "image" && a && a.imageSrcSet ? void 0 : e,
            as: n,
          },
          a
        )),
        hn.set(f, e),
        i.querySelector(s) !== null ||
          (n === "style" && i.querySelector(Cl(f))) ||
          (n === "script" && i.querySelector(Rl(f))) ||
          ((n = i.createElement("link")),
          At(n, "link", e),
          yt(n),
          i.head.appendChild(n)));
    }
  }
  function KS(e, n) {
    or.m(e, n);
    var a = so;
    if (a && e) {
      var i = n && typeof n.as == "string" ? n.as : "script",
        s =
          'link[rel="modulepreload"][as="' + on(i) + '"][href="' + on(e) + '"]',
        f = s;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          f = fo(e);
      }
      if (
        !hn.has(f) &&
        ((e = v({ rel: "modulepreload", href: e }, n)),
        hn.set(f, e),
        a.querySelector(s) === null)
      ) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(Rl(f))) return;
        }
        (i = a.createElement("link")),
          At(i, "link", e),
          yt(i),
          a.head.appendChild(i);
      }
    }
  }
  function QS(e, n, a) {
    or.S(e, n, a);
    var i = so;
    if (i && e) {
      var s = Oa(i).hoistableStyles,
        f = uo(e);
      n = n || "default";
      var b = s.get(f);
      if (!b) {
        var S = { loading: 0, preload: null };
        if ((b = i.querySelector(Cl(f)))) S.loading = 5;
        else {
          (e = v({ rel: "stylesheet", href: e, "data-precedence": n }, a)),
            (a = hn.get(f)) && zf(e, a);
          var A = (b = i.createElement("link"));
          yt(A),
            At(A, "link", e),
            (A._p = new Promise(function (U, I) {
              (A.onload = U), (A.onerror = I);
            })),
            A.addEventListener("load", function () {
              S.loading |= 1;
            }),
            A.addEventListener("error", function () {
              S.loading |= 2;
            }),
            (S.loading |= 4),
            mc(b, n, i);
        }
        (b = { type: "stylesheet", instance: b, count: 1, state: S }),
          s.set(f, b);
      }
    }
  }
  function FS(e, n) {
    or.X(e, n);
    var a = so;
    if (a && e) {
      var i = Oa(a).hoistableScripts,
        s = fo(e),
        f = i.get(s);
      f ||
        ((f = a.querySelector(Rl(s))),
        f ||
          ((e = v({ src: e, async: !0 }, n)),
          (n = hn.get(s)) && Mf(e, n),
          (f = a.createElement("script")),
          yt(f),
          At(f, "link", e),
          a.head.appendChild(f)),
        (f = { type: "script", instance: f, count: 1, state: null }),
        i.set(s, f));
    }
  }
  function JS(e, n) {
    or.M(e, n);
    var a = so;
    if (a && e) {
      var i = Oa(a).hoistableScripts,
        s = fo(e),
        f = i.get(s);
      f ||
        ((f = a.querySelector(Rl(s))),
        f ||
          ((e = v({ src: e, async: !0, type: "module" }, n)),
          (n = hn.get(s)) && Mf(e, n),
          (f = a.createElement("script")),
          yt(f),
          At(f, "link", e),
          a.head.appendChild(f)),
        (f = { type: "script", instance: f, count: 1, state: null }),
        i.set(s, f));
    }
  }
  function Ig(e, n, a, i) {
    var s = (s = ne.current) ? hc(s) : null;
    if (!s) throw Error(l(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string"
          ? ((n = uo(a.href)),
            (a = Oa(s).hoistableStyles),
            (i = a.get(n)),
            i ||
              ((i = { type: "style", instance: null, count: 0, state: null }),
              a.set(n, i)),
            i)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          a.rel === "stylesheet" &&
          typeof a.href == "string" &&
          typeof a.precedence == "string"
        ) {
          e = uo(a.href);
          var f = Oa(s).hoistableStyles,
            b = f.get(e);
          if (
            (b ||
              ((s = s.ownerDocument || s),
              (b = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              f.set(e, b),
              (f = s.querySelector(Cl(e))) &&
                !f._p &&
                ((b.instance = f), (b.state.loading = 5)),
              hn.has(e) ||
                ((a = {
                  rel: "preload",
                  as: "style",
                  href: a.href,
                  crossOrigin: a.crossOrigin,
                  integrity: a.integrity,
                  media: a.media,
                  hrefLang: a.hrefLang,
                  referrerPolicy: a.referrerPolicy,
                }),
                hn.set(e, a),
                f || WS(s, e, a, b.state))),
            n && i === null)
          )
            throw Error(l(528, ""));
          return b;
        }
        if (n && i !== null) throw Error(l(529, ""));
        return null;
      case "script":
        return (
          (n = a.async),
          (a = a.src),
          typeof a == "string" &&
          n &&
          typeof n != "function" &&
          typeof n != "symbol"
            ? ((n = fo(a)),
              (a = Oa(s).hoistableScripts),
              (i = a.get(n)),
              i ||
                ((i = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                a.set(n, i)),
              i)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(l(444, e));
    }
  }
  function uo(e) {
    return 'href="' + on(e) + '"';
  }
  function Cl(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function qg(e) {
    return v({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function WS(e, n, a, i) {
    e.querySelector('link[rel="preload"][as="style"][' + n + "]")
      ? (i.loading = 1)
      : ((n = e.createElement("link")),
        (i.preload = n),
        n.addEventListener("load", function () {
          return (i.loading |= 1);
        }),
        n.addEventListener("error", function () {
          return (i.loading |= 2);
        }),
        At(n, "link", a),
        yt(n),
        e.head.appendChild(n));
  }
  function fo(e) {
    return '[src="' + on(e) + '"]';
  }
  function Rl(e) {
    return "script[async]" + e;
  }
  function Pg(e, n, a) {
    if ((n.count++, n.instance === null))
      switch (n.type) {
        case "style":
          var i = e.querySelector('style[data-href~="' + on(a.href) + '"]');
          if (i) return (n.instance = i), yt(i), i;
          var s = v({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null,
          });
          return (
            (i = (e.ownerDocument || e).createElement("style")),
            yt(i),
            At(i, "style", s),
            mc(i, a.precedence, e),
            (n.instance = i)
          );
        case "stylesheet":
          s = uo(a.href);
          var f = e.querySelector(Cl(s));
          if (f) return (n.state.loading |= 4), (n.instance = f), yt(f), f;
          (i = qg(a)),
            (s = hn.get(s)) && zf(i, s),
            (f = (e.ownerDocument || e).createElement("link")),
            yt(f);
          var b = f;
          return (
            (b._p = new Promise(function (S, A) {
              (b.onload = S), (b.onerror = A);
            })),
            At(f, "link", i),
            (n.state.loading |= 4),
            mc(f, a.precedence, e),
            (n.instance = f)
          );
        case "script":
          return (
            (f = fo(a.src)),
            (s = e.querySelector(Rl(f)))
              ? ((n.instance = s), yt(s), s)
              : ((i = a),
                (s = hn.get(f)) && ((i = v({}, a)), Mf(i, s)),
                (e = e.ownerDocument || e),
                (s = e.createElement("script")),
                yt(s),
                At(s, "link", i),
                e.head.appendChild(s),
                (n.instance = s))
          );
        case "void":
          return null;
        default:
          throw Error(l(443, n.type));
      }
    else
      n.type === "stylesheet" &&
        (n.state.loading & 4) === 0 &&
        ((i = n.instance), (n.state.loading |= 4), mc(i, a.precedence, e));
    return n.instance;
  }
  function mc(e, n, a) {
    for (
      var i = a.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]'
        ),
        s = i.length ? i[i.length - 1] : null,
        f = s,
        b = 0;
      b < i.length;
      b++
    ) {
      var S = i[b];
      if (S.dataset.precedence === n) f = S;
      else if (f !== s) break;
    }
    f
      ? f.parentNode.insertBefore(e, f.nextSibling)
      : ((n = a.nodeType === 9 ? a.head : a), n.insertBefore(e, n.firstChild));
  }
  function zf(e, n) {
    e.crossOrigin == null && (e.crossOrigin = n.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = n.referrerPolicy),
      e.title == null && (e.title = n.title);
  }
  function Mf(e, n) {
    e.crossOrigin == null && (e.crossOrigin = n.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = n.referrerPolicy),
      e.integrity == null && (e.integrity = n.integrity);
  }
  var pc = null;
  function Xg(e, n, a) {
    if (pc === null) {
      var i = new Map(),
        s = (pc = new Map());
      s.set(a, i);
    } else (s = pc), (i = s.get(a)), i || ((i = new Map()), s.set(a, i));
    if (i.has(e)) return i;
    for (
      i.set(e, null), a = a.getElementsByTagName(e), s = 0;
      s < a.length;
      s++
    ) {
      var f = a[s];
      if (
        !(
          f[Vn] ||
          f[qe] ||
          (e === "link" && f.getAttribute("rel") === "stylesheet")
        ) &&
        f.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var b = f.getAttribute(n) || "";
        b = e + b;
        var S = i.get(b);
        S ? S.push(f) : i.set(b, [f]);
      }
    }
    return i;
  }
  function Kg(e, n, a) {
    (e = e.ownerDocument || e),
      e.head.insertBefore(
        a,
        n === "title" ? e.querySelector("head > title") : null
      );
  }
  function ew(e, n, a) {
    if (a === 1 || n.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof n.precedence != "string" ||
          typeof n.href != "string" ||
          n.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof n.rel != "string" ||
          typeof n.href != "string" ||
          n.href === "" ||
          n.onLoad ||
          n.onError
        )
          break;
        switch (n.rel) {
          case "stylesheet":
            return (
              (e = n.disabled), typeof n.precedence == "string" && e == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          n.async &&
          typeof n.async != "function" &&
          typeof n.async != "symbol" &&
          !n.onLoad &&
          !n.onError &&
          n.src &&
          typeof n.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Qg(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var Al = null;
  function tw() {}
  function nw(e, n, a) {
    if (Al === null) throw Error(l(475));
    var i = Al;
    if (
      n.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var s = uo(a.href),
          f = e.querySelector(Cl(s));
        if (f) {
          (e = f._p),
            e !== null &&
              typeof e == "object" &&
              typeof e.then == "function" &&
              (i.count++, (i = gc.bind(i)), e.then(i, i)),
            (n.state.loading |= 4),
            (n.instance = f),
            yt(f);
          return;
        }
        (f = e.ownerDocument || e),
          (a = qg(a)),
          (s = hn.get(s)) && zf(a, s),
          (f = f.createElement("link")),
          yt(f);
        var b = f;
        (b._p = new Promise(function (S, A) {
          (b.onload = S), (b.onerror = A);
        })),
          At(f, "link", a),
          (n.instance = f);
      }
      i.stylesheets === null && (i.stylesheets = new Map()),
        i.stylesheets.set(n, e),
        (e = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (i.count++,
          (n = gc.bind(i)),
          e.addEventListener("load", n),
          e.addEventListener("error", n));
    }
  }
  function rw() {
    if (Al === null) throw Error(l(475));
    var e = Al;
    return (
      e.stylesheets && e.count === 0 && kf(e, e.stylesheets),
      0 < e.count
        ? function (n) {
            var a = setTimeout(function () {
              if ((e.stylesheets && kf(e, e.stylesheets), e.unsuspend)) {
                var i = e.unsuspend;
                (e.unsuspend = null), i();
              }
            }, 6e4);
            return (
              (e.unsuspend = n),
              function () {
                (e.unsuspend = null), clearTimeout(a);
              }
            );
          }
        : null
    );
  }
  function gc() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) kf(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        (this.unsuspend = null), e();
      }
    }
  }
  var vc = null;
  function kf(e, n) {
    (e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++,
        (vc = new Map()),
        n.forEach(aw, e),
        (vc = null),
        gc.call(e));
  }
  function aw(e, n) {
    if (!(n.state.loading & 4)) {
      var a = vc.get(e);
      if (a) var i = a.get(null);
      else {
        (a = new Map()), vc.set(e, a);
        for (
          var s = e.querySelectorAll(
              "link[data-precedence],style[data-precedence]"
            ),
            f = 0;
          f < s.length;
          f++
        ) {
          var b = s[f];
          (b.nodeName === "LINK" || b.getAttribute("media") !== "not all") &&
            (a.set(b.dataset.precedence, b), (i = b));
        }
        i && a.set(null, i);
      }
      (s = n.instance),
        (b = s.getAttribute("data-precedence")),
        (f = a.get(b) || i),
        f === i && a.set(null, s),
        a.set(b, s),
        this.count++,
        (i = gc.bind(this)),
        s.addEventListener("load", i),
        s.addEventListener("error", i),
        f
          ? f.parentNode.insertBefore(s, f.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e),
            e.insertBefore(s, e.firstChild)),
        (n.state.loading |= 4);
    }
  }
  var Tl = {
    $$typeof: j,
    Provider: null,
    Consumer: null,
    _currentValue: $,
    _currentValue2: $,
    _threadCount: 0,
  };
  function ow(e, n, a, i, s, f, b, S) {
    (this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Zo(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Zo(0)),
      (this.hiddenUpdates = Zo(null)),
      (this.identifierPrefix = i),
      (this.onUncaughtError = s),
      (this.onCaughtError = f),
      (this.onRecoverableError = b),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = S),
      (this.incompleteTransitions = new Map());
  }
  function Fg(e, n, a, i, s, f, b, S, A, U, I, K) {
    return (
      (e = new ow(e, n, a, b, S, A, U, K)),
      (n = 1),
      f === !0 && (n |= 24),
      (f = qt(3, null, null, n)),
      (e.current = f),
      (f.stateNode = e),
      (n = pu()),
      n.refCount++,
      (e.pooledCache = n),
      n.refCount++,
      (f.memoizedState = { element: i, isDehydrated: a, cache: n }),
      bu(f),
      e
    );
  }
  function Jg(e) {
    return e ? ((e = Ga), e) : Ga;
  }
  function Wg(e, n, a, i, s, f) {
    (s = Jg(s)),
      i.context === null ? (i.context = s) : (i.pendingContext = s),
      (i = pr(n)),
      (i.payload = { element: a }),
      (f = f === void 0 ? null : f),
      f !== null && (i.callback = f),
      (a = gr(e, i, n)),
      a !== null && (Ft(a, e, n), al(a, e, n));
  }
  function ev(e, n) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < n ? a : n;
    }
  }
  function Lf(e, n) {
    ev(e, n), (e = e.alternate) && ev(e, n);
  }
  function tv(e) {
    if (e.tag === 13) {
      var n = $a(e, 67108864);
      n !== null && Ft(n, e, 67108864), Lf(e, 67108864);
    }
  }
  var yc = !0;
  function lw(e, n, a, i) {
    var s = z.T;
    z.T = null;
    var f = V.p;
    try {
      (V.p = 2), Uf(e, n, a, i);
    } finally {
      (V.p = f), (z.T = s);
    }
  }
  function iw(e, n, a, i) {
    var s = z.T;
    z.T = null;
    var f = V.p;
    try {
      (V.p = 8), Uf(e, n, a, i);
    } finally {
      (V.p = f), (z.T = s);
    }
  }
  function Uf(e, n, a, i) {
    if (yc) {
      var s = Bf(i);
      if (s === null) Ef(e, n, i, bc, a), rv(e, i);
      else if (sw(s, e, n, a, i)) i.stopPropagation();
      else if ((rv(e, i), n & 4 && -1 < cw.indexOf(e))) {
        for (; s !== null; ) {
          var f = Na(s);
          if (f !== null)
            switch (f.tag) {
              case 3:
                if (((f = f.stateNode), f.current.memoizedState.isDehydrated)) {
                  var b = yn(f.pendingLanes);
                  if (b !== 0) {
                    var S = f;
                    for (S.pendingLanes |= 2, S.entangledLanes |= 2; b; ) {
                      var A = 1 << (31 - ht(b));
                      (S.entanglements[1] |= A), (b &= ~A);
                    }
                    Mn(f), (Le & 6) === 0 && ((nc = _t() + 500), Sl(0));
                  }
                }
                break;
              case 13:
                (S = $a(f, 2)), S !== null && Ft(S, f, 2), ac(), Lf(f, 2);
            }
          if (((f = Bf(i)), f === null && Ef(e, n, i, bc, a), f === s)) break;
          s = f;
        }
        s !== null && i.stopPropagation();
      } else Ef(e, n, i, null, a);
    }
  }
  function Bf(e) {
    return (e = Gs(e)), Zf(e);
  }
  var bc = null;
  function Zf(e) {
    if (((bc = null), (e = Ta(e)), e !== null)) {
      var n = u(e);
      if (n === null) e = null;
      else {
        var a = n.tag;
        if (a === 13) {
          if (((e = d(n)), e !== null)) return e;
          e = null;
        } else if (a === 3) {
          if (n.stateNode.current.memoizedState.isDehydrated)
            return n.tag === 3 ? n.stateNode.containerInfo : null;
          e = null;
        } else n !== e && (e = null);
      }
    }
    return (bc = e), null;
  }
  function nv(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (ci()) {
          case Ea:
            return 2;
          case vn:
            return 8;
          case Gn:
          case Ca:
            return 32;
          case Bo:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Hf = !1,
    Nr = null,
    Or = null,
    Dr = null,
    Nl = new Map(),
    Ol = new Map(),
    jr = [],
    cw =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " "
      );
  function rv(e, n) {
    switch (e) {
      case "focusin":
      case "focusout":
        Nr = null;
        break;
      case "dragenter":
      case "dragleave":
        Or = null;
        break;
      case "mouseover":
      case "mouseout":
        Dr = null;
        break;
      case "pointerover":
      case "pointerout":
        Nl.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ol.delete(n.pointerId);
    }
  }
  function Dl(e, n, a, i, s, f) {
    return e === null || e.nativeEvent !== f
      ? ((e = {
          blockedOn: n,
          domEventName: a,
          eventSystemFlags: i,
          nativeEvent: f,
          targetContainers: [s],
        }),
        n !== null && ((n = Na(n)), n !== null && tv(n)),
        e)
      : ((e.eventSystemFlags |= i),
        (n = e.targetContainers),
        s !== null && n.indexOf(s) === -1 && n.push(s),
        e);
  }
  function sw(e, n, a, i, s) {
    switch (n) {
      case "focusin":
        return (Nr = Dl(Nr, e, n, a, i, s)), !0;
      case "dragenter":
        return (Or = Dl(Or, e, n, a, i, s)), !0;
      case "mouseover":
        return (Dr = Dl(Dr, e, n, a, i, s)), !0;
      case "pointerover":
        var f = s.pointerId;
        return Nl.set(f, Dl(Nl.get(f) || null, e, n, a, i, s)), !0;
      case "gotpointercapture":
        return (
          (f = s.pointerId), Ol.set(f, Dl(Ol.get(f) || null, e, n, a, i, s)), !0
        );
    }
    return !1;
  }
  function av(e) {
    var n = Ta(e.target);
    if (n !== null) {
      var a = u(n);
      if (a !== null) {
        if (((n = a.tag), n === 13)) {
          if (((n = d(a)), n !== null)) {
            (e.blockedOn = n),
              ur(e.priority, function () {
                if (a.tag === 13) {
                  var i = Qt();
                  i = Ot(i);
                  var s = $a(a, i);
                  s !== null && Ft(s, a, i), Lf(a, i);
                }
              });
            return;
          }
        } else if (n === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function xc(e) {
    if (e.blockedOn !== null) return !1;
    for (var n = e.targetContainers; 0 < n.length; ) {
      var a = Bf(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var i = new a.constructor(a.type, a);
        ($s = i), a.target.dispatchEvent(i), ($s = null);
      } else return (n = Na(a)), n !== null && tv(n), (e.blockedOn = a), !1;
      n.shift();
    }
    return !0;
  }
  function ov(e, n, a) {
    xc(e) && a.delete(n);
  }
  function uw() {
    (Hf = !1),
      Nr !== null && xc(Nr) && (Nr = null),
      Or !== null && xc(Or) && (Or = null),
      Dr !== null && xc(Dr) && (Dr = null),
      Nl.forEach(ov),
      Ol.forEach(ov);
  }
  function Sc(e, n) {
    e.blockedOn === n &&
      ((e.blockedOn = null),
      Hf ||
        ((Hf = !0),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, uw)));
  }
  var wc = null;
  function lv(e) {
    wc !== e &&
      ((wc = e),
      t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
        wc === e && (wc = null);
        for (var n = 0; n < e.length; n += 3) {
          var a = e[n],
            i = e[n + 1],
            s = e[n + 2];
          if (typeof i != "function") {
            if (Zf(i || a) === null) continue;
            break;
          }
          var f = Na(a);
          f !== null &&
            (e.splice(n, 3),
            (n -= 3),
            Bu(f, { pending: !0, data: s, method: a.method, action: i }, i, s));
        }
      }));
  }
  function jl(e) {
    function n(A) {
      return Sc(A, e);
    }
    Nr !== null && Sc(Nr, e),
      Or !== null && Sc(Or, e),
      Dr !== null && Sc(Dr, e),
      Nl.forEach(n),
      Ol.forEach(n);
    for (var a = 0; a < jr.length; a++) {
      var i = jr[a];
      i.blockedOn === e && (i.blockedOn = null);
    }
    for (; 0 < jr.length && ((a = jr[0]), a.blockedOn === null); )
      av(a), a.blockedOn === null && jr.shift();
    if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
      for (i = 0; i < a.length; i += 3) {
        var s = a[i],
          f = a[i + 1],
          b = s[Pe] || null;
        if (typeof f == "function") b || lv(a);
        else if (b) {
          var S = null;
          if (f && f.hasAttribute("formAction")) {
            if (((s = f), (b = f[Pe] || null))) S = b.formAction;
            else if (Zf(s) !== null) continue;
          } else S = b.action;
          typeof S == "function" ? (a[i + 1] = S) : (a.splice(i, 3), (i -= 3)),
            lv(a);
        }
      }
  }
  function $f(e) {
    this._internalRoot = e;
  }
  (_c.prototype.render = $f.prototype.render =
    function (e) {
      var n = this._internalRoot;
      if (n === null) throw Error(l(409));
      var a = n.current,
        i = Qt();
      Wg(a, i, e, n, null, null);
    }),
    (_c.prototype.unmount = $f.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var n = e.containerInfo;
          Wg(e.current, 2, null, e, null, null), ac(), (n[Dt] = null);
        }
      });
  function _c(e) {
    this._internalRoot = e;
  }
  _c.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var n = Vt();
      e = { blockedOn: null, target: e, priority: n };
      for (var a = 0; a < jr.length && n !== 0 && n < jr[a].priority; a++);
      jr.splice(a, 0, e), a === 0 && av(e);
    }
  };
  var iv = r.version;
  if (iv !== "19.1.1") throw Error(l(527, iv, "19.1.1"));
  V.findDOMNode = function (e) {
    var n = e._reactInternals;
    if (n === void 0)
      throw typeof e.render == "function"
        ? Error(l(188))
        : ((e = Object.keys(e).join(",")), Error(l(268, e)));
    return (
      (e = p(n)),
      (e = e !== null ? m(e) : null),
      (e = e === null ? null : e.stateNode),
      e
    );
  };
  var fw = {
    bundleType: 0,
    version: "19.1.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: z,
    reconcilerVersion: "19.1.1",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ec = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ec.isDisabled && Ec.supportsFiber)
      try {
        (qr = Ec.inject(fw)), (ct = Ec);
      } catch {}
  }
  return (
    (Ml.createRoot = function (e, n) {
      if (!c(e)) throw Error(l(299));
      var a = !1,
        i = "",
        s = _p,
        f = Ep,
        b = Cp,
        S = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (a = !0),
          n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (s = n.onUncaughtError),
          n.onCaughtError !== void 0 && (f = n.onCaughtError),
          n.onRecoverableError !== void 0 && (b = n.onRecoverableError),
          n.unstable_transitionCallbacks !== void 0 &&
            (S = n.unstable_transitionCallbacks)),
        (n = Fg(e, 1, !1, null, null, a, i, s, f, b, S, null)),
        (e[Dt] = n.current),
        _f(e),
        new $f(n)
      );
    }),
    (Ml.hydrateRoot = function (e, n, a) {
      if (!c(e)) throw Error(l(299));
      var i = !1,
        s = "",
        f = _p,
        b = Ep,
        S = Cp,
        A = null,
        U = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (i = !0),
          a.identifierPrefix !== void 0 && (s = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (f = a.onUncaughtError),
          a.onCaughtError !== void 0 && (b = a.onCaughtError),
          a.onRecoverableError !== void 0 && (S = a.onRecoverableError),
          a.unstable_transitionCallbacks !== void 0 &&
            (A = a.unstable_transitionCallbacks),
          a.formState !== void 0 && (U = a.formState)),
        (n = Fg(e, 1, !0, n, a ?? null, i, s, f, b, S, A, U)),
        (n.context = Jg(null)),
        (a = n.current),
        (i = Qt()),
        (i = Ot(i)),
        (s = pr(i)),
        (s.callback = null),
        gr(a, s, i),
        (a = i),
        (n.current.lanes = a),
        We(n, a),
        Mn(n),
        (e[Dt] = n.current),
        _f(e),
        new _c(n)
      );
    }),
    (Ml.version = "19.1.1"),
    Ml
  );
}
var vv;
function Sw() {
  if (vv) return Vf.exports;
  vv = 1;
  function t() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
      } catch (r) {
        console.error(r);
      }
  }
  return t(), (Vf.exports = xw()), Vf.exports;
}
var ww = Sw();
const _w = "pace mid-long fans 12",
  Ew = ["spd", "sta", "pwr", "wit", "guts"],
  Cw = [1.6, 1.5, 1, 0, -1],
  Rw = 1,
  Aw = 25,
  Tw = 65,
  Nw = 20,
  Ow = "GREAT",
  Dw = "NONE",
  jw = "NORMAL",
  zw = 15,
  Mw = !0,
  kw = !0,
  Lw = !0,
  Uw = !0,
  Bw = "pace",
  Zw = { sprint: "pace", mile: "pace", medium: "pace", long: "pace" },
  Hw = [
    { name: "Satsuki Sho", year: "Classic Year", date: "Early Apr" },
    {
      name: "Tokyo Yushun Japanese Derby",
      year: "Classic Year",
      date: "Late May",
    },
    { name: "Kikuka Sho", year: "Classic Year", date: "Late Oct" },
    { name: "Hopeful Stakes", date: "Late Dec", year: "Junior Year" },
    { name: "Takarazuka Kinen", date: "Late Jun", year: "Classic Year" },
    { name: "Japan Cup", date: "Late Nov", year: "Classic Year" },
    { name: "Arima Kinen", date: "Late Dec", year: "Classic Year" },
    { name: "Osaka Hai", date: "Late Mar", year: "Senior Year" },
    { name: "Tenno Sho Spring", date: "Late Apr", year: "Senior Year" },
    { name: "Takarazuka Kinen", date: "Late Jun", year: "Senior Year" },
    { name: "Tenno Sho Autumn", date: "Late Oct", year: "Senior Year" },
    { name: "Japan Cup", date: "Late Nov", year: "Senior Year" },
    { name: "Arima Kinen", date: "Late Dec", year: "Senior Year" },
  ],
  $w = { spd: 1200, sta: 600, pwr: 550, guts: 550, wit: 550 },
  Gw = {
    is_auto_buy_skill: !0,
    skill_pts_check: 400,
    skill_list: [
      "Hydrate",
      "Gourmand",
      "Breath of Fresh Air",
      "Straightaway Recovery",
      "Corner Recovery ○",
      "Groundwork",
      "Tactical Tweak",
      "Shatterproof",
      "Straightaway Acceleration",
      "Rushing Gale!",
      "Corner Acceleration ○",
      "Corner Connoisseur",
      "Homestretch Haste",
      "Go with the Flow",
      "Focus",
      "Concentration",
      "Red Shift/LP1211-M",
      "U=ma2",
      "Professor of Curvature",
      "Swinging Maestro",
    ],
  },
  Yw = {
    use_optimal_event_choice: !0,
    event_choices: [
      {
        event_name: "Ah, Friendship",
        character_name:
          "Kitasan Black (Fire at My Heels), Kitasan Black (Tracen Academy)",
        chosen: 2,
      },
      {
        event_name: "Paying it Forward",
        character_name: "Kitasan Black (Fire at My Heels)",
        chosen: 1,
      },
      {
        event_name: "Best Foot Forward!",
        character_name: "URA Finale",
        chosen: 2,
      },
    ],
  },
  Vw = "LDPlayer",
  hd = {
    config_name: _w,
    priority_stat: Ew,
    priority_weights: Cw,
    sleep_time_multiplier: Rw,
    skip_training_energy: Aw,
    never_rest_energy: Tw,
    skip_infirmary_unless_missing_energy: Nw,
    minimum_mood: Ow,
    priority_weight: Dw,
    minimum_mood_junior_year: jw,
    maximum_failure: zw,
    prioritize_g1_race: Mw,
    cancel_consecutive_race: kw,
    position_selection_enabled: Lw,
    enable_positions_by_race: Uw,
    preferred_position: Bw,
    positions_by_race: Zw,
    race_schedule: Hw,
    stat_caps: $w,
    skill: Gw,
    event: Yw,
    window_name: Vw,
  },
  kl = "uma-config",
  Iw = 10,
  ky = (t, r) => {
    const o = {};
    for (const l in r)
      r[l] && typeof r[l] == "object" && !Array.isArray(r[l])
        ? (o[l] = ky(t[l] ?? {}, r[l]))
        : (o[l] = t[l] !== void 0 ? t[l] : r[l]);
    return o;
  };
function qw() {
  const [t, r] = y.useState({ index: 0, presets: [] }),
    [o, l] = y.useState(0);
  y.useEffect(() => {
    const d = localStorage.getItem(kl);
    if (d) {
      const h = JSON.parse(d),
        p = h.presets.map((v) => ({ ...v, config: ky(v.config, hd) })),
        m = { ...h, presets: p };
      r(m), l(h.index), localStorage.setItem(kl, JSON.stringify(m));
    } else {
      const p = {
        index: 0,
        presets: Array.from({ length: Iw }, (m, v) => ({
          name: `Preset ${v + 1}`,
          config: hd,
        })),
      };
      localStorage.setItem(kl, JSON.stringify(p)), r(p), l(0);
    }
  }, []);
  const c = (d, h) => {
      r((p) => {
        const m = [...p.presets];
        m[d] = { name: h.config_name || `Preset ${d + 1}`, config: h };
        const v = { ...p, presets: m };
        return localStorage.setItem(kl, JSON.stringify(v)), v;
      });
    },
    u = (d) => {
      r((h) => {
        const p = [...h.presets];
        p[o] = { name: d.config_name || `Preset ${o + 1}`, config: d };
        const m = { ...h, index: o, presets: p };
        return localStorage.setItem(kl, JSON.stringify(m)), m;
      });
    };
  return {
    activeIndex: o,
    activeConfig: t.presets[o]?.config,
    presets: t.presets,
    setActiveIndex: l,
    updatePreset: c,
    savePreset: u,
  };
}
const yv = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT"],
  Pw = {
    HEAVY:
      "Strongly focuses on prioritized stats. A training with fewer supports can still get picked (+75%).",
    MEDIUM:
      "Moderately focuses on prioritized stats but still considers support count (+50%).",
    LIGHT:
      "Slightly focuses on prioritized stats. Usually goes for trainings with more supports (+25%).",
    NONE: "Doesn't focus on main stats at all, just picks based on support count only.",
  },
  Ly = ["front", "pace", "late", "end"],
  md = "http://127.0.0.1:8000";
function Xw(t) {
  const [r, o] = y.useState(t);
  return (
    y.useEffect(() => {
      (async () => {
        try {
          const d = await (await fetch(`${md}/config`)).json();
          o(d);
        } catch (u) {
          console.log(u);
        }
      })();
    }, []),
    {
      config: r,
      setConfig: o,
      saveConfig: async () => {
        try {
          const c = await fetch(`${md}/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          });
          if (!c.ok) throw new Error(`HTTP error! status: ${c.status}`);
          const u = await c.json();
          console.log("Saved config:", u), alert("Config saved!");
        } catch (c) {
          console.log(c);
        }
      },
    }
  );
}
function X(t, r, o) {
  function l(h, p) {
    var m;
    Object.defineProperty(h, "_zod", { value: h._zod ?? {}, enumerable: !1 }),
      (m = h._zod).traits ?? (m.traits = new Set()),
      h._zod.traits.add(t),
      r(h, p);
    for (const v in d.prototype)
      v in h || Object.defineProperty(h, v, { value: d.prototype[v].bind(h) });
    (h._zod.constr = d), (h._zod.def = p);
  }
  const c = o?.Parent ?? Object;
  class u extends c {}
  Object.defineProperty(u, "name", { value: t });
  function d(h) {
    var p;
    const m = o?.Parent ? new u() : this;
    l(m, h), (p = m._zod).deferred ?? (p.deferred = []);
    for (const v of m._zod.deferred) v();
    return m;
  }
  return (
    Object.defineProperty(d, "init", { value: l }),
    Object.defineProperty(d, Symbol.hasInstance, {
      value: (h) =>
        o?.Parent && h instanceof o.Parent ? !0 : h?._zod?.traits?.has(t),
    }),
    Object.defineProperty(d, "name", { value: t }),
    d
  );
}
class bo extends Error {
  constructor() {
    super(
      "Encountered Promise during synchronous parse. Use .parseAsync() instead."
    );
  }
}
class Uy extends Error {
  constructor(r) {
    super(`Encountered unidirectional transform during encode: ${r}`),
      (this.name = "ZodEncodeError");
  }
}
const By = {};
function ma(t) {
  return By;
}
function Kw(t) {
  const r = Object.values(t).filter((l) => typeof l == "number");
  return Object.entries(t)
    .filter(([l, c]) => r.indexOf(+l) === -1)
    .map(([l, c]) => c);
}
function pd(t, r) {
  return typeof r == "bigint" ? r.toString() : r;
}
function Hd(t) {
  return {
    get value() {
      {
        const r = t();
        return Object.defineProperty(this, "value", { value: r }), r;
      }
    },
  };
}
function $d(t) {
  return t == null;
}
function Gd(t) {
  const r = t.startsWith("^") ? 1 : 0,
    o = t.endsWith("$") ? t.length - 1 : t.length;
  return t.slice(r, o);
}
function Qw(t, r) {
  const o = (t.toString().split(".")[1] || "").length,
    l = r.toString();
  let c = (l.split(".")[1] || "").length;
  if (c === 0 && /\d?e-\d?/.test(l)) {
    const p = l.match(/\d?e-(\d?)/);
    p?.[1] && (c = Number.parseInt(p[1]));
  }
  const u = o > c ? o : c,
    d = Number.parseInt(t.toFixed(u).replace(".", "")),
    h = Number.parseInt(r.toFixed(u).replace(".", ""));
  return (d % h) / 10 ** u;
}
const bv = Symbol("evaluating");
function Ie(t, r, o) {
  let l;
  Object.defineProperty(t, r, {
    get() {
      if (l !== bv) return l === void 0 && ((l = bv), (l = o())), l;
    },
    set(c) {
      Object.defineProperty(t, r, { value: c });
    },
    configurable: !0,
  });
}
function wa(t, r, o) {
  Object.defineProperty(t, r, {
    value: o,
    writable: !0,
    enumerable: !0,
    configurable: !0,
  });
}
function _a(...t) {
  const r = {};
  for (const o of t) {
    const l = Object.getOwnPropertyDescriptors(o);
    Object.assign(r, l);
  }
  return Object.defineProperties({}, r);
}
function xv(t) {
  return JSON.stringify(t);
}
const Zy =
  "captureStackTrace" in Error ? Error.captureStackTrace : (...t) => {};
function qc(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
const Fw = Hd(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const t = Function;
    return new t(""), !0;
  } catch {
    return !1;
  }
});
function $l(t) {
  if (qc(t) === !1) return !1;
  const r = t.constructor;
  if (r === void 0) return !0;
  const o = r.prototype;
  return !(
    qc(o) === !1 ||
    Object.prototype.hasOwnProperty.call(o, "isPrototypeOf") === !1
  );
}
function Hy(t) {
  return $l(t) ? { ...t } : Array.isArray(t) ? [...t] : t;
}
const Jw = new Set(["string", "number", "symbol"]);
function us(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Gr(t, r, o) {
  const l = new t._zod.constr(r ?? t._zod.def);
  return (!r || o?.parent) && (l._zod.parent = t), l;
}
function pe(t) {
  const r = t;
  if (!r) return {};
  if (typeof r == "string") return { error: () => r };
  if (r?.message !== void 0) {
    if (r?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    r.error = r.message;
  }
  return (
    delete r.message,
    typeof r.error == "string" ? { ...r, error: () => r.error } : r
  );
}
function Ww(t) {
  return Object.keys(t).filter(
    (r) => t[r]._zod.optin === "optional" && t[r]._zod.optout === "optional"
  );
}
const e_ = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
function t_(t, r) {
  const o = t._zod.def,
    l = _a(t._zod.def, {
      get shape() {
        const c = {};
        for (const u in r) {
          if (!(u in o.shape)) throw new Error(`Unrecognized key: "${u}"`);
          r[u] && (c[u] = o.shape[u]);
        }
        return wa(this, "shape", c), c;
      },
      checks: [],
    });
  return Gr(t, l);
}
function n_(t, r) {
  const o = t._zod.def,
    l = _a(t._zod.def, {
      get shape() {
        const c = { ...t._zod.def.shape };
        for (const u in r) {
          if (!(u in o.shape)) throw new Error(`Unrecognized key: "${u}"`);
          r[u] && delete c[u];
        }
        return wa(this, "shape", c), c;
      },
      checks: [],
    });
  return Gr(t, l);
}
function r_(t, r) {
  if (!$l(r))
    throw new Error("Invalid input to extend: expected a plain object");
  const o = t._zod.def.checks;
  if (o && o.length > 0)
    throw new Error(
      "Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead."
    );
  const c = _a(t._zod.def, {
    get shape() {
      const u = { ...t._zod.def.shape, ...r };
      return wa(this, "shape", u), u;
    },
    checks: [],
  });
  return Gr(t, c);
}
function a_(t, r) {
  if (!$l(r))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const o = {
    ...t._zod.def,
    get shape() {
      const l = { ...t._zod.def.shape, ...r };
      return wa(this, "shape", l), l;
    },
    checks: t._zod.def.checks,
  };
  return Gr(t, o);
}
function o_(t, r) {
  const o = _a(t._zod.def, {
    get shape() {
      const l = { ...t._zod.def.shape, ...r._zod.def.shape };
      return wa(this, "shape", l), l;
    },
    get catchall() {
      return r._zod.def.catchall;
    },
    checks: [],
  });
  return Gr(t, o);
}
function l_(t, r, o) {
  const l = _a(r._zod.def, {
    get shape() {
      const c = r._zod.def.shape,
        u = { ...c };
      if (o)
        for (const d in o) {
          if (!(d in c)) throw new Error(`Unrecognized key: "${d}"`);
          o[d] &&
            (u[d] = t ? new t({ type: "optional", innerType: c[d] }) : c[d]);
        }
      else
        for (const d in c)
          u[d] = t ? new t({ type: "optional", innerType: c[d] }) : c[d];
      return wa(this, "shape", u), u;
    },
    checks: [],
  });
  return Gr(r, l);
}
function i_(t, r, o) {
  const l = _a(r._zod.def, {
    get shape() {
      const c = r._zod.def.shape,
        u = { ...c };
      if (o)
        for (const d in o) {
          if (!(d in u)) throw new Error(`Unrecognized key: "${d}"`);
          o[d] && (u[d] = new t({ type: "nonoptional", innerType: c[d] }));
        }
      else
        for (const d in c)
          u[d] = new t({ type: "nonoptional", innerType: c[d] });
      return wa(this, "shape", u), u;
    },
    checks: [],
  });
  return Gr(r, l);
}
function vo(t, r = 0) {
  if (t.aborted === !0) return !0;
  for (let o = r; o < t.issues.length; o++)
    if (t.issues[o]?.continue !== !0) return !0;
  return !1;
}
function $y(t, r) {
  return r.map((o) => {
    var l;
    return (l = o).path ?? (l.path = []), o.path.unshift(t), o;
  });
}
function Cc(t) {
  return typeof t == "string" ? t : t?.message;
}
function pa(t, r, o) {
  const l = { ...t, path: t.path ?? [] };
  if (!t.message) {
    const c =
      Cc(t.inst?._zod.def?.error?.(t)) ??
      Cc(r?.error?.(t)) ??
      Cc(o.customError?.(t)) ??
      Cc(o.localeError?.(t)) ??
      "Invalid input";
    l.message = c;
  }
  return delete l.inst, delete l.continue, r?.reportInput || delete l.input, l;
}
function Yd(t) {
  return Array.isArray(t)
    ? "array"
    : typeof t == "string"
    ? "string"
    : "unknown";
}
function Gl(...t) {
  const [r, o, l] = t;
  return typeof r == "string"
    ? { message: r, code: "custom", input: o, inst: l }
    : { ...r };
}
const Gy = (t, r) => {
    (t.name = "$ZodError"),
      Object.defineProperty(t, "_zod", { value: t._zod, enumerable: !1 }),
      Object.defineProperty(t, "issues", { value: r, enumerable: !1 }),
      (t.message = JSON.stringify(r, pd, 2)),
      Object.defineProperty(t, "toString", {
        value: () => t.message,
        enumerable: !1,
      });
  },
  Yy = X("$ZodError", Gy),
  Vy = X("$ZodError", Gy, { Parent: Error });
function c_(t, r = (o) => o.message) {
  const o = {},
    l = [];
  for (const c of t.issues)
    c.path.length > 0
      ? ((o[c.path[0]] = o[c.path[0]] || []), o[c.path[0]].push(r(c)))
      : l.push(r(c));
  return { formErrors: l, fieldErrors: o };
}
function s_(t, r = (o) => o.message) {
  const o = { _errors: [] },
    l = (c) => {
      for (const u of c.issues)
        if (u.code === "invalid_union" && u.errors.length)
          u.errors.map((d) => l({ issues: d }));
        else if (u.code === "invalid_key") l({ issues: u.issues });
        else if (u.code === "invalid_element") l({ issues: u.issues });
        else if (u.path.length === 0) o._errors.push(r(u));
        else {
          let d = o,
            h = 0;
          for (; h < u.path.length; ) {
            const p = u.path[h];
            h === u.path.length - 1
              ? ((d[p] = d[p] || { _errors: [] }), d[p]._errors.push(r(u)))
              : (d[p] = d[p] || { _errors: [] }),
              (d = d[p]),
              h++;
          }
        }
    };
  return l(t), o;
}
function u_(t, r = (o) => o.message) {
  const o = { errors: [] },
    l = (c, u = []) => {
      var d, h;
      for (const p of c.issues)
        if (p.code === "invalid_union" && p.errors.length)
          p.errors.map((m) => l({ issues: m }, p.path));
        else if (p.code === "invalid_key") l({ issues: p.issues }, p.path);
        else if (p.code === "invalid_element") l({ issues: p.issues }, p.path);
        else {
          const m = [...u, ...p.path];
          if (m.length === 0) {
            o.errors.push(r(p));
            continue;
          }
          let v = o,
            x = 0;
          for (; x < m.length; ) {
            const _ = m[x],
              E = x === m.length - 1;
            typeof _ == "string"
              ? (v.properties ?? (v.properties = {}),
                (d = v.properties)[_] ?? (d[_] = { errors: [] }),
                (v = v.properties[_]))
              : (v.items ?? (v.items = []),
                (h = v.items)[_] ?? (h[_] = { errors: [] }),
                (v = v.items[_])),
              E && v.errors.push(r(p)),
              x++;
          }
        }
    };
  return l(t), o;
}
const Vd = (t) => (r, o, l, c) => {
    const u = l ? Object.assign(l, { async: !1 }) : { async: !1 },
      d = r._zod.run({ value: o, issues: [] }, u);
    if (d instanceof Promise) throw new bo();
    if (d.issues.length) {
      const h = new (c?.Err ?? t)(d.issues.map((p) => pa(p, u, ma())));
      throw (Zy(h, c?.callee), h);
    }
    return d.value;
  },
  Id = (t) => async (r, o, l, c) => {
    const u = l ? Object.assign(l, { async: !0 }) : { async: !0 };
    let d = r._zod.run({ value: o, issues: [] }, u);
    if ((d instanceof Promise && (d = await d), d.issues.length)) {
      const h = new (c?.Err ?? t)(d.issues.map((p) => pa(p, u, ma())));
      throw (Zy(h, c?.callee), h);
    }
    return d.value;
  },
  fs = (t) => (r, o, l) => {
    const c = l ? { ...l, async: !1 } : { async: !1 },
      u = r._zod.run({ value: o, issues: [] }, c);
    if (u instanceof Promise) throw new bo();
    return u.issues.length
      ? {
          success: !1,
          error: new (t ?? Yy)(u.issues.map((d) => pa(d, c, ma()))),
        }
      : { success: !0, data: u.value };
  },
  f_ = fs(Vy),
  ds = (t) => async (r, o, l) => {
    const c = l ? Object.assign(l, { async: !0 }) : { async: !0 };
    let u = r._zod.run({ value: o, issues: [] }, c);
    return (
      u instanceof Promise && (u = await u),
      u.issues.length
        ? { success: !1, error: new t(u.issues.map((d) => pa(d, c, ma()))) }
        : { success: !0, data: u.value }
    );
  },
  d_ = ds(Vy),
  h_ = (t) => (r, o, l) => {
    const c = l
      ? Object.assign(l, { direction: "backward" })
      : { direction: "backward" };
    return Vd(t)(r, o, c);
  },
  m_ = (t) => (r, o, l) => Vd(t)(r, o, l),
  p_ = (t) => async (r, o, l) => {
    const c = l
      ? Object.assign(l, { direction: "backward" })
      : { direction: "backward" };
    return Id(t)(r, o, c);
  },
  g_ = (t) => async (r, o, l) => Id(t)(r, o, l),
  v_ = (t) => (r, o, l) => {
    const c = l
      ? Object.assign(l, { direction: "backward" })
      : { direction: "backward" };
    return fs(t)(r, o, c);
  },
  y_ = (t) => (r, o, l) => fs(t)(r, o, l),
  b_ = (t) => async (r, o, l) => {
    const c = l
      ? Object.assign(l, { direction: "backward" })
      : { direction: "backward" };
    return ds(t)(r, o, c);
  },
  x_ = (t) => async (r, o, l) => ds(t)(r, o, l),
  S_ = /^[cC][^\s-]{8,}$/,
  w_ = /^[0-9a-z]+$/,
  __ = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
  E_ = /^[0-9a-vA-V]{20}$/,
  C_ = /^[A-Za-z0-9]{27}$/,
  R_ = /^[a-zA-Z0-9_-]{21}$/,
  A_ =
    /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
  T_ =
    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  Sv = (t) =>
    t
      ? new RegExp(
          `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${t}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`
        )
      : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
  N_ =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
  O_ = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function D_() {
  return new RegExp(O_, "u");
}
const j_ =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  z_ =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
  M_ =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
  k_ =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  L_ =
    /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
  Iy = /^[A-Za-z0-9_-]*$/,
  U_ =
    /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,
  B_ = /^\+(?:[0-9]){6,14}[0-9]$/,
  qy =
    "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",
  Z_ = new RegExp(`^${qy}$`);
function Py(t) {
  const r = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof t.precision == "number"
    ? t.precision === -1
      ? `${r}`
      : t.precision === 0
      ? `${r}:[0-5]\\d`
      : `${r}:[0-5]\\d\\.\\d{${t.precision}}`
    : `${r}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function H_(t) {
  return new RegExp(`^${Py(t)}$`);
}
function $_(t) {
  const r = Py({ precision: t.precision }),
    o = ["Z"];
  t.local && o.push(""),
    t.offset && o.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const l = `${r}(?:${o.join("|")})`;
  return new RegExp(`^${qy}T(?:${l})$`);
}
const G_ = (t) => {
    const r = t
      ? `[\\s\\S]{${t?.minimum ?? 0},${t?.maximum ?? ""}}`
      : "[\\s\\S]*";
    return new RegExp(`^${r}$`);
  },
  Y_ = /^-?\d+$/,
  V_ = /^-?\d+(?:\.\d+)?/,
  I_ = /^(?:true|false)$/i,
  q_ = /^[^A-Z]*$/,
  P_ = /^[^a-z]*$/,
  Gt = X("$ZodCheck", (t, r) => {
    var o;
    t._zod ?? (t._zod = {}),
      (t._zod.def = r),
      (o = t._zod).onattach ?? (o.onattach = []);
  }),
  Xy = { number: "number", bigint: "bigint", object: "date" },
  Ky = X("$ZodCheckLessThan", (t, r) => {
    Gt.init(t, r);
    const o = Xy[typeof r.value];
    t._zod.onattach.push((l) => {
      const c = l._zod.bag,
        u =
          (r.inclusive ? c.maximum : c.exclusiveMaximum) ??
          Number.POSITIVE_INFINITY;
      r.value < u &&
        (r.inclusive ? (c.maximum = r.value) : (c.exclusiveMaximum = r.value));
    }),
      (t._zod.check = (l) => {
        (r.inclusive ? l.value <= r.value : l.value < r.value) ||
          l.issues.push({
            origin: o,
            code: "too_big",
            maximum: r.value,
            input: l.value,
            inclusive: r.inclusive,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  Qy = X("$ZodCheckGreaterThan", (t, r) => {
    Gt.init(t, r);
    const o = Xy[typeof r.value];
    t._zod.onattach.push((l) => {
      const c = l._zod.bag,
        u =
          (r.inclusive ? c.minimum : c.exclusiveMinimum) ??
          Number.NEGATIVE_INFINITY;
      r.value > u &&
        (r.inclusive ? (c.minimum = r.value) : (c.exclusiveMinimum = r.value));
    }),
      (t._zod.check = (l) => {
        (r.inclusive ? l.value >= r.value : l.value > r.value) ||
          l.issues.push({
            origin: o,
            code: "too_small",
            minimum: r.value,
            input: l.value,
            inclusive: r.inclusive,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  X_ = X("$ZodCheckMultipleOf", (t, r) => {
    Gt.init(t, r),
      t._zod.onattach.push((o) => {
        var l;
        (l = o._zod.bag).multipleOf ?? (l.multipleOf = r.value);
      }),
      (t._zod.check = (o) => {
        if (typeof o.value != typeof r.value)
          throw new Error("Cannot mix number and bigint in multiple_of check.");
        (typeof o.value == "bigint"
          ? o.value % r.value === BigInt(0)
          : Qw(o.value, r.value) === 0) ||
          o.issues.push({
            origin: typeof o.value,
            code: "not_multiple_of",
            divisor: r.value,
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  K_ = X("$ZodCheckNumberFormat", (t, r) => {
    Gt.init(t, r), (r.format = r.format || "float64");
    const o = r.format?.includes("int"),
      l = o ? "int" : "number",
      [c, u] = e_[r.format];
    t._zod.onattach.push((d) => {
      const h = d._zod.bag;
      (h.format = r.format),
        (h.minimum = c),
        (h.maximum = u),
        o && (h.pattern = Y_);
    }),
      (t._zod.check = (d) => {
        const h = d.value;
        if (o) {
          if (!Number.isInteger(h)) {
            d.issues.push({
              expected: l,
              format: r.format,
              code: "invalid_type",
              continue: !1,
              input: h,
              inst: t,
            });
            return;
          }
          if (!Number.isSafeInteger(h)) {
            h > 0
              ? d.issues.push({
                  input: h,
                  code: "too_big",
                  maximum: Number.MAX_SAFE_INTEGER,
                  note: "Integers must be within the safe integer range.",
                  inst: t,
                  origin: l,
                  continue: !r.abort,
                })
              : d.issues.push({
                  input: h,
                  code: "too_small",
                  minimum: Number.MIN_SAFE_INTEGER,
                  note: "Integers must be within the safe integer range.",
                  inst: t,
                  origin: l,
                  continue: !r.abort,
                });
            return;
          }
        }
        h < c &&
          d.issues.push({
            origin: "number",
            input: h,
            code: "too_small",
            minimum: c,
            inclusive: !0,
            inst: t,
            continue: !r.abort,
          }),
          h > u &&
            d.issues.push({
              origin: "number",
              input: h,
              code: "too_big",
              maximum: u,
              inst: t,
            });
      });
  }),
  Q_ = X("$ZodCheckMaxLength", (t, r) => {
    var o;
    Gt.init(t, r),
      (o = t._zod.def).when ??
        (o.when = (l) => {
          const c = l.value;
          return !$d(c) && c.length !== void 0;
        }),
      t._zod.onattach.push((l) => {
        const c = l._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        r.maximum < c && (l._zod.bag.maximum = r.maximum);
      }),
      (t._zod.check = (l) => {
        const c = l.value;
        if (c.length <= r.maximum) return;
        const d = Yd(c);
        l.issues.push({
          origin: d,
          code: "too_big",
          maximum: r.maximum,
          inclusive: !0,
          input: c,
          inst: t,
          continue: !r.abort,
        });
      });
  }),
  F_ = X("$ZodCheckMinLength", (t, r) => {
    var o;
    Gt.init(t, r),
      (o = t._zod.def).when ??
        (o.when = (l) => {
          const c = l.value;
          return !$d(c) && c.length !== void 0;
        }),
      t._zod.onattach.push((l) => {
        const c = l._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        r.minimum > c && (l._zod.bag.minimum = r.minimum);
      }),
      (t._zod.check = (l) => {
        const c = l.value;
        if (c.length >= r.minimum) return;
        const d = Yd(c);
        l.issues.push({
          origin: d,
          code: "too_small",
          minimum: r.minimum,
          inclusive: !0,
          input: c,
          inst: t,
          continue: !r.abort,
        });
      });
  }),
  J_ = X("$ZodCheckLengthEquals", (t, r) => {
    var o;
    Gt.init(t, r),
      (o = t._zod.def).when ??
        (o.when = (l) => {
          const c = l.value;
          return !$d(c) && c.length !== void 0;
        }),
      t._zod.onattach.push((l) => {
        const c = l._zod.bag;
        (c.minimum = r.length), (c.maximum = r.length), (c.length = r.length);
      }),
      (t._zod.check = (l) => {
        const c = l.value,
          u = c.length;
        if (u === r.length) return;
        const d = Yd(c),
          h = u > r.length;
        l.issues.push({
          origin: d,
          ...(h
            ? { code: "too_big", maximum: r.length }
            : { code: "too_small", minimum: r.length }),
          inclusive: !0,
          exact: !0,
          input: l.value,
          inst: t,
          continue: !r.abort,
        });
      });
  }),
  hs = X("$ZodCheckStringFormat", (t, r) => {
    var o, l;
    Gt.init(t, r),
      t._zod.onattach.push((c) => {
        const u = c._zod.bag;
        (u.format = r.format),
          r.pattern &&
            (u.patterns ?? (u.patterns = new Set()), u.patterns.add(r.pattern));
      }),
      r.pattern
        ? (o = t._zod).check ??
          (o.check = (c) => {
            (r.pattern.lastIndex = 0),
              !r.pattern.test(c.value) &&
                c.issues.push({
                  origin: "string",
                  code: "invalid_format",
                  format: r.format,
                  input: c.value,
                  ...(r.pattern ? { pattern: r.pattern.toString() } : {}),
                  inst: t,
                  continue: !r.abort,
                });
          })
        : (l = t._zod).check ?? (l.check = () => {});
  }),
  W_ = X("$ZodCheckRegex", (t, r) => {
    hs.init(t, r),
      (t._zod.check = (o) => {
        (r.pattern.lastIndex = 0),
          !r.pattern.test(o.value) &&
            o.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "regex",
              input: o.value,
              pattern: r.pattern.toString(),
              inst: t,
              continue: !r.abort,
            });
      });
  }),
  eE = X("$ZodCheckLowerCase", (t, r) => {
    r.pattern ?? (r.pattern = q_), hs.init(t, r);
  }),
  tE = X("$ZodCheckUpperCase", (t, r) => {
    r.pattern ?? (r.pattern = P_), hs.init(t, r);
  }),
  nE = X("$ZodCheckIncludes", (t, r) => {
    Gt.init(t, r);
    const o = us(r.includes),
      l = new RegExp(
        typeof r.position == "number" ? `^.{${r.position}}${o}` : o
      );
    (r.pattern = l),
      t._zod.onattach.push((c) => {
        const u = c._zod.bag;
        u.patterns ?? (u.patterns = new Set()), u.patterns.add(l);
      }),
      (t._zod.check = (c) => {
        c.value.includes(r.includes, r.position) ||
          c.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: r.includes,
            input: c.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  rE = X("$ZodCheckStartsWith", (t, r) => {
    Gt.init(t, r);
    const o = new RegExp(`^${us(r.prefix)}.*`);
    r.pattern ?? (r.pattern = o),
      t._zod.onattach.push((l) => {
        const c = l._zod.bag;
        c.patterns ?? (c.patterns = new Set()), c.patterns.add(o);
      }),
      (t._zod.check = (l) => {
        l.value.startsWith(r.prefix) ||
          l.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: r.prefix,
            input: l.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  aE = X("$ZodCheckEndsWith", (t, r) => {
    Gt.init(t, r);
    const o = new RegExp(`.*${us(r.suffix)}$`);
    r.pattern ?? (r.pattern = o),
      t._zod.onattach.push((l) => {
        const c = l._zod.bag;
        c.patterns ?? (c.patterns = new Set()), c.patterns.add(o);
      }),
      (t._zod.check = (l) => {
        l.value.endsWith(r.suffix) ||
          l.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: r.suffix,
            input: l.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  oE = X("$ZodCheckOverwrite", (t, r) => {
    Gt.init(t, r),
      (t._zod.check = (o) => {
        o.value = r.tx(o.value);
      });
  });
class lE {
  constructor(r = []) {
    (this.content = []), (this.indent = 0), this && (this.args = r);
  }
  indented(r) {
    (this.indent += 1), r(this), (this.indent -= 1);
  }
  write(r) {
    if (typeof r == "function") {
      r(this, { execution: "sync" }), r(this, { execution: "async" });
      return;
    }
    const l = r
        .split(
          `
`
        )
        .filter((d) => d),
      c = Math.min(...l.map((d) => d.length - d.trimStart().length)),
      u = l.map((d) => d.slice(c)).map((d) => " ".repeat(this.indent * 2) + d);
    for (const d of u) this.content.push(d);
  }
  compile() {
    const r = Function,
      o = this?.args,
      c = [...(this?.content ?? [""]).map((u) => `  ${u}`)];
    return new r(
      ...o,
      c.join(`
`)
    );
  }
}
const iE = { major: 4, minor: 1, patch: 12 },
  it = X("$ZodType", (t, r) => {
    var o;
    t ?? (t = {}),
      (t._zod.def = r),
      (t._zod.bag = t._zod.bag || {}),
      (t._zod.version = iE);
    const l = [...(t._zod.def.checks ?? [])];
    t._zod.traits.has("$ZodCheck") && l.unshift(t);
    for (const c of l) for (const u of c._zod.onattach) u(t);
    if (l.length === 0)
      (o = t._zod).deferred ?? (o.deferred = []),
        t._zod.deferred?.push(() => {
          t._zod.run = t._zod.parse;
        });
    else {
      const c = (d, h, p) => {
          let m = vo(d),
            v;
          for (const x of h) {
            if (x._zod.def.when) {
              if (!x._zod.def.when(d)) continue;
            } else if (m) continue;
            const _ = d.issues.length,
              E = x._zod.check(d);
            if (E instanceof Promise && p?.async === !1) throw new bo();
            if (v || E instanceof Promise)
              v = (v ?? Promise.resolve()).then(async () => {
                await E, d.issues.length !== _ && (m || (m = vo(d, _)));
              });
            else {
              if (d.issues.length === _) continue;
              m || (m = vo(d, _));
            }
          }
          return v ? v.then(() => d) : d;
        },
        u = (d, h, p) => {
          if (vo(d)) return (d.aborted = !0), d;
          const m = c(h, l, p);
          if (m instanceof Promise) {
            if (p.async === !1) throw new bo();
            return m.then((v) => t._zod.parse(v, p));
          }
          return t._zod.parse(m, p);
        };
      t._zod.run = (d, h) => {
        if (h.skipChecks) return t._zod.parse(d, h);
        if (h.direction === "backward") {
          const m = t._zod.parse(
            { value: d.value, issues: [] },
            { ...h, skipChecks: !0 }
          );
          return m instanceof Promise ? m.then((v) => u(v, d, h)) : u(m, d, h);
        }
        const p = t._zod.parse(d, h);
        if (p instanceof Promise) {
          if (h.async === !1) throw new bo();
          return p.then((m) => c(m, l, h));
        }
        return c(p, l, h);
      };
    }
    t["~standard"] = {
      validate: (c) => {
        try {
          const u = f_(t, c);
          return u.success ? { value: u.data } : { issues: u.error?.issues };
        } catch {
          return d_(t, c).then((d) =>
            d.success ? { value: d.data } : { issues: d.error?.issues }
          );
        }
      },
      vendor: "zod",
      version: 1,
    };
  }),
  qd = X("$ZodString", (t, r) => {
    it.init(t, r),
      (t._zod.pattern =
        [...(t?._zod.bag?.patterns ?? [])].pop() ?? G_(t._zod.bag)),
      (t._zod.parse = (o, l) => {
        if (r.coerce)
          try {
            o.value = String(o.value);
          } catch {}
        return (
          typeof o.value == "string" ||
            o.issues.push({
              expected: "string",
              code: "invalid_type",
              input: o.value,
              inst: t,
            }),
          o
        );
      });
  }),
  Ke = X("$ZodStringFormat", (t, r) => {
    hs.init(t, r), qd.init(t, r);
  }),
  cE = X("$ZodGUID", (t, r) => {
    r.pattern ?? (r.pattern = T_), Ke.init(t, r);
  }),
  sE = X("$ZodUUID", (t, r) => {
    if (r.version) {
      const l = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[
        r.version
      ];
      if (l === void 0) throw new Error(`Invalid UUID version: "${r.version}"`);
      r.pattern ?? (r.pattern = Sv(l));
    } else r.pattern ?? (r.pattern = Sv());
    Ke.init(t, r);
  }),
  uE = X("$ZodEmail", (t, r) => {
    r.pattern ?? (r.pattern = N_), Ke.init(t, r);
  }),
  fE = X("$ZodURL", (t, r) => {
    Ke.init(t, r),
      (t._zod.check = (o) => {
        try {
          const l = o.value.trim(),
            c = new URL(l);
          r.hostname &&
            ((r.hostname.lastIndex = 0),
            r.hostname.test(c.hostname) ||
              o.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid hostname",
                pattern: U_.source,
                input: o.value,
                inst: t,
                continue: !r.abort,
              })),
            r.protocol &&
              ((r.protocol.lastIndex = 0),
              r.protocol.test(
                c.protocol.endsWith(":") ? c.protocol.slice(0, -1) : c.protocol
              ) ||
                o.issues.push({
                  code: "invalid_format",
                  format: "url",
                  note: "Invalid protocol",
                  pattern: r.protocol.source,
                  input: o.value,
                  inst: t,
                  continue: !r.abort,
                })),
            r.normalize ? (o.value = c.href) : (o.value = l);
          return;
        } catch {
          o.issues.push({
            code: "invalid_format",
            format: "url",
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
        }
      });
  }),
  dE = X("$ZodEmoji", (t, r) => {
    r.pattern ?? (r.pattern = D_()), Ke.init(t, r);
  }),
  hE = X("$ZodNanoID", (t, r) => {
    r.pattern ?? (r.pattern = R_), Ke.init(t, r);
  }),
  mE = X("$ZodCUID", (t, r) => {
    r.pattern ?? (r.pattern = S_), Ke.init(t, r);
  }),
  pE = X("$ZodCUID2", (t, r) => {
    r.pattern ?? (r.pattern = w_), Ke.init(t, r);
  }),
  gE = X("$ZodULID", (t, r) => {
    r.pattern ?? (r.pattern = __), Ke.init(t, r);
  }),
  vE = X("$ZodXID", (t, r) => {
    r.pattern ?? (r.pattern = E_), Ke.init(t, r);
  }),
  yE = X("$ZodKSUID", (t, r) => {
    r.pattern ?? (r.pattern = C_), Ke.init(t, r);
  }),
  bE = X("$ZodISODateTime", (t, r) => {
    r.pattern ?? (r.pattern = $_(r)), Ke.init(t, r);
  }),
  xE = X("$ZodISODate", (t, r) => {
    r.pattern ?? (r.pattern = Z_), Ke.init(t, r);
  }),
  SE = X("$ZodISOTime", (t, r) => {
    r.pattern ?? (r.pattern = H_(r)), Ke.init(t, r);
  }),
  wE = X("$ZodISODuration", (t, r) => {
    r.pattern ?? (r.pattern = A_), Ke.init(t, r);
  }),
  _E = X("$ZodIPv4", (t, r) => {
    r.pattern ?? (r.pattern = j_),
      Ke.init(t, r),
      t._zod.onattach.push((o) => {
        const l = o._zod.bag;
        l.format = "ipv4";
      });
  }),
  EE = X("$ZodIPv6", (t, r) => {
    r.pattern ?? (r.pattern = z_),
      Ke.init(t, r),
      t._zod.onattach.push((o) => {
        const l = o._zod.bag;
        l.format = "ipv6";
      }),
      (t._zod.check = (o) => {
        try {
          new URL(`http://[${o.value}]`);
        } catch {
          o.issues.push({
            code: "invalid_format",
            format: "ipv6",
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
        }
      });
  }),
  CE = X("$ZodCIDRv4", (t, r) => {
    r.pattern ?? (r.pattern = M_), Ke.init(t, r);
  }),
  RE = X("$ZodCIDRv6", (t, r) => {
    r.pattern ?? (r.pattern = k_),
      Ke.init(t, r),
      (t._zod.check = (o) => {
        const l = o.value.split("/");
        try {
          if (l.length !== 2) throw new Error();
          const [c, u] = l;
          if (!u) throw new Error();
          const d = Number(u);
          if (`${d}` !== u) throw new Error();
          if (d < 0 || d > 128) throw new Error();
          new URL(`http://[${c}]`);
        } catch {
          o.issues.push({
            code: "invalid_format",
            format: "cidrv6",
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
        }
      });
  });
function Fy(t) {
  if (t === "") return !0;
  if (t.length % 4 !== 0) return !1;
  try {
    return atob(t), !0;
  } catch {
    return !1;
  }
}
const AE = X("$ZodBase64", (t, r) => {
  r.pattern ?? (r.pattern = L_),
    Ke.init(t, r),
    t._zod.onattach.push((o) => {
      o._zod.bag.contentEncoding = "base64";
    }),
    (t._zod.check = (o) => {
      Fy(o.value) ||
        o.issues.push({
          code: "invalid_format",
          format: "base64",
          input: o.value,
          inst: t,
          continue: !r.abort,
        });
    });
});
function TE(t) {
  if (!Iy.test(t)) return !1;
  const r = t.replace(/[-_]/g, (l) => (l === "-" ? "+" : "/")),
    o = r.padEnd(Math.ceil(r.length / 4) * 4, "=");
  return Fy(o);
}
const NE = X("$ZodBase64URL", (t, r) => {
    r.pattern ?? (r.pattern = Iy),
      Ke.init(t, r),
      t._zod.onattach.push((o) => {
        o._zod.bag.contentEncoding = "base64url";
      }),
      (t._zod.check = (o) => {
        TE(o.value) ||
          o.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  OE = X("$ZodE164", (t, r) => {
    r.pattern ?? (r.pattern = B_), Ke.init(t, r);
  });
function DE(t, r = null) {
  try {
    const o = t.split(".");
    if (o.length !== 3) return !1;
    const [l] = o;
    if (!l) return !1;
    const c = JSON.parse(atob(l));
    return !(
      ("typ" in c && c?.typ !== "JWT") ||
      !c.alg ||
      (r && (!("alg" in c) || c.alg !== r))
    );
  } catch {
    return !1;
  }
}
const jE = X("$ZodJWT", (t, r) => {
    Ke.init(t, r),
      (t._zod.check = (o) => {
        DE(o.value, r.alg) ||
          o.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: o.value,
            inst: t,
            continue: !r.abort,
          });
      });
  }),
  Jy = X("$ZodNumber", (t, r) => {
    it.init(t, r),
      (t._zod.pattern = t._zod.bag.pattern ?? V_),
      (t._zod.parse = (o, l) => {
        if (r.coerce)
          try {
            o.value = Number(o.value);
          } catch {}
        const c = o.value;
        if (typeof c == "number" && !Number.isNaN(c) && Number.isFinite(c))
          return o;
        const u =
          typeof c == "number"
            ? Number.isNaN(c)
              ? "NaN"
              : Number.isFinite(c)
              ? void 0
              : "Infinity"
            : void 0;
        return (
          o.issues.push({
            expected: "number",
            code: "invalid_type",
            input: c,
            inst: t,
            ...(u ? { received: u } : {}),
          }),
          o
        );
      });
  }),
  zE = X("$ZodNumber", (t, r) => {
    K_.init(t, r), Jy.init(t, r);
  }),
  ME = X("$ZodBoolean", (t, r) => {
    it.init(t, r),
      (t._zod.pattern = I_),
      (t._zod.parse = (o, l) => {
        if (r.coerce)
          try {
            o.value = !!o.value;
          } catch {}
        const c = o.value;
        return (
          typeof c == "boolean" ||
            o.issues.push({
              expected: "boolean",
              code: "invalid_type",
              input: c,
              inst: t,
            }),
          o
        );
      });
  }),
  kE = X("$ZodUnknown", (t, r) => {
    it.init(t, r), (t._zod.parse = (o) => o);
  }),
  LE = X("$ZodNever", (t, r) => {
    it.init(t, r),
      (t._zod.parse = (o, l) => (
        o.issues.push({
          expected: "never",
          code: "invalid_type",
          input: o.value,
          inst: t,
        }),
        o
      ));
  });
function wv(t, r, o) {
  t.issues.length && r.issues.push(...$y(o, t.issues)), (r.value[o] = t.value);
}
const UE = X("$ZodArray", (t, r) => {
  it.init(t, r),
    (t._zod.parse = (o, l) => {
      const c = o.value;
      if (!Array.isArray(c))
        return (
          o.issues.push({
            expected: "array",
            code: "invalid_type",
            input: c,
            inst: t,
          }),
          o
        );
      o.value = Array(c.length);
      const u = [];
      for (let d = 0; d < c.length; d++) {
        const h = c[d],
          p = r.element._zod.run({ value: h, issues: [] }, l);
        p instanceof Promise ? u.push(p.then((m) => wv(m, o, d))) : wv(p, o, d);
      }
      return u.length ? Promise.all(u).then(() => o) : o;
    });
});
function Pc(t, r, o, l) {
  t.issues.length && r.issues.push(...$y(o, t.issues)),
    t.value === void 0
      ? o in l && (r.value[o] = void 0)
      : (r.value[o] = t.value);
}
function Wy(t) {
  const r = Object.keys(t.shape);
  for (const l of r)
    if (!t.shape?.[l]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${l}": expected a Zod schema`);
  const o = Ww(t.shape);
  return {
    ...t,
    keys: r,
    keySet: new Set(r),
    numKeys: r.length,
    optionalKeys: new Set(o),
  };
}
function eb(t, r, o, l, c, u) {
  const d = [],
    h = c.keySet,
    p = c.catchall._zod,
    m = p.def.type;
  for (const v of Object.keys(r)) {
    if (h.has(v)) continue;
    if (m === "never") {
      d.push(v);
      continue;
    }
    const x = p.run({ value: r[v], issues: [] }, l);
    x instanceof Promise
      ? t.push(x.then((_) => Pc(_, o, v, r)))
      : Pc(x, o, v, r);
  }
  return (
    d.length &&
      o.issues.push({ code: "unrecognized_keys", keys: d, input: r, inst: u }),
    t.length ? Promise.all(t).then(() => o) : o
  );
}
const BE = X("$ZodObject", (t, r) => {
    if ((it.init(t, r), !Object.getOwnPropertyDescriptor(r, "shape")?.get)) {
      const h = r.shape;
      Object.defineProperty(r, "shape", {
        get: () => {
          const p = { ...h };
          return Object.defineProperty(r, "shape", { value: p }), p;
        },
      });
    }
    const l = Hd(() => Wy(r));
    Ie(t._zod, "propValues", () => {
      const h = r.shape,
        p = {};
      for (const m in h) {
        const v = h[m]._zod;
        if (v.values) {
          p[m] ?? (p[m] = new Set());
          for (const x of v.values) p[m].add(x);
        }
      }
      return p;
    });
    const c = qc,
      u = r.catchall;
    let d;
    t._zod.parse = (h, p) => {
      d ?? (d = l.value);
      const m = h.value;
      if (!c(m))
        return (
          h.issues.push({
            expected: "object",
            code: "invalid_type",
            input: m,
            inst: t,
          }),
          h
        );
      h.value = {};
      const v = [],
        x = d.shape;
      for (const _ of d.keys) {
        const R = x[_]._zod.run({ value: m[_], issues: [] }, p);
        R instanceof Promise
          ? v.push(R.then((w) => Pc(w, h, _, m)))
          : Pc(R, h, _, m);
      }
      return u
        ? eb(v, m, h, p, l.value, t)
        : v.length
        ? Promise.all(v).then(() => h)
        : h;
    };
  }),
  ZE = X("$ZodObjectJIT", (t, r) => {
    BE.init(t, r);
    const o = t._zod.parse,
      l = Hd(() => Wy(r)),
      c = (_) => {
        const E = new lE(["shape", "payload", "ctx"]),
          R = l.value,
          w = (j) => {
            const B = xv(j);
            return `shape[${B}]._zod.run({ value: input[${B}], issues: [] }, ctx)`;
          };
        E.write("const input = payload.value;");
        const C = Object.create(null);
        let O = 0;
        for (const j of R.keys) C[j] = `key_${O++}`;
        E.write("const newResult = {};");
        for (const j of R.keys) {
          const B = C[j],
            L = xv(j);
          E.write(`const ${B} = ${w(j)};`),
            E.write(`
        if (${B}.issues.length) {
          payload.issues = payload.issues.concat(${B}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${L}, ...iss.path] : [${L}]
          })));
        }
        
        
        if (${B}.value === undefined) {
          if (${L} in input) {
            newResult[${L}] = undefined;
          }
        } else {
          newResult[${L}] = ${B}.value;
        }
        
      `);
        }
        E.write("payload.value = newResult;"), E.write("return payload;");
        const D = E.compile();
        return (j, B) => D(_, j, B);
      };
    let u;
    const d = qc,
      h = !By.jitless,
      m = h && Fw.value,
      v = r.catchall;
    let x;
    t._zod.parse = (_, E) => {
      x ?? (x = l.value);
      const R = _.value;
      return d(R)
        ? h && m && E?.async === !1 && E.jitless !== !0
          ? (u || (u = c(r.shape)),
            (_ = u(_, E)),
            v ? eb([], R, _, E, x, t) : _)
          : o(_, E)
        : (_.issues.push({
            expected: "object",
            code: "invalid_type",
            input: R,
            inst: t,
          }),
          _);
    };
  });
function _v(t, r, o, l) {
  for (const u of t) if (u.issues.length === 0) return (r.value = u.value), r;
  const c = t.filter((u) => !vo(u));
  return c.length === 1
    ? ((r.value = c[0].value), c[0])
    : (r.issues.push({
        code: "invalid_union",
        input: r.value,
        inst: o,
        errors: t.map((u) => u.issues.map((d) => pa(d, l, ma()))),
      }),
      r);
}
const HE = X("$ZodUnion", (t, r) => {
    it.init(t, r),
      Ie(t._zod, "optin", () =>
        r.options.some((c) => c._zod.optin === "optional") ? "optional" : void 0
      ),
      Ie(t._zod, "optout", () =>
        r.options.some((c) => c._zod.optout === "optional")
          ? "optional"
          : void 0
      ),
      Ie(t._zod, "values", () => {
        if (r.options.every((c) => c._zod.values))
          return new Set(r.options.flatMap((c) => Array.from(c._zod.values)));
      }),
      Ie(t._zod, "pattern", () => {
        if (r.options.every((c) => c._zod.pattern)) {
          const c = r.options.map((u) => u._zod.pattern);
          return new RegExp(`^(${c.map((u) => Gd(u.source)).join("|")})$`);
        }
      });
    const o = r.options.length === 1,
      l = r.options[0]._zod.run;
    t._zod.parse = (c, u) => {
      if (o) return l(c, u);
      let d = !1;
      const h = [];
      for (const p of r.options) {
        const m = p._zod.run({ value: c.value, issues: [] }, u);
        if (m instanceof Promise) h.push(m), (d = !0);
        else {
          if (m.issues.length === 0) return m;
          h.push(m);
        }
      }
      return d ? Promise.all(h).then((p) => _v(p, c, t, u)) : _v(h, c, t, u);
    };
  }),
  $E = X("$ZodIntersection", (t, r) => {
    it.init(t, r),
      (t._zod.parse = (o, l) => {
        const c = o.value,
          u = r.left._zod.run({ value: c, issues: [] }, l),
          d = r.right._zod.run({ value: c, issues: [] }, l);
        return u instanceof Promise || d instanceof Promise
          ? Promise.all([u, d]).then(([p, m]) => Ev(o, p, m))
          : Ev(o, u, d);
      });
  });
function gd(t, r) {
  if (t === r) return { valid: !0, data: t };
  if (t instanceof Date && r instanceof Date && +t == +r)
    return { valid: !0, data: t };
  if ($l(t) && $l(r)) {
    const o = Object.keys(r),
      l = Object.keys(t).filter((u) => o.indexOf(u) !== -1),
      c = { ...t, ...r };
    for (const u of l) {
      const d = gd(t[u], r[u]);
      if (!d.valid)
        return { valid: !1, mergeErrorPath: [u, ...d.mergeErrorPath] };
      c[u] = d.data;
    }
    return { valid: !0, data: c };
  }
  if (Array.isArray(t) && Array.isArray(r)) {
    if (t.length !== r.length) return { valid: !1, mergeErrorPath: [] };
    const o = [];
    for (let l = 0; l < t.length; l++) {
      const c = t[l],
        u = r[l],
        d = gd(c, u);
      if (!d.valid)
        return { valid: !1, mergeErrorPath: [l, ...d.mergeErrorPath] };
      o.push(d.data);
    }
    return { valid: !0, data: o };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Ev(t, r, o) {
  if (
    (r.issues.length && t.issues.push(...r.issues),
    o.issues.length && t.issues.push(...o.issues),
    vo(t))
  )
    return t;
  const l = gd(r.value, o.value);
  if (!l.valid)
    throw new Error(
      `Unmergable intersection. Error path: ${JSON.stringify(l.mergeErrorPath)}`
    );
  return (t.value = l.data), t;
}
const GE = X("$ZodEnum", (t, r) => {
    it.init(t, r);
    const o = Kw(r.entries),
      l = new Set(o);
    (t._zod.values = l),
      (t._zod.pattern = new RegExp(
        `^(${o
          .filter((c) => Jw.has(typeof c))
          .map((c) => (typeof c == "string" ? us(c) : c.toString()))
          .join("|")})$`
      )),
      (t._zod.parse = (c, u) => {
        const d = c.value;
        return (
          l.has(d) ||
            c.issues.push({
              code: "invalid_value",
              values: o,
              input: d,
              inst: t,
            }),
          c
        );
      });
  }),
  YE = X("$ZodTransform", (t, r) => {
    it.init(t, r),
      (t._zod.parse = (o, l) => {
        if (l.direction === "backward") throw new Uy(t.constructor.name);
        const c = r.transform(o.value, o);
        if (l.async)
          return (c instanceof Promise ? c : Promise.resolve(c)).then(
            (d) => ((o.value = d), o)
          );
        if (c instanceof Promise) throw new bo();
        return (o.value = c), o;
      });
  });
function Cv(t, r) {
  return t.issues.length && r === void 0 ? { issues: [], value: void 0 } : t;
}
const VE = X("$ZodOptional", (t, r) => {
    it.init(t, r),
      (t._zod.optin = "optional"),
      (t._zod.optout = "optional"),
      Ie(t._zod, "values", () =>
        r.innerType._zod.values
          ? new Set([...r.innerType._zod.values, void 0])
          : void 0
      ),
      Ie(t._zod, "pattern", () => {
        const o = r.innerType._zod.pattern;
        return o ? new RegExp(`^(${Gd(o.source)})?$`) : void 0;
      }),
      (t._zod.parse = (o, l) => {
        if (r.innerType._zod.optin === "optional") {
          const c = r.innerType._zod.run(o, l);
          return c instanceof Promise
            ? c.then((u) => Cv(u, o.value))
            : Cv(c, o.value);
        }
        return o.value === void 0 ? o : r.innerType._zod.run(o, l);
      });
  }),
  IE = X("$ZodNullable", (t, r) => {
    it.init(t, r),
      Ie(t._zod, "optin", () => r.innerType._zod.optin),
      Ie(t._zod, "optout", () => r.innerType._zod.optout),
      Ie(t._zod, "pattern", () => {
        const o = r.innerType._zod.pattern;
        return o ? new RegExp(`^(${Gd(o.source)}|null)$`) : void 0;
      }),
      Ie(t._zod, "values", () =>
        r.innerType._zod.values
          ? new Set([...r.innerType._zod.values, null])
          : void 0
      ),
      (t._zod.parse = (o, l) =>
        o.value === null ? o : r.innerType._zod.run(o, l));
  }),
  qE = X("$ZodDefault", (t, r) => {
    it.init(t, r),
      (t._zod.optin = "optional"),
      Ie(t._zod, "values", () => r.innerType._zod.values),
      (t._zod.parse = (o, l) => {
        if (l.direction === "backward") return r.innerType._zod.run(o, l);
        if (o.value === void 0) return (o.value = r.defaultValue), o;
        const c = r.innerType._zod.run(o, l);
        return c instanceof Promise ? c.then((u) => Rv(u, r)) : Rv(c, r);
      });
  });
function Rv(t, r) {
  return t.value === void 0 && (t.value = r.defaultValue), t;
}
const PE = X("$ZodPrefault", (t, r) => {
    it.init(t, r),
      (t._zod.optin = "optional"),
      Ie(t._zod, "values", () => r.innerType._zod.values),
      (t._zod.parse = (o, l) => (
        l.direction === "backward" ||
          (o.value === void 0 && (o.value = r.defaultValue)),
        r.innerType._zod.run(o, l)
      ));
  }),
  XE = X("$ZodNonOptional", (t, r) => {
    it.init(t, r),
      Ie(t._zod, "values", () => {
        const o = r.innerType._zod.values;
        return o ? new Set([...o].filter((l) => l !== void 0)) : void 0;
      }),
      (t._zod.parse = (o, l) => {
        const c = r.innerType._zod.run(o, l);
        return c instanceof Promise ? c.then((u) => Av(u, t)) : Av(c, t);
      });
  });
function Av(t, r) {
  return (
    !t.issues.length &&
      t.value === void 0 &&
      t.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: t.value,
        inst: r,
      }),
    t
  );
}
const KE = X("$ZodCatch", (t, r) => {
    it.init(t, r),
      Ie(t._zod, "optin", () => r.innerType._zod.optin),
      Ie(t._zod, "optout", () => r.innerType._zod.optout),
      Ie(t._zod, "values", () => r.innerType._zod.values),
      (t._zod.parse = (o, l) => {
        if (l.direction === "backward") return r.innerType._zod.run(o, l);
        const c = r.innerType._zod.run(o, l);
        return c instanceof Promise
          ? c.then(
              (u) => (
                (o.value = u.value),
                u.issues.length &&
                  ((o.value = r.catchValue({
                    ...o,
                    error: { issues: u.issues.map((d) => pa(d, l, ma())) },
                    input: o.value,
                  })),
                  (o.issues = [])),
                o
              )
            )
          : ((o.value = c.value),
            c.issues.length &&
              ((o.value = r.catchValue({
                ...o,
                error: { issues: c.issues.map((u) => pa(u, l, ma())) },
                input: o.value,
              })),
              (o.issues = [])),
            o);
      });
  }),
  QE = X("$ZodPipe", (t, r) => {
    it.init(t, r),
      Ie(t._zod, "values", () => r.in._zod.values),
      Ie(t._zod, "optin", () => r.in._zod.optin),
      Ie(t._zod, "optout", () => r.out._zod.optout),
      Ie(t._zod, "propValues", () => r.in._zod.propValues),
      (t._zod.parse = (o, l) => {
        if (l.direction === "backward") {
          const u = r.out._zod.run(o, l);
          return u instanceof Promise
            ? u.then((d) => Rc(d, r.in, l))
            : Rc(u, r.in, l);
        }
        const c = r.in._zod.run(o, l);
        return c instanceof Promise
          ? c.then((u) => Rc(u, r.out, l))
          : Rc(c, r.out, l);
      });
  });
function Rc(t, r, o) {
  return t.issues.length
    ? ((t.aborted = !0), t)
    : r._zod.run({ value: t.value, issues: t.issues }, o);
}
const FE = X("$ZodReadonly", (t, r) => {
  it.init(t, r),
    Ie(t._zod, "propValues", () => r.innerType._zod.propValues),
    Ie(t._zod, "values", () => r.innerType._zod.values),
    Ie(t._zod, "optin", () => r.innerType._zod.optin),
    Ie(t._zod, "optout", () => r.innerType._zod.optout),
    (t._zod.parse = (o, l) => {
      if (l.direction === "backward") return r.innerType._zod.run(o, l);
      const c = r.innerType._zod.run(o, l);
      return c instanceof Promise ? c.then(Tv) : Tv(c);
    });
});
function Tv(t) {
  return (t.value = Object.freeze(t.value)), t;
}
const JE = X("$ZodCustom", (t, r) => {
  Gt.init(t, r),
    it.init(t, r),
    (t._zod.parse = (o, l) => o),
    (t._zod.check = (o) => {
      const l = o.value,
        c = r.fn(l);
      if (c instanceof Promise) return c.then((u) => Nv(u, o, l, t));
      Nv(c, o, l, t);
    });
});
function Nv(t, r, o, l) {
  if (!t) {
    const c = {
      code: "custom",
      input: o,
      inst: l,
      path: [...(l._zod.def.path ?? [])],
      continue: !l._zod.def.abort,
    };
    l._zod.def.params && (c.params = l._zod.def.params), r.issues.push(Gl(c));
  }
}
class WE {
  constructor() {
    (this._map = new WeakMap()), (this._idmap = new Map());
  }
  add(r, ...o) {
    const l = o[0];
    if ((this._map.set(r, l), l && typeof l == "object" && "id" in l)) {
      if (this._idmap.has(l.id))
        throw new Error(`ID ${l.id} already exists in the registry`);
      this._idmap.set(l.id, r);
    }
    return this;
  }
  clear() {
    return (this._map = new WeakMap()), (this._idmap = new Map()), this;
  }
  remove(r) {
    const o = this._map.get(r);
    return (
      o && typeof o == "object" && "id" in o && this._idmap.delete(o.id),
      this._map.delete(r),
      this
    );
  }
  get(r) {
    const o = r._zod.parent;
    if (o) {
      const l = { ...(this.get(o) ?? {}) };
      delete l.id;
      const c = { ...l, ...this._map.get(r) };
      return Object.keys(c).length ? c : void 0;
    }
    return this._map.get(r);
  }
  has(r) {
    return this._map.has(r);
  }
}
function eC() {
  return new WE();
}
const Ac = eC();
function tC(t, r) {
  return new t({ type: "string", ...pe(r) });
}
function nC(t, r) {
  return new t({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function Ov(t, r) {
  return new t({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function rC(t, r) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function aC(t, r) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...pe(r),
  });
}
function oC(t, r) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...pe(r),
  });
}
function lC(t, r) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...pe(r),
  });
}
function iC(t, r) {
  return new t({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function cC(t, r) {
  return new t({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function sC(t, r) {
  return new t({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function uC(t, r) {
  return new t({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function fC(t, r) {
  return new t({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function dC(t, r) {
  return new t({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function hC(t, r) {
  return new t({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function mC(t, r) {
  return new t({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function pC(t, r) {
  return new t({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function gC(t, r) {
  return new t({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function vC(t, r) {
  return new t({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function yC(t, r) {
  return new t({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function bC(t, r) {
  return new t({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function xC(t, r) {
  return new t({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function SC(t, r) {
  return new t({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function wC(t, r) {
  return new t({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...pe(r),
  });
}
function _C(t, r) {
  return new t({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...pe(r),
  });
}
function EC(t, r) {
  return new t({
    type: "string",
    format: "date",
    check: "string_format",
    ...pe(r),
  });
}
function CC(t, r) {
  return new t({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...pe(r),
  });
}
function RC(t, r) {
  return new t({
    type: "string",
    format: "duration",
    check: "string_format",
    ...pe(r),
  });
}
function AC(t, r) {
  return new t({ type: "number", checks: [], ...pe(r) });
}
function TC(t, r) {
  return new t({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...pe(r),
  });
}
function NC(t, r) {
  return new t({ type: "boolean", ...pe(r) });
}
function OC(t) {
  return new t({ type: "unknown" });
}
function DC(t, r) {
  return new t({ type: "never", ...pe(r) });
}
function Dv(t, r) {
  return new Ky({ check: "less_than", ...pe(r), value: t, inclusive: !1 });
}
function Xf(t, r) {
  return new Ky({ check: "less_than", ...pe(r), value: t, inclusive: !0 });
}
function jv(t, r) {
  return new Qy({ check: "greater_than", ...pe(r), value: t, inclusive: !1 });
}
function Kf(t, r) {
  return new Qy({ check: "greater_than", ...pe(r), value: t, inclusive: !0 });
}
function zv(t, r) {
  return new X_({ check: "multiple_of", ...pe(r), value: t });
}
function tb(t, r) {
  return new Q_({ check: "max_length", ...pe(r), maximum: t });
}
function Xc(t, r) {
  return new F_({ check: "min_length", ...pe(r), minimum: t });
}
function nb(t, r) {
  return new J_({ check: "length_equals", ...pe(r), length: t });
}
function jC(t, r) {
  return new W_({
    check: "string_format",
    format: "regex",
    ...pe(r),
    pattern: t,
  });
}
function zC(t) {
  return new eE({ check: "string_format", format: "lowercase", ...pe(t) });
}
function MC(t) {
  return new tE({ check: "string_format", format: "uppercase", ...pe(t) });
}
function kC(t, r) {
  return new nE({
    check: "string_format",
    format: "includes",
    ...pe(r),
    includes: t,
  });
}
function LC(t, r) {
  return new rE({
    check: "string_format",
    format: "starts_with",
    ...pe(r),
    prefix: t,
  });
}
function UC(t, r) {
  return new aE({
    check: "string_format",
    format: "ends_with",
    ...pe(r),
    suffix: t,
  });
}
function Kl(t) {
  return new oE({ check: "overwrite", tx: t });
}
function BC(t) {
  return Kl((r) => r.normalize(t));
}
function ZC() {
  return Kl((t) => t.trim());
}
function HC() {
  return Kl((t) => t.toLowerCase());
}
function $C() {
  return Kl((t) => t.toUpperCase());
}
function GC(t, r, o) {
  return new t({ type: "array", element: r, ...pe(o) });
}
function YC(t, r, o) {
  return new t({ type: "custom", check: "custom", fn: r, ...pe(o) });
}
function VC(t) {
  const r = IC(
    (o) => (
      (o.addIssue = (l) => {
        if (typeof l == "string") o.issues.push(Gl(l, o.value, r._zod.def));
        else {
          const c = l;
          c.fatal && (c.continue = !1),
            c.code ?? (c.code = "custom"),
            c.input ?? (c.input = o.value),
            c.inst ?? (c.inst = r),
            c.continue ?? (c.continue = !r._zod.def.abort),
            o.issues.push(Gl(c));
        }
      }),
      t(o.value, o)
    )
  );
  return r;
}
function IC(t, r) {
  const o = new Gt({ check: "custom", ...pe(r) });
  return (o._zod.check = t), o;
}
const qC = X("ZodISODateTime", (t, r) => {
  bE.init(t, r), Je.init(t, r);
});
function PC(t) {
  return _C(qC, t);
}
const XC = X("ZodISODate", (t, r) => {
  xE.init(t, r), Je.init(t, r);
});
function KC(t) {
  return EC(XC, t);
}
const QC = X("ZodISOTime", (t, r) => {
  SE.init(t, r), Je.init(t, r);
});
function FC(t) {
  return CC(QC, t);
}
const JC = X("ZodISODuration", (t, r) => {
  wE.init(t, r), Je.init(t, r);
});
function WC(t) {
  return RC(JC, t);
}
const e2 = (t, r) => {
    Yy.init(t, r),
      (t.name = "ZodError"),
      Object.defineProperties(t, {
        format: { value: (o) => s_(t, o) },
        flatten: { value: (o) => c_(t, o) },
        addIssue: {
          value: (o) => {
            t.issues.push(o), (t.message = JSON.stringify(t.issues, pd, 2));
          },
        },
        addIssues: {
          value: (o) => {
            t.issues.push(...o), (t.message = JSON.stringify(t.issues, pd, 2));
          },
        },
        isEmpty: {
          get() {
            return t.issues.length === 0;
          },
        },
      });
  },
  pn = X("ZodError", e2, { Parent: Error }),
  t2 = Vd(pn),
  n2 = Id(pn),
  r2 = fs(pn),
  a2 = ds(pn),
  o2 = h_(pn),
  l2 = m_(pn),
  i2 = p_(pn),
  c2 = g_(pn),
  s2 = v_(pn),
  u2 = y_(pn),
  f2 = b_(pn),
  d2 = x_(pn),
  ft = X(
    "ZodType",
    (t, r) => (
      it.init(t, r),
      (t.def = r),
      (t.type = r.type),
      Object.defineProperty(t, "_def", { value: r }),
      (t.check = (...o) =>
        t.clone(
          _a(r, {
            checks: [
              ...(r.checks ?? []),
              ...o.map((l) =>
                typeof l == "function"
                  ? {
                      _zod: {
                        check: l,
                        def: { check: "custom" },
                        onattach: [],
                      },
                    }
                  : l
              ),
            ],
          })
        )),
      (t.clone = (o, l) => Gr(t, o, l)),
      (t.brand = () => t),
      (t.register = (o, l) => (o.add(t, l), t)),
      (t.parse = (o, l) => t2(t, o, l, { callee: t.parse })),
      (t.safeParse = (o, l) => r2(t, o, l)),
      (t.parseAsync = async (o, l) => n2(t, o, l, { callee: t.parseAsync })),
      (t.safeParseAsync = async (o, l) => a2(t, o, l)),
      (t.spa = t.safeParseAsync),
      (t.encode = (o, l) => o2(t, o, l)),
      (t.decode = (o, l) => l2(t, o, l)),
      (t.encodeAsync = async (o, l) => i2(t, o, l)),
      (t.decodeAsync = async (o, l) => c2(t, o, l)),
      (t.safeEncode = (o, l) => s2(t, o, l)),
      (t.safeDecode = (o, l) => u2(t, o, l)),
      (t.safeEncodeAsync = async (o, l) => f2(t, o, l)),
      (t.safeDecodeAsync = async (o, l) => d2(t, o, l)),
      (t.refine = (o, l) => t.check(rR(o, l))),
      (t.superRefine = (o) => t.check(aR(o))),
      (t.overwrite = (o) => t.check(Kl(o))),
      (t.optional = () => Uv(t)),
      (t.nullable = () => Bv(t)),
      (t.nullish = () => Uv(Bv(t))),
      (t.nonoptional = (o) => Q2(t, o)),
      (t.array = () => xo(t)),
      (t.or = (o) => Z2([t, o])),
      (t.and = (o) => $2(t, o)),
      (t.transform = (o) => Zv(t, V2(o))),
      (t.default = (o) => P2(t, o)),
      (t.prefault = (o) => K2(t, o)),
      (t.catch = (o) => J2(t, o)),
      (t.pipe = (o) => Zv(t, o)),
      (t.readonly = () => tR(t)),
      (t.describe = (o) => {
        const l = t.clone();
        return Ac.add(l, { description: o }), l;
      }),
      Object.defineProperty(t, "description", {
        get() {
          return Ac.get(t)?.description;
        },
        configurable: !0,
      }),
      (t.meta = (...o) => {
        if (o.length === 0) return Ac.get(t);
        const l = t.clone();
        return Ac.add(l, o[0]), l;
      }),
      (t.isOptional = () => t.safeParse(void 0).success),
      (t.isNullable = () => t.safeParse(null).success),
      t
    )
  ),
  rb = X("_ZodString", (t, r) => {
    qd.init(t, r), ft.init(t, r);
    const o = t._zod.bag;
    (t.format = o.format ?? null),
      (t.minLength = o.minimum ?? null),
      (t.maxLength = o.maximum ?? null),
      (t.regex = (...l) => t.check(jC(...l))),
      (t.includes = (...l) => t.check(kC(...l))),
      (t.startsWith = (...l) => t.check(LC(...l))),
      (t.endsWith = (...l) => t.check(UC(...l))),
      (t.min = (...l) => t.check(Xc(...l))),
      (t.max = (...l) => t.check(tb(...l))),
      (t.length = (...l) => t.check(nb(...l))),
      (t.nonempty = (...l) => t.check(Xc(1, ...l))),
      (t.lowercase = (l) => t.check(zC(l))),
      (t.uppercase = (l) => t.check(MC(l))),
      (t.trim = () => t.check(ZC())),
      (t.normalize = (...l) => t.check(BC(...l))),
      (t.toLowerCase = () => t.check(HC())),
      (t.toUpperCase = () => t.check($C()));
  }),
  h2 = X("ZodString", (t, r) => {
    qd.init(t, r),
      rb.init(t, r),
      (t.email = (o) => t.check(nC(m2, o))),
      (t.url = (o) => t.check(iC(p2, o))),
      (t.jwt = (o) => t.check(wC(O2, o))),
      (t.emoji = (o) => t.check(cC(g2, o))),
      (t.guid = (o) => t.check(Ov(Mv, o))),
      (t.uuid = (o) => t.check(rC(Tc, o))),
      (t.uuidv4 = (o) => t.check(aC(Tc, o))),
      (t.uuidv6 = (o) => t.check(oC(Tc, o))),
      (t.uuidv7 = (o) => t.check(lC(Tc, o))),
      (t.nanoid = (o) => t.check(sC(v2, o))),
      (t.guid = (o) => t.check(Ov(Mv, o))),
      (t.cuid = (o) => t.check(uC(y2, o))),
      (t.cuid2 = (o) => t.check(fC(b2, o))),
      (t.ulid = (o) => t.check(dC(x2, o))),
      (t.base64 = (o) => t.check(bC(A2, o))),
      (t.base64url = (o) => t.check(xC(T2, o))),
      (t.xid = (o) => t.check(hC(S2, o))),
      (t.ksuid = (o) => t.check(mC(w2, o))),
      (t.ipv4 = (o) => t.check(pC(_2, o))),
      (t.ipv6 = (o) => t.check(gC(E2, o))),
      (t.cidrv4 = (o) => t.check(vC(C2, o))),
      (t.cidrv6 = (o) => t.check(yC(R2, o))),
      (t.e164 = (o) => t.check(SC(N2, o))),
      (t.datetime = (o) => t.check(PC(o))),
      (t.date = (o) => t.check(KC(o))),
      (t.time = (o) => t.check(FC(o))),
      (t.duration = (o) => t.check(WC(o)));
  });
function Tt(t) {
  return tC(h2, t);
}
const Je = X("ZodStringFormat", (t, r) => {
    Ke.init(t, r), rb.init(t, r);
  }),
  m2 = X("ZodEmail", (t, r) => {
    uE.init(t, r), Je.init(t, r);
  }),
  Mv = X("ZodGUID", (t, r) => {
    cE.init(t, r), Je.init(t, r);
  }),
  Tc = X("ZodUUID", (t, r) => {
    sE.init(t, r), Je.init(t, r);
  }),
  p2 = X("ZodURL", (t, r) => {
    fE.init(t, r), Je.init(t, r);
  }),
  g2 = X("ZodEmoji", (t, r) => {
    dE.init(t, r), Je.init(t, r);
  }),
  v2 = X("ZodNanoID", (t, r) => {
    hE.init(t, r), Je.init(t, r);
  }),
  y2 = X("ZodCUID", (t, r) => {
    mE.init(t, r), Je.init(t, r);
  }),
  b2 = X("ZodCUID2", (t, r) => {
    pE.init(t, r), Je.init(t, r);
  }),
  x2 = X("ZodULID", (t, r) => {
    gE.init(t, r), Je.init(t, r);
  }),
  S2 = X("ZodXID", (t, r) => {
    vE.init(t, r), Je.init(t, r);
  }),
  w2 = X("ZodKSUID", (t, r) => {
    yE.init(t, r), Je.init(t, r);
  }),
  _2 = X("ZodIPv4", (t, r) => {
    _E.init(t, r), Je.init(t, r);
  }),
  E2 = X("ZodIPv6", (t, r) => {
    EE.init(t, r), Je.init(t, r);
  }),
  C2 = X("ZodCIDRv4", (t, r) => {
    CE.init(t, r), Je.init(t, r);
  }),
  R2 = X("ZodCIDRv6", (t, r) => {
    RE.init(t, r), Je.init(t, r);
  }),
  A2 = X("ZodBase64", (t, r) => {
    AE.init(t, r), Je.init(t, r);
  }),
  T2 = X("ZodBase64URL", (t, r) => {
    NE.init(t, r), Je.init(t, r);
  }),
  N2 = X("ZodE164", (t, r) => {
    OE.init(t, r), Je.init(t, r);
  }),
  O2 = X("ZodJWT", (t, r) => {
    jE.init(t, r), Je.init(t, r);
  }),
  ab = X("ZodNumber", (t, r) => {
    Jy.init(t, r),
      ft.init(t, r),
      (t.gt = (l, c) => t.check(jv(l, c))),
      (t.gte = (l, c) => t.check(Kf(l, c))),
      (t.min = (l, c) => t.check(Kf(l, c))),
      (t.lt = (l, c) => t.check(Dv(l, c))),
      (t.lte = (l, c) => t.check(Xf(l, c))),
      (t.max = (l, c) => t.check(Xf(l, c))),
      (t.int = (l) => t.check(kv(l))),
      (t.safe = (l) => t.check(kv(l))),
      (t.positive = (l) => t.check(jv(0, l))),
      (t.nonnegative = (l) => t.check(Kf(0, l))),
      (t.negative = (l) => t.check(Dv(0, l))),
      (t.nonpositive = (l) => t.check(Xf(0, l))),
      (t.multipleOf = (l, c) => t.check(zv(l, c))),
      (t.step = (l, c) => t.check(zv(l, c))),
      (t.finite = () => t);
    const o = t._zod.bag;
    (t.minValue =
      Math.max(
        o.minimum ?? Number.NEGATIVE_INFINITY,
        o.exclusiveMinimum ?? Number.NEGATIVE_INFINITY
      ) ?? null),
      (t.maxValue =
        Math.min(
          o.maximum ?? Number.POSITIVE_INFINITY,
          o.exclusiveMaximum ?? Number.POSITIVE_INFINITY
        ) ?? null),
      (t.isInt =
        (o.format ?? "").includes("int") ||
        Number.isSafeInteger(o.multipleOf ?? 0.5)),
      (t.isFinite = !0),
      (t.format = o.format ?? null);
  });
function Jt(t) {
  return AC(ab, t);
}
const D2 = X("ZodNumberFormat", (t, r) => {
  zE.init(t, r), ab.init(t, r);
});
function kv(t) {
  return TC(D2, t);
}
const j2 = X("ZodBoolean", (t, r) => {
  ME.init(t, r), ft.init(t, r);
});
function yo(t) {
  return NC(j2, t);
}
const z2 = X("ZodUnknown", (t, r) => {
  kE.init(t, r), ft.init(t, r);
});
function Lv() {
  return OC(z2);
}
const M2 = X("ZodNever", (t, r) => {
  LE.init(t, r), ft.init(t, r);
});
function k2(t) {
  return DC(M2, t);
}
const L2 = X("ZodArray", (t, r) => {
  UE.init(t, r),
    ft.init(t, r),
    (t.element = r.element),
    (t.min = (o, l) => t.check(Xc(o, l))),
    (t.nonempty = (o) => t.check(Xc(1, o))),
    (t.max = (o, l) => t.check(tb(o, l))),
    (t.length = (o, l) => t.check(nb(o, l))),
    (t.unwrap = () => t.element);
});
function xo(t, r) {
  return GC(L2, t, r);
}
const U2 = X("ZodObject", (t, r) => {
  ZE.init(t, r),
    ft.init(t, r),
    Ie(t, "shape", () => r.shape),
    (t.keyof = () => G2(Object.keys(t._zod.def.shape))),
    (t.catchall = (o) => t.clone({ ...t._zod.def, catchall: o })),
    (t.passthrough = () => t.clone({ ...t._zod.def, catchall: Lv() })),
    (t.loose = () => t.clone({ ...t._zod.def, catchall: Lv() })),
    (t.strict = () => t.clone({ ...t._zod.def, catchall: k2() })),
    (t.strip = () => t.clone({ ...t._zod.def, catchall: void 0 })),
    (t.extend = (o) => r_(t, o)),
    (t.safeExtend = (o) => a_(t, o)),
    (t.merge = (o) => o_(t, o)),
    (t.pick = (o) => t_(t, o)),
    (t.omit = (o) => n_(t, o)),
    (t.partial = (...o) => l_(ob, t, o[0])),
    (t.required = (...o) => i_(lb, t, o[0]));
});
function ga(t, r) {
  const o = { type: "object", shape: t ?? {}, ...pe(r) };
  return new U2(o);
}
const B2 = X("ZodUnion", (t, r) => {
  HE.init(t, r), ft.init(t, r), (t.options = r.options);
});
function Z2(t, r) {
  return new B2({ type: "union", options: t, ...pe(r) });
}
const H2 = X("ZodIntersection", (t, r) => {
  $E.init(t, r), ft.init(t, r);
});
function $2(t, r) {
  return new H2({ type: "intersection", left: t, right: r });
}
const vd = X("ZodEnum", (t, r) => {
  GE.init(t, r),
    ft.init(t, r),
    (t.enum = r.entries),
    (t.options = Object.values(r.entries));
  const o = new Set(Object.keys(r.entries));
  (t.extract = (l, c) => {
    const u = {};
    for (const d of l)
      if (o.has(d)) u[d] = r.entries[d];
      else throw new Error(`Key ${d} not found in enum`);
    return new vd({ ...r, checks: [], ...pe(c), entries: u });
  }),
    (t.exclude = (l, c) => {
      const u = { ...r.entries };
      for (const d of l)
        if (o.has(d)) delete u[d];
        else throw new Error(`Key ${d} not found in enum`);
      return new vd({ ...r, checks: [], ...pe(c), entries: u });
    });
});
function G2(t, r) {
  const o = Array.isArray(t) ? Object.fromEntries(t.map((l) => [l, l])) : t;
  return new vd({ type: "enum", entries: o, ...pe(r) });
}
const Y2 = X("ZodTransform", (t, r) => {
  YE.init(t, r),
    ft.init(t, r),
    (t._zod.parse = (o, l) => {
      if (l.direction === "backward") throw new Uy(t.constructor.name);
      o.addIssue = (u) => {
        if (typeof u == "string") o.issues.push(Gl(u, o.value, r));
        else {
          const d = u;
          d.fatal && (d.continue = !1),
            d.code ?? (d.code = "custom"),
            d.input ?? (d.input = o.value),
            d.inst ?? (d.inst = t),
            o.issues.push(Gl(d));
        }
      };
      const c = r.transform(o.value, o);
      return c instanceof Promise
        ? c.then((u) => ((o.value = u), o))
        : ((o.value = c), o);
    });
});
function V2(t) {
  return new Y2({ type: "transform", transform: t });
}
const ob = X("ZodOptional", (t, r) => {
  VE.init(t, r), ft.init(t, r), (t.unwrap = () => t._zod.def.innerType);
});
function Uv(t) {
  return new ob({ type: "optional", innerType: t });
}
const I2 = X("ZodNullable", (t, r) => {
  IE.init(t, r), ft.init(t, r), (t.unwrap = () => t._zod.def.innerType);
});
function Bv(t) {
  return new I2({ type: "nullable", innerType: t });
}
const q2 = X("ZodDefault", (t, r) => {
  qE.init(t, r),
    ft.init(t, r),
    (t.unwrap = () => t._zod.def.innerType),
    (t.removeDefault = t.unwrap);
});
function P2(t, r) {
  return new q2({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof r == "function" ? r() : Hy(r);
    },
  });
}
const X2 = X("ZodPrefault", (t, r) => {
  PE.init(t, r), ft.init(t, r), (t.unwrap = () => t._zod.def.innerType);
});
function K2(t, r) {
  return new X2({
    type: "prefault",
    innerType: t,
    get defaultValue() {
      return typeof r == "function" ? r() : Hy(r);
    },
  });
}
const lb = X("ZodNonOptional", (t, r) => {
  XE.init(t, r), ft.init(t, r), (t.unwrap = () => t._zod.def.innerType);
});
function Q2(t, r) {
  return new lb({ type: "nonoptional", innerType: t, ...pe(r) });
}
const F2 = X("ZodCatch", (t, r) => {
  KE.init(t, r),
    ft.init(t, r),
    (t.unwrap = () => t._zod.def.innerType),
    (t.removeCatch = t.unwrap);
});
function J2(t, r) {
  return new F2({
    type: "catch",
    innerType: t,
    catchValue: typeof r == "function" ? r : () => r,
  });
}
const W2 = X("ZodPipe", (t, r) => {
  QE.init(t, r), ft.init(t, r), (t.in = r.in), (t.out = r.out);
});
function Zv(t, r) {
  return new W2({ type: "pipe", in: t, out: r });
}
const eR = X("ZodReadonly", (t, r) => {
  FE.init(t, r), ft.init(t, r), (t.unwrap = () => t._zod.def.innerType);
});
function tR(t) {
  return new eR({ type: "readonly", innerType: t });
}
const nR = X("ZodCustom", (t, r) => {
  JE.init(t, r), ft.init(t, r);
});
function rR(t, r = {}) {
  return YC(nR, t, r);
}
function aR(t) {
  return VC(t);
}
const oR = ga({ character_name: Tt(), event_name: Tt(), chosen: Jt() }),
  lR = ga({ use_optimal_event_choice: yo(), event_choices: xo(oR) }),
  iR = ga({ spd: Jt(), sta: Jt(), pwr: Jt(), guts: Jt(), wit: Jt() }),
  cR = ga({
    is_auto_buy_skill: yo(),
    skill_pts_check: Jt(),
    skill_list: xo(Tt()),
  }),
  sR = ga({ name: Tt(), year: Tt(), date: Tt() }),
  uR = ga({
    config_name: Tt(),
    priority_stat: xo(Tt()),
    priority_weights: xo(Jt()),
    sleep_time_multiplier: Jt(),
    skip_training_energy: Jt(),
    never_rest_energy: Jt(),
    skip_infirmary_unless_missing_energy: Jt(),
    priority_weight: Tt(),
    minimum_mood: Tt(),
    minimum_mood_junior_year: Tt(),
    maximum_failure: Jt(),
    prioritize_g1_race: yo(),
    cancel_consecutive_race: yo(),
    position_selection_enabled: yo(),
    enable_positions_by_race: yo(),
    preferred_position: Tt(),
    positions_by_race: ga({
      sprint: Tt(),
      mile: Tt(),
      medium: Tt(),
      long: Tt(),
    }),
    race_schedule: xo(sR),
    stat_caps: iR,
    skill: cR,
    event: lR,
    window_name: Tt(),
  });
function fR(t) {
  const r = uR.safeParse(t);
  return r.success
    ? { success: !0, data: r.data }
    : { success: !1, errors: u_(r.error) };
}
function dR({ activeIndex: t, updatePreset: r, savePreset: o }) {
  const l = y.useRef(null);
  return {
    fileInputRef: l,
    openFileDialog: () => {
      l.current?.click();
    },
    handleImport: async (d) => {
      const h = d.target.files?.[0];
      if (h)
        try {
          const p = await h.text(),
            m = JSON.parse(p),
            v = fR(m);
          if (!v.success) {
            console.error("Invalid config:", v.errors),
              alert(JSON.stringify(v.errors, null, 2));
            return;
          }
          const x = v.data;
          r(t, x), o(x);
          try {
            await fetch(`${md}/config`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(m),
            });
          } catch (_) {
            console.warn("Failed to sync with server:", _);
          }
          alert(`Config imported to preset ${t + 1}!`);
        } catch (p) {
          console.error("Import error:", p), alert("Failed to import config");
        } finally {
          d.target.value = "";
        }
    },
  };
}
function Hv(t, r) {
  if (typeof t == "function") return t(r);
  t != null && (t.current = r);
}
function ib(...t) {
  return (r) => {
    let o = !1;
    const l = t.map((c) => {
      const u = Hv(c, r);
      return !o && typeof u == "function" && (o = !0), u;
    });
    if (o)
      return () => {
        for (let c = 0; c < l.length; c++) {
          const u = l[c];
          typeof u == "function" ? u() : Hv(t[c], null);
        }
      };
  };
}
function Be(...t) {
  return y.useCallback(ib(...t), t);
}
function Ro(t) {
  const r = hR(t),
    o = y.forwardRef((l, c) => {
      const { children: u, ...d } = l,
        h = y.Children.toArray(u),
        p = h.find(pR);
      if (p) {
        const m = p.props.children,
          v = h.map((x) =>
            x === p
              ? y.Children.count(m) > 1
                ? y.Children.only(null)
                : y.isValidElement(m)
                ? m.props.children
                : null
              : x
          );
        return g.jsx(r, {
          ...d,
          ref: c,
          children: y.isValidElement(m) ? y.cloneElement(m, void 0, v) : null,
        });
      }
      return g.jsx(r, { ...d, ref: c, children: u });
    });
  return (o.displayName = `${t}.Slot`), o;
}
var cb = Ro("Slot");
function hR(t) {
  const r = y.forwardRef((o, l) => {
    const { children: c, ...u } = o;
    if (y.isValidElement(c)) {
      const d = vR(c),
        h = gR(u, c.props);
      return (
        c.type !== y.Fragment && (h.ref = l ? ib(l, d) : d),
        y.cloneElement(c, h)
      );
    }
    return y.Children.count(c) > 1 ? y.Children.only(null) : null;
  });
  return (r.displayName = `${t}.SlotClone`), r;
}
var sb = Symbol("radix.slottable");
function mR(t) {
  const r = ({ children: o }) => g.jsx(g.Fragment, { children: o });
  return (r.displayName = `${t}.Slottable`), (r.__radixId = sb), r;
}
function pR(t) {
  return (
    y.isValidElement(t) &&
    typeof t.type == "function" &&
    "__radixId" in t.type &&
    t.type.__radixId === sb
  );
}
function gR(t, r) {
  const o = { ...r };
  for (const l in r) {
    const c = t[l],
      u = r[l];
    /^on[A-Z]/.test(l)
      ? c && u
        ? (o[l] = (...h) => {
            const p = u(...h);
            return c(...h), p;
          })
        : c && (o[l] = c)
      : l === "style"
      ? (o[l] = { ...c, ...u })
      : l === "className" && (o[l] = [c, u].filter(Boolean).join(" "));
  }
  return { ...t, ...o };
}
function vR(t) {
  let r = Object.getOwnPropertyDescriptor(t.props, "ref")?.get,
    o = r && "isReactWarning" in r && r.isReactWarning;
  return o
    ? t.ref
    : ((r = Object.getOwnPropertyDescriptor(t, "ref")?.get),
      (o = r && "isReactWarning" in r && r.isReactWarning),
      o ? t.props.ref : t.props.ref || t.ref);
}
function ub(t) {
  var r,
    o,
    l = "";
  if (typeof t == "string" || typeof t == "number") l += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var c = t.length;
      for (r = 0; r < c; r++)
        t[r] && (o = ub(t[r])) && (l && (l += " "), (l += o));
    } else for (o in t) t[o] && (l && (l += " "), (l += o));
  return l;
}
function fb() {
  for (var t, r, o = 0, l = "", c = arguments.length; o < c; o++)
    (t = arguments[o]) && (r = ub(t)) && (l && (l += " "), (l += r));
  return l;
}
const $v = (t) => (typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t),
  Gv = fb,
  db = (t, r) => (o) => {
    var l;
    if (r?.variants == null) return Gv(t, o?.class, o?.className);
    const { variants: c, defaultVariants: u } = r,
      d = Object.keys(c).map((m) => {
        const v = o?.[m],
          x = u?.[m];
        if (v === null) return null;
        const _ = $v(v) || $v(x);
        return c[m][_];
      }),
      h =
        o &&
        Object.entries(o).reduce((m, v) => {
          let [x, _] = v;
          return _ === void 0 || (m[x] = _), m;
        }, {}),
      p =
        r == null || (l = r.compoundVariants) === null || l === void 0
          ? void 0
          : l.reduce((m, v) => {
              let { class: x, className: _, ...E } = v;
              return Object.entries(E).every((R) => {
                let [w, C] = R;
                return Array.isArray(C)
                  ? C.includes({ ...u, ...h }[w])
                  : { ...u, ...h }[w] === C;
              })
                ? [...m, x, _]
                : m;
            }, []);
    return Gv(t, d, p, o?.class, o?.className);
  },
  Pd = "-",
  yR = (t) => {
    const r = xR(t),
      { conflictingClassGroups: o, conflictingClassGroupModifiers: l } = t;
    return {
      getClassGroupId: (d) => {
        const h = d.split(Pd);
        return h[0] === "" && h.length !== 1 && h.shift(), hb(h, r) || bR(d);
      },
      getConflictingClassGroupIds: (d, h) => {
        const p = o[d] || [];
        return h && l[d] ? [...p, ...l[d]] : p;
      },
    };
  },
  hb = (t, r) => {
    if (t.length === 0) return r.classGroupId;
    const o = t[0],
      l = r.nextPart.get(o),
      c = l ? hb(t.slice(1), l) : void 0;
    if (c) return c;
    if (r.validators.length === 0) return;
    const u = t.join(Pd);
    return r.validators.find(({ validator: d }) => d(u))?.classGroupId;
  },
  Yv = /^\[(.+)\]$/,
  bR = (t) => {
    if (Yv.test(t)) {
      const r = Yv.exec(t)[1],
        o = r?.substring(0, r.indexOf(":"));
      if (o) return "arbitrary.." + o;
    }
  },
  xR = (t) => {
    const { theme: r, classGroups: o } = t,
      l = { nextPart: new Map(), validators: [] };
    for (const c in o) yd(o[c], l, c, r);
    return l;
  },
  yd = (t, r, o, l) => {
    t.forEach((c) => {
      if (typeof c == "string") {
        const u = c === "" ? r : Vv(r, c);
        u.classGroupId = o;
        return;
      }
      if (typeof c == "function") {
        if (SR(c)) {
          yd(c(l), r, o, l);
          return;
        }
        r.validators.push({ validator: c, classGroupId: o });
        return;
      }
      Object.entries(c).forEach(([u, d]) => {
        yd(d, Vv(r, u), o, l);
      });
    });
  },
  Vv = (t, r) => {
    let o = t;
    return (
      r.split(Pd).forEach((l) => {
        o.nextPart.has(l) ||
          o.nextPart.set(l, { nextPart: new Map(), validators: [] }),
          (o = o.nextPart.get(l));
      }),
      o
    );
  },
  SR = (t) => t.isThemeGetter,
  wR = (t) => {
    if (t < 1) return { get: () => {}, set: () => {} };
    let r = 0,
      o = new Map(),
      l = new Map();
    const c = (u, d) => {
      o.set(u, d), r++, r > t && ((r = 0), (l = o), (o = new Map()));
    };
    return {
      get(u) {
        let d = o.get(u);
        if (d !== void 0) return d;
        if ((d = l.get(u)) !== void 0) return c(u, d), d;
      },
      set(u, d) {
        o.has(u) ? o.set(u, d) : c(u, d);
      },
    };
  },
  bd = "!",
  xd = ":",
  _R = xd.length,
  ER = (t) => {
    const { prefix: r, experimentalParseClassName: o } = t;
    let l = (c) => {
      const u = [];
      let d = 0,
        h = 0,
        p = 0,
        m;
      for (let R = 0; R < c.length; R++) {
        let w = c[R];
        if (d === 0 && h === 0) {
          if (w === xd) {
            u.push(c.slice(p, R)), (p = R + _R);
            continue;
          }
          if (w === "/") {
            m = R;
            continue;
          }
        }
        w === "[" ? d++ : w === "]" ? d-- : w === "(" ? h++ : w === ")" && h--;
      }
      const v = u.length === 0 ? c : c.substring(p),
        x = CR(v),
        _ = x !== v,
        E = m && m > p ? m - p : void 0;
      return {
        modifiers: u,
        hasImportantModifier: _,
        baseClassName: x,
        maybePostfixModifierPosition: E,
      };
    };
    if (r) {
      const c = r + xd,
        u = l;
      l = (d) =>
        d.startsWith(c)
          ? u(d.substring(c.length))
          : {
              isExternal: !0,
              modifiers: [],
              hasImportantModifier: !1,
              baseClassName: d,
              maybePostfixModifierPosition: void 0,
            };
    }
    if (o) {
      const c = l;
      l = (u) => o({ className: u, parseClassName: c });
    }
    return l;
  },
  CR = (t) =>
    t.endsWith(bd)
      ? t.substring(0, t.length - 1)
      : t.startsWith(bd)
      ? t.substring(1)
      : t,
  RR = (t) => {
    const r = Object.fromEntries(t.orderSensitiveModifiers.map((l) => [l, !0]));
    return (l) => {
      if (l.length <= 1) return l;
      const c = [];
      let u = [];
      return (
        l.forEach((d) => {
          d[0] === "[" || r[d] ? (c.push(...u.sort(), d), (u = [])) : u.push(d);
        }),
        c.push(...u.sort()),
        c
      );
    };
  },
  AR = (t) => ({
    cache: wR(t.cacheSize),
    parseClassName: ER(t),
    sortModifiers: RR(t),
    ...yR(t),
  }),
  TR = /\s+/,
  NR = (t, r) => {
    const {
        parseClassName: o,
        getClassGroupId: l,
        getConflictingClassGroupIds: c,
        sortModifiers: u,
      } = r,
      d = [],
      h = t.trim().split(TR);
    let p = "";
    for (let m = h.length - 1; m >= 0; m -= 1) {
      const v = h[m],
        {
          isExternal: x,
          modifiers: _,
          hasImportantModifier: E,
          baseClassName: R,
          maybePostfixModifierPosition: w,
        } = o(v);
      if (x) {
        p = v + (p.length > 0 ? " " + p : p);
        continue;
      }
      let C = !!w,
        O = l(C ? R.substring(0, w) : R);
      if (!O) {
        if (!C) {
          p = v + (p.length > 0 ? " " + p : p);
          continue;
        }
        if (((O = l(R)), !O)) {
          p = v + (p.length > 0 ? " " + p : p);
          continue;
        }
        C = !1;
      }
      const D = u(_).join(":"),
        j = E ? D + bd : D,
        B = j + O;
      if (d.includes(B)) continue;
      d.push(B);
      const L = c(O, C);
      for (let F = 0; F < L.length; ++F) {
        const Y = L[F];
        d.push(j + Y);
      }
      p = v + (p.length > 0 ? " " + p : p);
    }
    return p;
  };
function OR() {
  let t = 0,
    r,
    o,
    l = "";
  for (; t < arguments.length; )
    (r = arguments[t++]) && (o = mb(r)) && (l && (l += " "), (l += o));
  return l;
}
const mb = (t) => {
  if (typeof t == "string") return t;
  let r,
    o = "";
  for (let l = 0; l < t.length; l++)
    t[l] && (r = mb(t[l])) && (o && (o += " "), (o += r));
  return o;
};
function DR(t, ...r) {
  let o,
    l,
    c,
    u = d;
  function d(p) {
    const m = r.reduce((v, x) => x(v), t());
    return (o = AR(m)), (l = o.cache.get), (c = o.cache.set), (u = h), h(p);
  }
  function h(p) {
    const m = l(p);
    if (m) return m;
    const v = NR(p, o);
    return c(p, v), v;
  }
  return function () {
    return u(OR.apply(null, arguments));
  };
}
const gt = (t) => {
    const r = (o) => o[t] || [];
    return (r.isThemeGetter = !0), r;
  },
  pb = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  gb = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  jR = /^\d+\/\d+$/,
  zR = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  MR =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  kR = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  LR = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  UR =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  ho = (t) => jR.test(t),
  Ae = (t) => !!t && !Number.isNaN(Number(t)),
  Mr = (t) => !!t && Number.isInteger(Number(t)),
  Qf = (t) => t.endsWith("%") && Ae(t.slice(0, -1)),
  lr = (t) => zR.test(t),
  BR = () => !0,
  ZR = (t) => MR.test(t) && !kR.test(t),
  vb = () => !1,
  HR = (t) => LR.test(t),
  $R = (t) => UR.test(t),
  GR = (t) => !le(t) && !ie(t),
  YR = (t) => No(t, xb, vb),
  le = (t) => pb.test(t),
  ha = (t) => No(t, Sb, ZR),
  Ff = (t) => No(t, XR, Ae),
  Iv = (t) => No(t, yb, vb),
  VR = (t) => No(t, bb, $R),
  Nc = (t) => No(t, wb, HR),
  ie = (t) => gb.test(t),
  Ll = (t) => Oo(t, Sb),
  IR = (t) => Oo(t, KR),
  qv = (t) => Oo(t, yb),
  qR = (t) => Oo(t, xb),
  PR = (t) => Oo(t, bb),
  Oc = (t) => Oo(t, wb, !0),
  No = (t, r, o) => {
    const l = pb.exec(t);
    return l ? (l[1] ? r(l[1]) : o(l[2])) : !1;
  },
  Oo = (t, r, o = !1) => {
    const l = gb.exec(t);
    return l ? (l[1] ? r(l[1]) : o) : !1;
  },
  yb = (t) => t === "position" || t === "percentage",
  bb = (t) => t === "image" || t === "url",
  xb = (t) => t === "length" || t === "size" || t === "bg-size",
  Sb = (t) => t === "length",
  XR = (t) => t === "number",
  KR = (t) => t === "family-name",
  wb = (t) => t === "shadow",
  QR = () => {
    const t = gt("color"),
      r = gt("font"),
      o = gt("text"),
      l = gt("font-weight"),
      c = gt("tracking"),
      u = gt("leading"),
      d = gt("breakpoint"),
      h = gt("container"),
      p = gt("spacing"),
      m = gt("radius"),
      v = gt("shadow"),
      x = gt("inset-shadow"),
      _ = gt("text-shadow"),
      E = gt("drop-shadow"),
      R = gt("blur"),
      w = gt("perspective"),
      C = gt("aspect"),
      O = gt("ease"),
      D = gt("animate"),
      j = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      B = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      L = () => [...B(), ie, le],
      F = () => ["auto", "hidden", "clip", "visible", "scroll"],
      Y = () => ["auto", "contain", "none"],
      G = () => [ie, le, p],
      te = () => [ho, "full", "auto", ...G()],
      se = () => [Mr, "none", "subgrid", ie, le],
      re = () => ["auto", { span: ["full", Mr, ie, le] }, Mr, ie, le],
      ue = () => [Mr, "auto", ie, le],
      ge = () => ["auto", "min", "max", "fr", ie, le],
      he = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      me = () => [
        "start",
        "end",
        "center",
        "stretch",
        "center-safe",
        "end-safe",
      ],
      z = () => ["auto", ...G()],
      V = () => [
        ho,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...G(),
      ],
      $ = () => [t, ie, le],
      ae = () => [...B(), qv, Iv, { position: [ie, le] }],
      T = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      q = () => ["auto", "cover", "contain", qR, YR, { size: [ie, le] }],
      J = () => [Qf, Ll, ha],
      Q = () => ["", "none", "full", m, ie, le],
      ee = () => ["", Ae, Ll, ha],
      ye = () => ["solid", "dashed", "dotted", "double"],
      ne = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      W = () => [Ae, Qf, qv, Iv],
      fe = () => ["", "none", R, ie, le],
      Ee = () => ["none", Ae, ie, le],
      ce = () => ["none", Ae, ie, le],
      Ce = () => [Ae, ie, le],
      _e = () => [ho, "full", ...G()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [lr],
        breakpoint: [lr],
        color: [BR],
        container: [lr],
        "drop-shadow": [lr],
        ease: ["in", "out", "in-out"],
        font: [GR],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [lr],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: [
          "dramatic",
          "near",
          "normal",
          "midrange",
          "distant",
          "none",
        ],
        radius: [lr],
        shadow: [lr],
        spacing: ["px", Ae],
        text: [lr],
        "text-shadow": [lr],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", ho, le, ie, C] }],
        container: ["container"],
        columns: [{ columns: [Ae, le, ie, h] }],
        "break-after": [{ "break-after": j() }],
        "break-before": [{ "break-before": j() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: L() }],
        overflow: [{ overflow: F() }],
        "overflow-x": [{ "overflow-x": F() }],
        "overflow-y": [{ "overflow-y": F() }],
        overscroll: [{ overscroll: Y() }],
        "overscroll-x": [{ "overscroll-x": Y() }],
        "overscroll-y": [{ "overscroll-y": Y() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: te() }],
        "inset-x": [{ "inset-x": te() }],
        "inset-y": [{ "inset-y": te() }],
        start: [{ start: te() }],
        end: [{ end: te() }],
        top: [{ top: te() }],
        right: [{ right: te() }],
        bottom: [{ bottom: te() }],
        left: [{ left: te() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [Mr, "auto", ie, le] }],
        basis: [{ basis: [ho, "full", "auto", h, ...G()] }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [Ae, ho, "auto", "initial", "none", le] }],
        grow: [{ grow: ["", Ae, ie, le] }],
        shrink: [{ shrink: ["", Ae, ie, le] }],
        order: [{ order: [Mr, "first", "last", "none", ie, le] }],
        "grid-cols": [{ "grid-cols": se() }],
        "col-start-end": [{ col: re() }],
        "col-start": [{ "col-start": ue() }],
        "col-end": [{ "col-end": ue() }],
        "grid-rows": [{ "grid-rows": se() }],
        "row-start-end": [{ row: re() }],
        "row-start": [{ "row-start": ue() }],
        "row-end": [{ "row-end": ue() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": ge() }],
        "auto-rows": [{ "auto-rows": ge() }],
        gap: [{ gap: G() }],
        "gap-x": [{ "gap-x": G() }],
        "gap-y": [{ "gap-y": G() }],
        "justify-content": [{ justify: [...he(), "normal"] }],
        "justify-items": [{ "justify-items": [...me(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...me()] }],
        "align-content": [{ content: ["normal", ...he()] }],
        "align-items": [{ items: [...me(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...me(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": he() }],
        "place-items": [{ "place-items": [...me(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...me()] }],
        p: [{ p: G() }],
        px: [{ px: G() }],
        py: [{ py: G() }],
        ps: [{ ps: G() }],
        pe: [{ pe: G() }],
        pt: [{ pt: G() }],
        pr: [{ pr: G() }],
        pb: [{ pb: G() }],
        pl: [{ pl: G() }],
        m: [{ m: z() }],
        mx: [{ mx: z() }],
        my: [{ my: z() }],
        ms: [{ ms: z() }],
        me: [{ me: z() }],
        mt: [{ mt: z() }],
        mr: [{ mr: z() }],
        mb: [{ mb: z() }],
        ml: [{ ml: z() }],
        "space-x": [{ "space-x": G() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": G() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: V() }],
        w: [{ w: [h, "screen", ...V()] }],
        "min-w": [{ "min-w": [h, "screen", "none", ...V()] }],
        "max-w": [
          { "max-w": [h, "screen", "none", "prose", { screen: [d] }, ...V()] },
        ],
        h: [{ h: ["screen", "lh", ...V()] }],
        "min-h": [{ "min-h": ["screen", "lh", "none", ...V()] }],
        "max-h": [{ "max-h": ["screen", "lh", ...V()] }],
        "font-size": [{ text: ["base", o, Ll, ha] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [l, ie, Ff] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              Qf,
              le,
            ],
          },
        ],
        "font-family": [{ font: [IR, le, r] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [c, ie, le] }],
        "line-clamp": [{ "line-clamp": [Ae, "none", ie, Ff] }],
        leading: [{ leading: [u, ...G()] }],
        "list-image": [{ "list-image": ["none", ie, le] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", ie, le] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "placeholder-color": [{ placeholder: $() }],
        "text-color": [{ text: $() }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...ye(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: [Ae, "from-font", "auto", ie, ha] },
        ],
        "text-decoration-color": [{ decoration: $() }],
        "underline-offset": [{ "underline-offset": [Ae, "auto", ie, le] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: G() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              ie,
              le,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", ie, le] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: ae() }],
        "bg-repeat": [{ bg: T() }],
        "bg-size": [{ bg: q() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [
                  { to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
                  Mr,
                  ie,
                  le,
                ],
                radial: ["", ie, le],
                conic: [Mr, ie, le],
              },
              PR,
              VR,
            ],
          },
        ],
        "bg-color": [{ bg: $() }],
        "gradient-from-pos": [{ from: J() }],
        "gradient-via-pos": [{ via: J() }],
        "gradient-to-pos": [{ to: J() }],
        "gradient-from": [{ from: $() }],
        "gradient-via": [{ via: $() }],
        "gradient-to": [{ to: $() }],
        rounded: [{ rounded: Q() }],
        "rounded-s": [{ "rounded-s": Q() }],
        "rounded-e": [{ "rounded-e": Q() }],
        "rounded-t": [{ "rounded-t": Q() }],
        "rounded-r": [{ "rounded-r": Q() }],
        "rounded-b": [{ "rounded-b": Q() }],
        "rounded-l": [{ "rounded-l": Q() }],
        "rounded-ss": [{ "rounded-ss": Q() }],
        "rounded-se": [{ "rounded-se": Q() }],
        "rounded-ee": [{ "rounded-ee": Q() }],
        "rounded-es": [{ "rounded-es": Q() }],
        "rounded-tl": [{ "rounded-tl": Q() }],
        "rounded-tr": [{ "rounded-tr": Q() }],
        "rounded-br": [{ "rounded-br": Q() }],
        "rounded-bl": [{ "rounded-bl": Q() }],
        "border-w": [{ border: ee() }],
        "border-w-x": [{ "border-x": ee() }],
        "border-w-y": [{ "border-y": ee() }],
        "border-w-s": [{ "border-s": ee() }],
        "border-w-e": [{ "border-e": ee() }],
        "border-w-t": [{ "border-t": ee() }],
        "border-w-r": [{ "border-r": ee() }],
        "border-w-b": [{ "border-b": ee() }],
        "border-w-l": [{ "border-l": ee() }],
        "divide-x": [{ "divide-x": ee() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": ee() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...ye(), "hidden", "none"] }],
        "divide-style": [{ divide: [...ye(), "hidden", "none"] }],
        "border-color": [{ border: $() }],
        "border-color-x": [{ "border-x": $() }],
        "border-color-y": [{ "border-y": $() }],
        "border-color-s": [{ "border-s": $() }],
        "border-color-e": [{ "border-e": $() }],
        "border-color-t": [{ "border-t": $() }],
        "border-color-r": [{ "border-r": $() }],
        "border-color-b": [{ "border-b": $() }],
        "border-color-l": [{ "border-l": $() }],
        "divide-color": [{ divide: $() }],
        "outline-style": [{ outline: [...ye(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [Ae, ie, le] }],
        "outline-w": [{ outline: ["", Ae, Ll, ha] }],
        "outline-color": [{ outline: $() }],
        shadow: [{ shadow: ["", "none", v, Oc, Nc] }],
        "shadow-color": [{ shadow: $() }],
        "inset-shadow": [{ "inset-shadow": ["none", x, Oc, Nc] }],
        "inset-shadow-color": [{ "inset-shadow": $() }],
        "ring-w": [{ ring: ee() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: $() }],
        "ring-offset-w": [{ "ring-offset": [Ae, ha] }],
        "ring-offset-color": [{ "ring-offset": $() }],
        "inset-ring-w": [{ "inset-ring": ee() }],
        "inset-ring-color": [{ "inset-ring": $() }],
        "text-shadow": [{ "text-shadow": ["none", _, Oc, Nc] }],
        "text-shadow-color": [{ "text-shadow": $() }],
        opacity: [{ opacity: [Ae, ie, le] }],
        "mix-blend": [
          { "mix-blend": [...ne(), "plus-darker", "plus-lighter"] },
        ],
        "bg-blend": [{ "bg-blend": ne() }],
        "mask-clip": [
          {
            "mask-clip": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
          "mask-no-clip",
        ],
        "mask-composite": [
          { mask: ["add", "subtract", "intersect", "exclude"] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [Ae] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": W() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": W() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": $() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": $() }],
        "mask-image-t-from-pos": [{ "mask-t-from": W() }],
        "mask-image-t-to-pos": [{ "mask-t-to": W() }],
        "mask-image-t-from-color": [{ "mask-t-from": $() }],
        "mask-image-t-to-color": [{ "mask-t-to": $() }],
        "mask-image-r-from-pos": [{ "mask-r-from": W() }],
        "mask-image-r-to-pos": [{ "mask-r-to": W() }],
        "mask-image-r-from-color": [{ "mask-r-from": $() }],
        "mask-image-r-to-color": [{ "mask-r-to": $() }],
        "mask-image-b-from-pos": [{ "mask-b-from": W() }],
        "mask-image-b-to-pos": [{ "mask-b-to": W() }],
        "mask-image-b-from-color": [{ "mask-b-from": $() }],
        "mask-image-b-to-color": [{ "mask-b-to": $() }],
        "mask-image-l-from-pos": [{ "mask-l-from": W() }],
        "mask-image-l-to-pos": [{ "mask-l-to": W() }],
        "mask-image-l-from-color": [{ "mask-l-from": $() }],
        "mask-image-l-to-color": [{ "mask-l-to": $() }],
        "mask-image-x-from-pos": [{ "mask-x-from": W() }],
        "mask-image-x-to-pos": [{ "mask-x-to": W() }],
        "mask-image-x-from-color": [{ "mask-x-from": $() }],
        "mask-image-x-to-color": [{ "mask-x-to": $() }],
        "mask-image-y-from-pos": [{ "mask-y-from": W() }],
        "mask-image-y-to-pos": [{ "mask-y-to": W() }],
        "mask-image-y-from-color": [{ "mask-y-from": $() }],
        "mask-image-y-to-color": [{ "mask-y-to": $() }],
        "mask-image-radial": [{ "mask-radial": [ie, le] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": W() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": W() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": $() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": $() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: ["side", "corner"], farthest: ["side", "corner"] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": B() }],
        "mask-image-conic-pos": [{ "mask-conic": [Ae] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": W() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": W() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": $() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": $() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          {
            "mask-origin": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
        ],
        "mask-position": [{ mask: ae() }],
        "mask-repeat": [{ mask: T() }],
        "mask-size": [{ mask: q() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", ie, le] }],
        filter: [{ filter: ["", "none", ie, le] }],
        blur: [{ blur: fe() }],
        brightness: [{ brightness: [Ae, ie, le] }],
        contrast: [{ contrast: [Ae, ie, le] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", E, Oc, Nc] }],
        "drop-shadow-color": [{ "drop-shadow": $() }],
        grayscale: [{ grayscale: ["", Ae, ie, le] }],
        "hue-rotate": [{ "hue-rotate": [Ae, ie, le] }],
        invert: [{ invert: ["", Ae, ie, le] }],
        saturate: [{ saturate: [Ae, ie, le] }],
        sepia: [{ sepia: ["", Ae, ie, le] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", ie, le] }],
        "backdrop-blur": [{ "backdrop-blur": fe() }],
        "backdrop-brightness": [{ "backdrop-brightness": [Ae, ie, le] }],
        "backdrop-contrast": [{ "backdrop-contrast": [Ae, ie, le] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", Ae, ie, le] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [Ae, ie, le] }],
        "backdrop-invert": [{ "backdrop-invert": ["", Ae, ie, le] }],
        "backdrop-opacity": [{ "backdrop-opacity": [Ae, ie, le] }],
        "backdrop-saturate": [{ "backdrop-saturate": [Ae, ie, le] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", Ae, ie, le] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": G() }],
        "border-spacing-x": [{ "border-spacing-x": G() }],
        "border-spacing-y": [{ "border-spacing-y": G() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "",
              "all",
              "colors",
              "opacity",
              "shadow",
              "transform",
              "none",
              ie,
              le,
            ],
          },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [Ae, "initial", ie, le] }],
        ease: [{ ease: ["linear", "initial", O, ie, le] }],
        delay: [{ delay: [Ae, ie, le] }],
        animate: [{ animate: ["none", D, ie, le] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [w, ie, le] }],
        "perspective-origin": [{ "perspective-origin": L() }],
        rotate: [{ rotate: Ee() }],
        "rotate-x": [{ "rotate-x": Ee() }],
        "rotate-y": [{ "rotate-y": Ee() }],
        "rotate-z": [{ "rotate-z": Ee() }],
        scale: [{ scale: ce() }],
        "scale-x": [{ "scale-x": ce() }],
        "scale-y": [{ "scale-y": ce() }],
        "scale-z": [{ "scale-z": ce() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: Ce() }],
        "skew-x": [{ "skew-x": Ce() }],
        "skew-y": [{ "skew-y": Ce() }],
        transform: [{ transform: [ie, le, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: L() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: _e() }],
        "translate-x": [{ "translate-x": _e() }],
        "translate-y": [{ "translate-y": _e() }],
        "translate-z": [{ "translate-z": _e() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: $() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: $() }],
        "color-scheme": [
          {
            scheme: [
              "normal",
              "dark",
              "light",
              "light-dark",
              "only-dark",
              "only-light",
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              ie,
              le,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": G() }],
        "scroll-mx": [{ "scroll-mx": G() }],
        "scroll-my": [{ "scroll-my": G() }],
        "scroll-ms": [{ "scroll-ms": G() }],
        "scroll-me": [{ "scroll-me": G() }],
        "scroll-mt": [{ "scroll-mt": G() }],
        "scroll-mr": [{ "scroll-mr": G() }],
        "scroll-mb": [{ "scroll-mb": G() }],
        "scroll-ml": [{ "scroll-ml": G() }],
        "scroll-p": [{ "scroll-p": G() }],
        "scroll-px": [{ "scroll-px": G() }],
        "scroll-py": [{ "scroll-py": G() }],
        "scroll-ps": [{ "scroll-ps": G() }],
        "scroll-pe": [{ "scroll-pe": G() }],
        "scroll-pt": [{ "scroll-pt": G() }],
        "scroll-pr": [{ "scroll-pr": G() }],
        "scroll-pb": [{ "scroll-pb": G() }],
        "scroll-pl": [{ "scroll-pl": G() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          {
            "will-change": ["auto", "scroll", "contents", "transform", ie, le],
          },
        ],
        fill: [{ fill: ["none", ...$()] }],
        "stroke-w": [{ stroke: [Ae, Ll, ha, Ff] }],
        stroke: [{ stroke: ["none", ...$()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": [
          "translate",
          "translate-x",
          "translate-y",
          "translate-z",
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    };
  },
  FR = DR(QR);
function lt(...t) {
  return FR(fb(t));
}
const JR = db(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90",
        outline:
          "border bg-background shadow-lg hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-8 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
function en({ className: t, variant: r, size: o, asChild: l = !1, ...c }) {
  const u = l ? cb : "button";
  return g.jsx(u, {
    "data-slot": "button",
    className: lt(JR({ variant: r, size: o, className: t })),
    ...c,
  });
}
function gn({ className: t, type: r, ...o }) {
  return g.jsx("input", {
    type: r,
    "data-slot": "input",
    className: lt(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-lg transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      t
    ),
    ...o,
  });
}
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const WR = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  eA = (t) =>
    t.replace(/^([A-Z])|[\s-_]+(\w)/g, (r, o, l) =>
      l ? l.toUpperCase() : o.toLowerCase()
    ),
  Pv = (t) => {
    const r = eA(t);
    return r.charAt(0).toUpperCase() + r.slice(1);
  },
  _b = (...t) =>
    t
      .filter((r, o, l) => !!r && r.trim() !== "" && l.indexOf(r) === o)
      .join(" ")
      .trim(),
  tA = (t) => {
    for (const r in t)
      if (r.startsWith("aria-") || r === "role" || r === "title") return !0;
  };
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var nA = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const rA = y.forwardRef(
  (
    {
      color: t = "currentColor",
      size: r = 24,
      strokeWidth: o = 2,
      absoluteStrokeWidth: l,
      className: c = "",
      children: u,
      iconNode: d,
      ...h
    },
    p
  ) =>
    y.createElement(
      "svg",
      {
        ref: p,
        ...nA,
        width: r,
        height: r,
        stroke: t,
        strokeWidth: l ? (Number(o) * 24) / Number(r) : o,
        className: _b("lucide", c),
        ...(!u && !tA(h) && { "aria-hidden": "true" }),
        ...h,
      },
      [
        ...d.map(([m, v]) => y.createElement(m, v)),
        ...(Array.isArray(u) ? u : [u]),
      ]
    )
);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dt = (t, r) => {
  const o = y.forwardRef(({ className: l, ...c }, u) =>
    y.createElement(rA, {
      ref: u,
      iconNode: r,
      className: _b(`lucide-${WR(Pv(t))}`, `lucide-${t}`, l),
      ...c,
    })
  );
  return (o.displayName = Pv(t)), o;
};
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const aA = [
    [
      "path",
      {
        d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
        key: "l5xja",
      },
    ],
    ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4", key: "10igwf" }],
    ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
    ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
    ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
    ["path", { d: "M12 13h4", key: "1ku699" }],
    ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1", key: "105ag5" }],
    ["path", { d: "M12 8h8", key: "1lhi5i" }],
    ["path", { d: "M16 8V5a2 2 0 0 1 2-2", key: "u6izg6" }],
    ["circle", { cx: "16", cy: "13", r: ".5", key: "ry7gng" }],
    ["circle", { cx: "18", cy: "3", r: ".5", key: "1aiba7" }],
    ["circle", { cx: "20", cy: "21", r: ".5", key: "yhc1fs" }],
    ["circle", { cx: "20", cy: "8", r: ".5", key: "1e43v0" }],
  ],
  oA = dt("brain-circuit", aA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lA = [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
    ],
    ["path", { d: "M3 10h18", key: "8toen8" }],
  ],
  Xv = dt("calendar", lA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const iA = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
    ["path", { d: "M18 17V9", key: "2bz60n" }],
    ["path", { d: "M13 17V5", key: "1frdt8" }],
    ["path", { d: "M8 17v-3", key: "17ska0" }],
  ],
  cA = dt("chart-column", iA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sA = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
  Eb = dt("check", sA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const uA = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  Cb = dt("chevron-down", uA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fA = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]],
  dA = dt("chevron-up", fA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hA = [
    ["path", { d: "m6 17 5-5-5-5", key: "xnjwq" }],
    ["path", { d: "m13 17 5-5-5-5", key: "17xmmf" }],
  ],
  mA = dt("chevrons-right", hA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pA = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  gA = dt("circle-question-mark", pA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const vA = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]],
  yA = dt("circle", vA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bA = [
    ["path", { d: "M11 10.27 7 3.34", key: "16pf9h" }],
    ["path", { d: "m11 13.73-4 6.93", key: "794ttg" }],
    ["path", { d: "M12 22v-2", key: "1osdcq" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M14 12h8", key: "4f43i9" }],
    ["path", { d: "m17 20.66-1-1.73", key: "eq3orb" }],
    ["path", { d: "m17 3.34-1 1.73", key: "2wel8s" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "m20.66 17-1.73-1", key: "sg0v6f" }],
    ["path", { d: "m20.66 7-1.73 1", key: "1ow05n" }],
    ["path", { d: "m3.34 17 1.73-1", key: "nuk764" }],
    ["path", { d: "m3.34 7 1.73 1", key: "1ulond" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["circle", { cx: "12", cy: "12", r: "8", key: "46899m" }],
  ],
  xA = dt("cog", bA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const SA = [
    [
      "path",
      {
        d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
        key: "sc7q7i",
      },
    ],
  ],
  Rb = dt("funnel", SA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const wA = [
    [
      "path",
      {
        d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
        key: "169xi5",
      },
    ],
    ["path", { d: "M15 5.764v15", key: "1pn4in" }],
    ["path", { d: "M9 3.236v15", key: "1uimfh" }],
  ],
  _A = dt("map", wA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const EA = [
    ["path", { d: "M4 12h16", key: "1lakjw" }],
    ["path", { d: "M4 18h16", key: "19g7jn" }],
    ["path", { d: "M4 6h16", key: "1o0s65" }],
  ],
  CA = dt("menu", EA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const RA = [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ],
  Zc = dt("search", RA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const AA = [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr",
      },
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }],
  ],
  TA = dt("sparkles", AA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const NA = [
    [
      "path",
      { d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8", key: "12lg5p" },
    ],
    ["path", { d: "M6 10V8", key: "1y41hn" }],
    ["path", { d: "M6 14v1", key: "cao2tf" }],
    ["path", { d: "M6 19v2", key: "1loha6" }],
    [
      "rect",
      { x: "2", y: "8", width: "20", height: "13", rx: "2", key: "p3bz5l" },
    ],
  ],
  OA = dt("tickets", NA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const DA = [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
  ],
  Ab = dt("trash-2", DA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const jA = [
    [
      "path",
      {
        d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
        key: "1n3hpd",
      },
    ],
    [
      "path",
      {
        d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
        key: "rfe1zi",
      },
    ],
    ["path", { d: "M18 9h1.5a1 1 0 0 0 0-5H18", key: "7xy6bh" }],
    ["path", { d: "M4 22h16", key: "57wxv0" }],
    [
      "path",
      {
        d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
        key: "1mhfuq",
      },
    ],
    ["path", { d: "M6 9H4.5a1 1 0 0 1 0-5H6", key: "tex48p" }],
  ],
  zA = dt("trophy", jA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const MA = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ],
  kA = dt("users", MA);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const LA = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  Xd = dt("x", LA);
function UA(t, r) {
  const o = y.createContext(r),
    l = (u) => {
      const { children: d, ...h } = u,
        p = y.useMemo(() => h, Object.values(h));
      return g.jsx(o.Provider, { value: p, children: d });
    };
  l.displayName = t + "Provider";
  function c(u) {
    const d = y.useContext(o);
    if (d) return d;
    if (r !== void 0) return r;
    throw new Error(`\`${u}\` must be used within \`${t}\``);
  }
  return [l, c];
}
function sr(t, r = []) {
  let o = [];
  function l(u, d) {
    const h = y.createContext(d),
      p = o.length;
    o = [...o, d];
    const m = (x) => {
      const { scope: _, children: E, ...R } = x,
        w = _?.[t]?.[p] || h,
        C = y.useMemo(() => R, Object.values(R));
      return g.jsx(w.Provider, { value: C, children: E });
    };
    m.displayName = u + "Provider";
    function v(x, _) {
      const E = _?.[t]?.[p] || h,
        R = y.useContext(E);
      if (R) return R;
      if (d !== void 0) return d;
      throw new Error(`\`${x}\` must be used within \`${u}\``);
    }
    return [m, v];
  }
  const c = () => {
    const u = o.map((d) => y.createContext(d));
    return function (h) {
      const p = h?.[t] || u;
      return y.useMemo(() => ({ [`__scope${t}`]: { ...h, [t]: p } }), [h, p]);
    };
  };
  return (c.scopeName = t), [l, BA(c, ...r)];
}
function BA(...t) {
  const r = t[0];
  if (t.length === 1) return r;
  const o = () => {
    const l = t.map((c) => ({ useScope: c(), scopeName: c.scopeName }));
    return function (u) {
      const d = l.reduce((h, { useScope: p, scopeName: m }) => {
        const x = p(u)[`__scope${m}`];
        return { ...h, ...x };
      }, {});
      return y.useMemo(() => ({ [`__scope${r.scopeName}`]: d }), [d]);
    };
  };
  return (o.scopeName = r.scopeName), o;
}
function Se(t, r, { checkForDefaultPrevented: o = !0 } = {}) {
  return function (c) {
    if ((t?.(c), o === !1 || !c.defaultPrevented)) return r?.(c);
  };
}
var Mt = globalThis?.document ? y.useLayoutEffect : () => {},
  ZA = zy[" useInsertionEffect ".trim().toString()] || Mt;
function va({ prop: t, defaultProp: r, onChange: o = () => {}, caller: l }) {
  const [c, u, d] = HA({ defaultProp: r, onChange: o }),
    h = t !== void 0,
    p = h ? t : c;
  {
    const v = y.useRef(t !== void 0);
    y.useEffect(() => {
      const x = v.current;
      x !== h &&
        console.warn(
          `${l} is changing from ${x ? "controlled" : "uncontrolled"} to ${
            h ? "controlled" : "uncontrolled"
          }. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        ),
        (v.current = h);
    }, [h, l]);
  }
  const m = y.useCallback(
    (v) => {
      if (h) {
        const x = $A(v) ? v(t) : v;
        x !== t && d.current?.(x);
      } else u(v);
    },
    [h, t, u, d]
  );
  return [p, m];
}
function HA({ defaultProp: t, onChange: r }) {
  const [o, l] = y.useState(t),
    c = y.useRef(o),
    u = y.useRef(r);
  return (
    ZA(() => {
      u.current = r;
    }, [r]),
    y.useEffect(() => {
      c.current !== o && (u.current?.(o), (c.current = o));
    }, [o, c]),
    [o, l, u]
  );
}
function $A(t) {
  return typeof t == "function";
}
function Kd(t) {
  const r = y.useRef({ value: t, previous: t });
  return y.useMemo(
    () => (
      r.current.value !== t &&
        ((r.current.previous = r.current.value), (r.current.value = t)),
      r.current.previous
    ),
    [t]
  );
}
function Qd(t) {
  const [r, o] = y.useState(void 0);
  return (
    Mt(() => {
      if (t) {
        o({ width: t.offsetWidth, height: t.offsetHeight });
        const l = new ResizeObserver((c) => {
          if (!Array.isArray(c) || !c.length) return;
          const u = c[0];
          let d, h;
          if ("borderBoxSize" in u) {
            const p = u.borderBoxSize,
              m = Array.isArray(p) ? p[0] : p;
            (d = m.inlineSize), (h = m.blockSize);
          } else (d = t.offsetWidth), (h = t.offsetHeight);
          o({ width: d, height: h });
        });
        return l.observe(t, { box: "border-box" }), () => l.unobserve(t);
      } else o(void 0);
    }, [t]),
    r
  );
}
function GA(t, r) {
  return y.useReducer((o, l) => r[o][l] ?? o, t);
}
var Yr = (t) => {
  const { present: r, children: o } = t,
    l = YA(r),
    c =
      typeof o == "function" ? o({ present: l.isPresent }) : y.Children.only(o),
    u = Be(l.ref, VA(c));
  return typeof o == "function" || l.isPresent
    ? y.cloneElement(c, { ref: u })
    : null;
};
Yr.displayName = "Presence";
function YA(t) {
  const [r, o] = y.useState(),
    l = y.useRef(null),
    c = y.useRef(t),
    u = y.useRef("none"),
    d = t ? "mounted" : "unmounted",
    [h, p] = GA(d, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    y.useEffect(() => {
      const m = Dc(l.current);
      u.current = h === "mounted" ? m : "none";
    }, [h]),
    Mt(() => {
      const m = l.current,
        v = c.current;
      if (v !== t) {
        const _ = u.current,
          E = Dc(m);
        t
          ? p("MOUNT")
          : E === "none" || m?.display === "none"
          ? p("UNMOUNT")
          : p(v && _ !== E ? "ANIMATION_OUT" : "UNMOUNT"),
          (c.current = t);
      }
    }, [t, p]),
    Mt(() => {
      if (r) {
        let m;
        const v = r.ownerDocument.defaultView ?? window,
          x = (E) => {
            const w = Dc(l.current).includes(CSS.escape(E.animationName));
            if (E.target === r && w && (p("ANIMATION_END"), !c.current)) {
              const C = r.style.animationFillMode;
              (r.style.animationFillMode = "forwards"),
                (m = v.setTimeout(() => {
                  r.style.animationFillMode === "forwards" &&
                    (r.style.animationFillMode = C);
                }));
            }
          },
          _ = (E) => {
            E.target === r && (u.current = Dc(l.current));
          };
        return (
          r.addEventListener("animationstart", _),
          r.addEventListener("animationcancel", x),
          r.addEventListener("animationend", x),
          () => {
            v.clearTimeout(m),
              r.removeEventListener("animationstart", _),
              r.removeEventListener("animationcancel", x),
              r.removeEventListener("animationend", x);
          }
        );
      } else p("ANIMATION_END");
    }, [r, p]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(h),
      ref: y.useCallback((m) => {
        (l.current = m ? getComputedStyle(m) : null), o(m);
      }, []),
    }
  );
}
function Dc(t) {
  return t?.animationName || "none";
}
function VA(t) {
  let r = Object.getOwnPropertyDescriptor(t.props, "ref")?.get,
    o = r && "isReactWarning" in r && r.isReactWarning;
  return o
    ? t.ref
    : ((r = Object.getOwnPropertyDescriptor(t, "ref")?.get),
      (o = r && "isReactWarning" in r && r.isReactWarning),
      o ? t.props.ref : t.props.ref || t.ref);
}
var Ln = My();
const IA = jy(Ln);
var qA = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  De = qA.reduce((t, r) => {
    const o = Ro(`Primitive.${r}`),
      l = y.forwardRef((c, u) => {
        const { asChild: d, ...h } = c,
          p = d ? o : r;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          g.jsx(p, { ...h, ref: u })
        );
      });
    return (l.displayName = `Primitive.${r}`), { ...t, [r]: l };
  }, {});
function PA(t, r) {
  t && Ln.flushSync(() => t.dispatchEvent(r));
}
var ms = "Checkbox",
  [XA, $M] = sr(ms),
  [KA, Fd] = XA(ms);
function QA(t) {
  const {
      __scopeCheckbox: r,
      checked: o,
      children: l,
      defaultChecked: c,
      disabled: u,
      form: d,
      name: h,
      onCheckedChange: p,
      required: m,
      value: v = "on",
      internal_do_not_use_render: x,
    } = t,
    [_, E] = va({ prop: o, defaultProp: c ?? !1, onChange: p, caller: ms }),
    [R, w] = y.useState(null),
    [C, O] = y.useState(null),
    D = y.useRef(!1),
    j = R ? !!d || !!R.closest("form") : !0,
    B = {
      checked: _,
      disabled: u,
      setChecked: E,
      control: R,
      setControl: w,
      name: h,
      form: d,
      value: v,
      hasConsumerStoppedPropagationRef: D,
      required: m,
      defaultChecked: Ur(c) ? !1 : c,
      isFormControl: j,
      bubbleInput: C,
      setBubbleInput: O,
    };
  return g.jsx(KA, { scope: r, ...B, children: FA(x) ? x(B) : l });
}
var Tb = "CheckboxTrigger",
  Nb = y.forwardRef(
    ({ __scopeCheckbox: t, onKeyDown: r, onClick: o, ...l }, c) => {
      const {
          control: u,
          value: d,
          disabled: h,
          checked: p,
          required: m,
          setControl: v,
          setChecked: x,
          hasConsumerStoppedPropagationRef: _,
          isFormControl: E,
          bubbleInput: R,
        } = Fd(Tb, t),
        w = Be(c, v),
        C = y.useRef(p);
      return (
        y.useEffect(() => {
          const O = u?.form;
          if (O) {
            const D = () => x(C.current);
            return (
              O.addEventListener("reset", D),
              () => O.removeEventListener("reset", D)
            );
          }
        }, [u, x]),
        g.jsx(De.button, {
          type: "button",
          role: "checkbox",
          "aria-checked": Ur(p) ? "mixed" : p,
          "aria-required": m,
          "data-state": kb(p),
          "data-disabled": h ? "" : void 0,
          disabled: h,
          value: d,
          ...l,
          ref: w,
          onKeyDown: Se(r, (O) => {
            O.key === "Enter" && O.preventDefault();
          }),
          onClick: Se(o, (O) => {
            x((D) => (Ur(D) ? !0 : !D)),
              R &&
                E &&
                ((_.current = O.isPropagationStopped()),
                _.current || O.stopPropagation());
          }),
        })
      );
    }
  );
Nb.displayName = Tb;
var Ob = y.forwardRef((t, r) => {
  const {
    __scopeCheckbox: o,
    name: l,
    checked: c,
    defaultChecked: u,
    required: d,
    disabled: h,
    value: p,
    onCheckedChange: m,
    form: v,
    ...x
  } = t;
  return g.jsx(QA, {
    __scopeCheckbox: o,
    checked: c,
    defaultChecked: u,
    disabled: h,
    required: d,
    onCheckedChange: m,
    name: l,
    form: v,
    value: p,
    internal_do_not_use_render: ({ isFormControl: _ }) =>
      g.jsxs(g.Fragment, {
        children: [
          g.jsx(Nb, { ...x, ref: r, __scopeCheckbox: o }),
          _ && g.jsx(Mb, { __scopeCheckbox: o }),
        ],
      }),
  });
});
Ob.displayName = ms;
var Db = "CheckboxIndicator",
  jb = y.forwardRef((t, r) => {
    const { __scopeCheckbox: o, forceMount: l, ...c } = t,
      u = Fd(Db, o);
    return g.jsx(Yr, {
      present: l || Ur(u.checked) || u.checked === !0,
      children: g.jsx(De.span, {
        "data-state": kb(u.checked),
        "data-disabled": u.disabled ? "" : void 0,
        ...c,
        ref: r,
        style: { pointerEvents: "none", ...t.style },
      }),
    });
  });
jb.displayName = Db;
var zb = "CheckboxBubbleInput",
  Mb = y.forwardRef(({ __scopeCheckbox: t, ...r }, o) => {
    const {
        control: l,
        hasConsumerStoppedPropagationRef: c,
        checked: u,
        defaultChecked: d,
        required: h,
        disabled: p,
        name: m,
        value: v,
        form: x,
        bubbleInput: _,
        setBubbleInput: E,
      } = Fd(zb, t),
      R = Be(o, E),
      w = Kd(u),
      C = Qd(l);
    y.useEffect(() => {
      const D = _;
      if (!D) return;
      const j = window.HTMLInputElement.prototype,
        L = Object.getOwnPropertyDescriptor(j, "checked").set,
        F = !c.current;
      if (w !== u && L) {
        const Y = new Event("click", { bubbles: F });
        (D.indeterminate = Ur(u)),
          L.call(D, Ur(u) ? !1 : u),
          D.dispatchEvent(Y);
      }
    }, [_, w, u, c]);
    const O = y.useRef(Ur(u) ? !1 : u);
    return g.jsx(De.input, {
      type: "checkbox",
      "aria-hidden": !0,
      defaultChecked: d ?? O.current,
      required: h,
      disabled: p,
      name: m,
      value: v,
      form: x,
      ...r,
      tabIndex: -1,
      ref: R,
      style: {
        ...r.style,
        ...C,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
        transform: "translateX(-100%)",
      },
    });
  });
Mb.displayName = zb;
function FA(t) {
  return typeof t == "function";
}
function Ur(t) {
  return t === "indeterminate";
}
function kb(t) {
  return Ur(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
function Do({ className: t, ...r }) {
  return g.jsx(Ob, {
    "data-slot": "checkbox",
    className: lt(
      "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-md border shadow-lg transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      t
    ),
    ...r,
    children: g.jsx(jb, {
      "data-slot": "checkbox-indicator",
      className:
        "flex items-center justify-center text-current transition-none",
      children: g.jsx(Eb, { className: "size-3.5" }),
    }),
  });
}
function JA({ isUseOptimalEventChoice: t, setIsUseOptimalEventChoice: r }) {
  return g.jsxs("label", {
    htmlFor: "is-optimal-event",
    className: "flex gap-2 items-center",
    children: [
      g.jsx(Do, {
        id: "is-optimal-event",
        checked: t,
        onCheckedChange: () => r(!t),
      }),
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Use Optimal Event?",
      }),
    ],
  });
}
var WA = zy[" useId ".trim().toString()] || (() => {}),
  eT = 0;
function Br(t) {
  const [r, o] = y.useState(WA());
  return (
    Mt(() => {
      o((l) => l ?? String(eT++));
    }, [t]),
    r ? `radix-${r}` : ""
  );
}
function Zr(t) {
  const r = y.useRef(t);
  return (
    y.useEffect(() => {
      r.current = t;
    }),
    y.useMemo(
      () =>
        (...o) =>
          r.current?.(...o),
      []
    )
  );
}
function tT(t, r = globalThis?.document) {
  const o = Zr(t);
  y.useEffect(() => {
    const l = (c) => {
      c.key === "Escape" && o(c);
    };
    return (
      r.addEventListener("keydown", l, { capture: !0 }),
      () => r.removeEventListener("keydown", l, { capture: !0 })
    );
  }, [o, r]);
}
var nT = "DismissableLayer",
  Sd = "dismissableLayer.update",
  rT = "dismissableLayer.pointerDownOutside",
  aT = "dismissableLayer.focusOutside",
  Kv,
  Lb = y.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  ps = y.forwardRef((t, r) => {
    const {
        disableOutsidePointerEvents: o = !1,
        onEscapeKeyDown: l,
        onPointerDownOutside: c,
        onFocusOutside: u,
        onInteractOutside: d,
        onDismiss: h,
        ...p
      } = t,
      m = y.useContext(Lb),
      [v, x] = y.useState(null),
      _ = v?.ownerDocument ?? globalThis?.document,
      [, E] = y.useState({}),
      R = Be(r, (Y) => x(Y)),
      w = Array.from(m.layers),
      [C] = [...m.layersWithOutsidePointerEventsDisabled].slice(-1),
      O = w.indexOf(C),
      D = v ? w.indexOf(v) : -1,
      j = m.layersWithOutsidePointerEventsDisabled.size > 0,
      B = D >= O,
      L = iT((Y) => {
        const G = Y.target,
          te = [...m.branches].some((se) => se.contains(G));
        !B || te || (c?.(Y), d?.(Y), Y.defaultPrevented || h?.());
      }, _),
      F = cT((Y) => {
        const G = Y.target;
        [...m.branches].some((se) => se.contains(G)) ||
          (u?.(Y), d?.(Y), Y.defaultPrevented || h?.());
      }, _);
    return (
      tT((Y) => {
        D === m.layers.size - 1 &&
          (l?.(Y), !Y.defaultPrevented && h && (Y.preventDefault(), h()));
      }, _),
      y.useEffect(() => {
        if (v)
          return (
            o &&
              (m.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Kv = _.body.style.pointerEvents),
                (_.body.style.pointerEvents = "none")),
              m.layersWithOutsidePointerEventsDisabled.add(v)),
            m.layers.add(v),
            Qv(),
            () => {
              o &&
                m.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (_.body.style.pointerEvents = Kv);
            }
          );
      }, [v, _, o, m]),
      y.useEffect(
        () => () => {
          v &&
            (m.layers.delete(v),
            m.layersWithOutsidePointerEventsDisabled.delete(v),
            Qv());
        },
        [v, m]
      ),
      y.useEffect(() => {
        const Y = () => E({});
        return (
          document.addEventListener(Sd, Y),
          () => document.removeEventListener(Sd, Y)
        );
      }, []),
      g.jsx(De.div, {
        ...p,
        ref: R,
        style: {
          pointerEvents: j ? (B ? "auto" : "none") : void 0,
          ...t.style,
        },
        onFocusCapture: Se(t.onFocusCapture, F.onFocusCapture),
        onBlurCapture: Se(t.onBlurCapture, F.onBlurCapture),
        onPointerDownCapture: Se(
          t.onPointerDownCapture,
          L.onPointerDownCapture
        ),
      })
    );
  });
ps.displayName = nT;
var oT = "DismissableLayerBranch",
  lT = y.forwardRef((t, r) => {
    const o = y.useContext(Lb),
      l = y.useRef(null),
      c = Be(r, l);
    return (
      y.useEffect(() => {
        const u = l.current;
        if (u)
          return (
            o.branches.add(u),
            () => {
              o.branches.delete(u);
            }
          );
      }, [o.branches]),
      g.jsx(De.div, { ...t, ref: c })
    );
  });
lT.displayName = oT;
function iT(t, r = globalThis?.document) {
  const o = Zr(t),
    l = y.useRef(!1),
    c = y.useRef(() => {});
  return (
    y.useEffect(() => {
      const u = (h) => {
          if (h.target && !l.current) {
            let p = function () {
              Ub(rT, o, m, { discrete: !0 });
            };
            const m = { originalEvent: h };
            h.pointerType === "touch"
              ? (r.removeEventListener("click", c.current),
                (c.current = p),
                r.addEventListener("click", c.current, { once: !0 }))
              : p();
          } else r.removeEventListener("click", c.current);
          l.current = !1;
        },
        d = window.setTimeout(() => {
          r.addEventListener("pointerdown", u);
        }, 0);
      return () => {
        window.clearTimeout(d),
          r.removeEventListener("pointerdown", u),
          r.removeEventListener("click", c.current);
      };
    }, [r, o]),
    { onPointerDownCapture: () => (l.current = !0) }
  );
}
function cT(t, r = globalThis?.document) {
  const o = Zr(t),
    l = y.useRef(!1);
  return (
    y.useEffect(() => {
      const c = (u) => {
        u.target &&
          !l.current &&
          Ub(aT, o, { originalEvent: u }, { discrete: !1 });
      };
      return (
        r.addEventListener("focusin", c),
        () => r.removeEventListener("focusin", c)
      );
    }, [r, o]),
    {
      onFocusCapture: () => (l.current = !0),
      onBlurCapture: () => (l.current = !1),
    }
  );
}
function Qv() {
  const t = new CustomEvent(Sd);
  document.dispatchEvent(t);
}
function Ub(t, r, o, { discrete: l }) {
  const c = o.originalEvent.target,
    u = new CustomEvent(t, { bubbles: !1, cancelable: !0, detail: o });
  r && c.addEventListener(t, r, { once: !0 }),
    l ? PA(c, u) : c.dispatchEvent(u);
}
var Jf = "focusScope.autoFocusOnMount",
  Wf = "focusScope.autoFocusOnUnmount",
  Fv = { bubbles: !1, cancelable: !0 },
  sT = "FocusScope",
  Jd = y.forwardRef((t, r) => {
    const {
        loop: o = !1,
        trapped: l = !1,
        onMountAutoFocus: c,
        onUnmountAutoFocus: u,
        ...d
      } = t,
      [h, p] = y.useState(null),
      m = Zr(c),
      v = Zr(u),
      x = y.useRef(null),
      _ = Be(r, (w) => p(w)),
      E = y.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    y.useEffect(() => {
      if (l) {
        let w = function (j) {
            if (E.paused || !h) return;
            const B = j.target;
            h.contains(B) ? (x.current = B) : kr(x.current, { select: !0 });
          },
          C = function (j) {
            if (E.paused || !h) return;
            const B = j.relatedTarget;
            B !== null && (h.contains(B) || kr(x.current, { select: !0 }));
          },
          O = function (j) {
            if (document.activeElement === document.body)
              for (const L of j) L.removedNodes.length > 0 && kr(h);
          };
        document.addEventListener("focusin", w),
          document.addEventListener("focusout", C);
        const D = new MutationObserver(O);
        return (
          h && D.observe(h, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener("focusin", w),
              document.removeEventListener("focusout", C),
              D.disconnect();
          }
        );
      }
    }, [l, h, E.paused]),
      y.useEffect(() => {
        if (h) {
          Wv.add(E);
          const w = document.activeElement;
          if (!h.contains(w)) {
            const O = new CustomEvent(Jf, Fv);
            h.addEventListener(Jf, m),
              h.dispatchEvent(O),
              O.defaultPrevented ||
                (uT(pT(Bb(h)), { select: !0 }),
                document.activeElement === w && kr(h));
          }
          return () => {
            h.removeEventListener(Jf, m),
              setTimeout(() => {
                const O = new CustomEvent(Wf, Fv);
                h.addEventListener(Wf, v),
                  h.dispatchEvent(O),
                  O.defaultPrevented || kr(w ?? document.body, { select: !0 }),
                  h.removeEventListener(Wf, v),
                  Wv.remove(E);
              }, 0);
          };
        }
      }, [h, m, v, E]);
    const R = y.useCallback(
      (w) => {
        if ((!o && !l) || E.paused) return;
        const C = w.key === "Tab" && !w.altKey && !w.ctrlKey && !w.metaKey,
          O = document.activeElement;
        if (C && O) {
          const D = w.currentTarget,
            [j, B] = fT(D);
          j && B
            ? !w.shiftKey && O === B
              ? (w.preventDefault(), o && kr(j, { select: !0 }))
              : w.shiftKey &&
                O === j &&
                (w.preventDefault(), o && kr(B, { select: !0 }))
            : O === D && w.preventDefault();
        }
      },
      [o, l, E.paused]
    );
    return g.jsx(De.div, { tabIndex: -1, ...d, ref: _, onKeyDown: R });
  });
Jd.displayName = sT;
function uT(t, { select: r = !1 } = {}) {
  const o = document.activeElement;
  for (const l of t)
    if ((kr(l, { select: r }), document.activeElement !== o)) return;
}
function fT(t) {
  const r = Bb(t),
    o = Jv(r, t),
    l = Jv(r.reverse(), t);
  return [o, l];
}
function Bb(t) {
  const r = [],
    o = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (l) => {
        const c = l.tagName === "INPUT" && l.type === "hidden";
        return l.disabled || l.hidden || c
          ? NodeFilter.FILTER_SKIP
          : l.tabIndex >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  for (; o.nextNode(); ) r.push(o.currentNode);
  return r;
}
function Jv(t, r) {
  for (const o of t) if (!dT(o, { upTo: r })) return o;
}
function dT(t, { upTo: r }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (r !== void 0 && t === r) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function hT(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function kr(t, { select: r = !1 } = {}) {
  if (t && t.focus) {
    const o = document.activeElement;
    t.focus({ preventScroll: !0 }), t !== o && hT(t) && r && t.select();
  }
}
var Wv = mT();
function mT() {
  let t = [];
  return {
    add(r) {
      const o = t[0];
      r !== o && o?.pause(), (t = ey(t, r)), t.unshift(r);
    },
    remove(r) {
      (t = ey(t, r)), t[0]?.resume();
    },
  };
}
function ey(t, r) {
  const o = [...t],
    l = o.indexOf(r);
  return l !== -1 && o.splice(l, 1), o;
}
function pT(t) {
  return t.filter((r) => r.tagName !== "A");
}
var gT = "Portal",
  gs = y.forwardRef((t, r) => {
    const { container: o, ...l } = t,
      [c, u] = y.useState(!1);
    Mt(() => u(!0), []);
    const d = o || (c && globalThis?.document?.body);
    return d ? IA.createPortal(g.jsx(De.div, { ...l, ref: r }), d) : null;
  });
gs.displayName = gT;
var ed = 0;
function Zb() {
  y.useEffect(() => {
    const t = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", t[0] ?? ty()),
      document.body.insertAdjacentElement("beforeend", t[1] ?? ty()),
      ed++,
      () => {
        ed === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((r) => r.remove()),
          ed--;
      }
    );
  }, []);
}
function ty() {
  const t = document.createElement("span");
  return (
    t.setAttribute("data-radix-focus-guard", ""),
    (t.tabIndex = 0),
    (t.style.outline = "none"),
    (t.style.opacity = "0"),
    (t.style.position = "fixed"),
    (t.style.pointerEvents = "none"),
    t
  );
}
var kn = function () {
  return (
    (kn =
      Object.assign ||
      function (r) {
        for (var o, l = 1, c = arguments.length; l < c; l++) {
          o = arguments[l];
          for (var u in o)
            Object.prototype.hasOwnProperty.call(o, u) && (r[u] = o[u]);
        }
        return r;
      }),
    kn.apply(this, arguments)
  );
};
function Hb(t, r) {
  var o = {};
  for (var l in t)
    Object.prototype.hasOwnProperty.call(t, l) &&
      r.indexOf(l) < 0 &&
      (o[l] = t[l]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var c = 0, l = Object.getOwnPropertySymbols(t); c < l.length; c++)
      r.indexOf(l[c]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(t, l[c]) &&
        (o[l[c]] = t[l[c]]);
  return o;
}
function vT(t, r, o) {
  if (o || arguments.length === 2)
    for (var l = 0, c = r.length, u; l < c; l++)
      (u || !(l in r)) &&
        (u || (u = Array.prototype.slice.call(r, 0, l)), (u[l] = r[l]));
  return t.concat(u || Array.prototype.slice.call(r));
}
var Hc = "right-scroll-bar-position",
  $c = "width-before-scroll-bar",
  yT = "with-scroll-bars-hidden",
  bT = "--removed-body-scroll-bar-size";
function td(t, r) {
  return typeof t == "function" ? t(r) : t && (t.current = r), t;
}
function xT(t, r) {
  var o = y.useState(function () {
    return {
      value: t,
      callback: r,
      facade: {
        get current() {
          return o.value;
        },
        set current(l) {
          var c = o.value;
          c !== l && ((o.value = l), o.callback(l, c));
        },
      },
    };
  })[0];
  return (o.callback = r), o.facade;
}
var ST = typeof window < "u" ? y.useLayoutEffect : y.useEffect,
  ny = new WeakMap();
function wT(t, r) {
  var o = xT(null, function (l) {
    return t.forEach(function (c) {
      return td(c, l);
    });
  });
  return (
    ST(
      function () {
        var l = ny.get(o);
        if (l) {
          var c = new Set(l),
            u = new Set(t),
            d = o.current;
          c.forEach(function (h) {
            u.has(h) || td(h, null);
          }),
            u.forEach(function (h) {
              c.has(h) || td(h, d);
            });
        }
        ny.set(o, t);
      },
      [t]
    ),
    o
  );
}
function _T(t) {
  return t;
}
function ET(t, r) {
  r === void 0 && (r = _T);
  var o = [],
    l = !1,
    c = {
      read: function () {
        if (l)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`."
          );
        return o.length ? o[o.length - 1] : t;
      },
      useMedium: function (u) {
        var d = r(u, l);
        return (
          o.push(d),
          function () {
            o = o.filter(function (h) {
              return h !== d;
            });
          }
        );
      },
      assignSyncMedium: function (u) {
        for (l = !0; o.length; ) {
          var d = o;
          (o = []), d.forEach(u);
        }
        o = {
          push: function (h) {
            return u(h);
          },
          filter: function () {
            return o;
          },
        };
      },
      assignMedium: function (u) {
        l = !0;
        var d = [];
        if (o.length) {
          var h = o;
          (o = []), h.forEach(u), (d = o);
        }
        var p = function () {
            var v = d;
            (d = []), v.forEach(u);
          },
          m = function () {
            return Promise.resolve().then(p);
          };
        m(),
          (o = {
            push: function (v) {
              d.push(v), m();
            },
            filter: function (v) {
              return (d = d.filter(v)), o;
            },
          });
      },
    };
  return c;
}
function CT(t) {
  t === void 0 && (t = {});
  var r = ET(null);
  return (r.options = kn({ async: !0, ssr: !1 }, t)), r;
}
var $b = function (t) {
  var r = t.sideCar,
    o = Hb(t, ["sideCar"]);
  if (!r)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car"
    );
  var l = r.read();
  if (!l) throw new Error("Sidecar medium not found");
  return y.createElement(l, kn({}, o));
};
$b.isSideCarExport = !0;
function RT(t, r) {
  return t.useMedium(r), $b;
}
var Gb = CT(),
  nd = function () {},
  vs = y.forwardRef(function (t, r) {
    var o = y.useRef(null),
      l = y.useState({
        onScrollCapture: nd,
        onWheelCapture: nd,
        onTouchMoveCapture: nd,
      }),
      c = l[0],
      u = l[1],
      d = t.forwardProps,
      h = t.children,
      p = t.className,
      m = t.removeScrollBar,
      v = t.enabled,
      x = t.shards,
      _ = t.sideCar,
      E = t.noRelative,
      R = t.noIsolation,
      w = t.inert,
      C = t.allowPinchZoom,
      O = t.as,
      D = O === void 0 ? "div" : O,
      j = t.gapMode,
      B = Hb(t, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      L = _,
      F = wT([o, r]),
      Y = kn(kn({}, B), c);
    return y.createElement(
      y.Fragment,
      null,
      v &&
        y.createElement(L, {
          sideCar: Gb,
          removeScrollBar: m,
          shards: x,
          noRelative: E,
          noIsolation: R,
          inert: w,
          setCallbacks: u,
          allowPinchZoom: !!C,
          lockRef: o,
          gapMode: j,
        }),
      d
        ? y.cloneElement(y.Children.only(h), kn(kn({}, Y), { ref: F }))
        : y.createElement(D, kn({}, Y, { className: p, ref: F }), h)
    );
  });
vs.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
vs.classNames = { fullWidth: $c, zeroRight: Hc };
var AT = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function TT() {
  if (!document) return null;
  var t = document.createElement("style");
  t.type = "text/css";
  var r = AT();
  return r && t.setAttribute("nonce", r), t;
}
function NT(t, r) {
  t.styleSheet
    ? (t.styleSheet.cssText = r)
    : t.appendChild(document.createTextNode(r));
}
function OT(t) {
  var r = document.head || document.getElementsByTagName("head")[0];
  r.appendChild(t);
}
var DT = function () {
    var t = 0,
      r = null;
    return {
      add: function (o) {
        t == 0 && (r = TT()) && (NT(r, o), OT(r)), t++;
      },
      remove: function () {
        t--,
          !t && r && (r.parentNode && r.parentNode.removeChild(r), (r = null));
      },
    };
  },
  jT = function () {
    var t = DT();
    return function (r, o) {
      y.useEffect(
        function () {
          return (
            t.add(r),
            function () {
              t.remove();
            }
          );
        },
        [r && o]
      );
    };
  },
  Yb = function () {
    var t = jT(),
      r = function (o) {
        var l = o.styles,
          c = o.dynamic;
        return t(l, c), null;
      };
    return r;
  },
  zT = { left: 0, top: 0, right: 0, gap: 0 },
  rd = function (t) {
    return parseInt(t || "", 10) || 0;
  },
  MT = function (t) {
    var r = window.getComputedStyle(document.body),
      o = r[t === "padding" ? "paddingLeft" : "marginLeft"],
      l = r[t === "padding" ? "paddingTop" : "marginTop"],
      c = r[t === "padding" ? "paddingRight" : "marginRight"];
    return [rd(o), rd(l), rd(c)];
  },
  kT = function (t) {
    if ((t === void 0 && (t = "margin"), typeof window > "u")) return zT;
    var r = MT(t),
      o = document.documentElement.clientWidth,
      l = window.innerWidth;
    return {
      left: r[0],
      top: r[1],
      right: r[2],
      gap: Math.max(0, l - o + r[2] - r[0]),
    };
  },
  LT = Yb(),
  So = "data-scroll-locked",
  UT = function (t, r, o, l) {
    var c = t.left,
      u = t.top,
      d = t.right,
      h = t.gap;
    return (
      o === void 0 && (o = "margin"),
      `
  .`
        .concat(
          yT,
          ` {
   overflow: hidden `
        )
        .concat(
          l,
          `;
   padding-right: `
        )
        .concat(h, "px ")
        .concat(
          l,
          `;
  }
  body[`
        )
        .concat(
          So,
          `] {
    overflow: hidden `
        )
        .concat(
          l,
          `;
    overscroll-behavior: contain;
    `
        )
        .concat(
          [
            r && "position: relative ".concat(l, ";"),
            o === "margin" &&
              `
    padding-left: `
                .concat(
                  c,
                  `px;
    padding-top: `
                )
                .concat(
                  u,
                  `px;
    padding-right: `
                )
                .concat(
                  d,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `
                )
                .concat(h, "px ")
                .concat(
                  l,
                  `;
    `
                ),
            o === "padding" &&
              "padding-right: ".concat(h, "px ").concat(l, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`
        )
        .concat(
          Hc,
          ` {
    right: `
        )
        .concat(h, "px ")
        .concat(
          l,
          `;
  }
  
  .`
        )
        .concat(
          $c,
          ` {
    margin-right: `
        )
        .concat(h, "px ")
        .concat(
          l,
          `;
  }
  
  .`
        )
        .concat(Hc, " .")
        .concat(
          Hc,
          ` {
    right: 0 `
        )
        .concat(
          l,
          `;
  }
  
  .`
        )
        .concat($c, " .")
        .concat(
          $c,
          ` {
    margin-right: 0 `
        )
        .concat(
          l,
          `;
  }
  
  body[`
        )
        .concat(
          So,
          `] {
    `
        )
        .concat(bT, ": ")
        .concat(
          h,
          `px;
  }
`
        )
    );
  },
  ry = function () {
    var t = parseInt(document.body.getAttribute(So) || "0", 10);
    return isFinite(t) ? t : 0;
  },
  BT = function () {
    y.useEffect(function () {
      return (
        document.body.setAttribute(So, (ry() + 1).toString()),
        function () {
          var t = ry() - 1;
          t <= 0
            ? document.body.removeAttribute(So)
            : document.body.setAttribute(So, t.toString());
        }
      );
    }, []);
  },
  ZT = function (t) {
    var r = t.noRelative,
      o = t.noImportant,
      l = t.gapMode,
      c = l === void 0 ? "margin" : l;
    BT();
    var u = y.useMemo(
      function () {
        return kT(c);
      },
      [c]
    );
    return y.createElement(LT, { styles: UT(u, !r, c, o ? "" : "!important") });
  },
  wd = !1;
if (typeof window < "u")
  try {
    var jc = Object.defineProperty({}, "passive", {
      get: function () {
        return (wd = !0), !0;
      },
    });
    window.addEventListener("test", jc, jc),
      window.removeEventListener("test", jc, jc);
  } catch {
    wd = !1;
  }
var mo = wd ? { passive: !1 } : !1,
  HT = function (t) {
    return t.tagName === "TEXTAREA";
  },
  Vb = function (t, r) {
    if (!(t instanceof Element)) return !1;
    var o = window.getComputedStyle(t);
    return (
      o[r] !== "hidden" &&
      !(o.overflowY === o.overflowX && !HT(t) && o[r] === "visible")
    );
  },
  $T = function (t) {
    return Vb(t, "overflowY");
  },
  GT = function (t) {
    return Vb(t, "overflowX");
  },
  ay = function (t, r) {
    var o = r.ownerDocument,
      l = r;
    do {
      typeof ShadowRoot < "u" && l instanceof ShadowRoot && (l = l.host);
      var c = Ib(t, l);
      if (c) {
        var u = qb(t, l),
          d = u[1],
          h = u[2];
        if (d > h) return !0;
      }
      l = l.parentNode;
    } while (l && l !== o.body);
    return !1;
  },
  YT = function (t) {
    var r = t.scrollTop,
      o = t.scrollHeight,
      l = t.clientHeight;
    return [r, o, l];
  },
  VT = function (t) {
    var r = t.scrollLeft,
      o = t.scrollWidth,
      l = t.clientWidth;
    return [r, o, l];
  },
  Ib = function (t, r) {
    return t === "v" ? $T(r) : GT(r);
  },
  qb = function (t, r) {
    return t === "v" ? YT(r) : VT(r);
  },
  IT = function (t, r) {
    return t === "h" && r === "rtl" ? -1 : 1;
  },
  qT = function (t, r, o, l, c) {
    var u = IT(t, window.getComputedStyle(r).direction),
      d = u * l,
      h = o.target,
      p = r.contains(h),
      m = !1,
      v = d > 0,
      x = 0,
      _ = 0;
    do {
      if (!h) break;
      var E = qb(t, h),
        R = E[0],
        w = E[1],
        C = E[2],
        O = w - C - u * R;
      (R || O) && Ib(t, h) && ((x += O), (_ += R));
      var D = h.parentNode;
      h = D && D.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? D.host : D;
    } while ((!p && h !== document.body) || (p && (r.contains(h) || r === h)));
    return ((v && Math.abs(x) < 1) || (!v && Math.abs(_) < 1)) && (m = !0), m;
  },
  zc = function (t) {
    return "changedTouches" in t
      ? [t.changedTouches[0].clientX, t.changedTouches[0].clientY]
      : [0, 0];
  },
  oy = function (t) {
    return [t.deltaX, t.deltaY];
  },
  ly = function (t) {
    return t && "current" in t ? t.current : t;
  },
  PT = function (t, r) {
    return t[0] === r[0] && t[1] === r[1];
  },
  XT = function (t) {
    return `
  .block-interactivity-`
      .concat(
        t,
        ` {pointer-events: none;}
  .allow-interactivity-`
      )
      .concat(
        t,
        ` {pointer-events: all;}
`
      );
  },
  KT = 0,
  po = [];
function QT(t) {
  var r = y.useRef([]),
    o = y.useRef([0, 0]),
    l = y.useRef(),
    c = y.useState(KT++)[0],
    u = y.useState(Yb)[0],
    d = y.useRef(t);
  y.useEffect(
    function () {
      d.current = t;
    },
    [t]
  ),
    y.useEffect(
      function () {
        if (t.inert) {
          document.body.classList.add("block-interactivity-".concat(c));
          var w = vT([t.lockRef.current], (t.shards || []).map(ly), !0).filter(
            Boolean
          );
          return (
            w.forEach(function (C) {
              return C.classList.add("allow-interactivity-".concat(c));
            }),
            function () {
              document.body.classList.remove("block-interactivity-".concat(c)),
                w.forEach(function (C) {
                  return C.classList.remove("allow-interactivity-".concat(c));
                });
            }
          );
        }
      },
      [t.inert, t.lockRef.current, t.shards]
    );
  var h = y.useCallback(function (w, C) {
      if (
        ("touches" in w && w.touches.length === 2) ||
        (w.type === "wheel" && w.ctrlKey)
      )
        return !d.current.allowPinchZoom;
      var O = zc(w),
        D = o.current,
        j = "deltaX" in w ? w.deltaX : D[0] - O[0],
        B = "deltaY" in w ? w.deltaY : D[1] - O[1],
        L,
        F = w.target,
        Y = Math.abs(j) > Math.abs(B) ? "h" : "v";
      if ("touches" in w && Y === "h" && F.type === "range") return !1;
      var G = ay(Y, F);
      if (!G) return !0;
      if ((G ? (L = Y) : ((L = Y === "v" ? "h" : "v"), (G = ay(Y, F))), !G))
        return !1;
      if (
        (!l.current && "changedTouches" in w && (j || B) && (l.current = L), !L)
      )
        return !0;
      var te = l.current || L;
      return qT(te, C, w, te === "h" ? j : B);
    }, []),
    p = y.useCallback(function (w) {
      var C = w;
      if (!(!po.length || po[po.length - 1] !== u)) {
        var O = "deltaY" in C ? oy(C) : zc(C),
          D = r.current.filter(function (L) {
            return (
              L.name === C.type &&
              (L.target === C.target || C.target === L.shadowParent) &&
              PT(L.delta, O)
            );
          })[0];
        if (D && D.should) {
          C.cancelable && C.preventDefault();
          return;
        }
        if (!D) {
          var j = (d.current.shards || [])
              .map(ly)
              .filter(Boolean)
              .filter(function (L) {
                return L.contains(C.target);
              }),
            B = j.length > 0 ? h(C, j[0]) : !d.current.noIsolation;
          B && C.cancelable && C.preventDefault();
        }
      }
    }, []),
    m = y.useCallback(function (w, C, O, D) {
      var j = { name: w, delta: C, target: O, should: D, shadowParent: FT(O) };
      r.current.push(j),
        setTimeout(function () {
          r.current = r.current.filter(function (B) {
            return B !== j;
          });
        }, 1);
    }, []),
    v = y.useCallback(function (w) {
      (o.current = zc(w)), (l.current = void 0);
    }, []),
    x = y.useCallback(function (w) {
      m(w.type, oy(w), w.target, h(w, t.lockRef.current));
    }, []),
    _ = y.useCallback(function (w) {
      m(w.type, zc(w), w.target, h(w, t.lockRef.current));
    }, []);
  y.useEffect(function () {
    return (
      po.push(u),
      t.setCallbacks({
        onScrollCapture: x,
        onWheelCapture: x,
        onTouchMoveCapture: _,
      }),
      document.addEventListener("wheel", p, mo),
      document.addEventListener("touchmove", p, mo),
      document.addEventListener("touchstart", v, mo),
      function () {
        (po = po.filter(function (w) {
          return w !== u;
        })),
          document.removeEventListener("wheel", p, mo),
          document.removeEventListener("touchmove", p, mo),
          document.removeEventListener("touchstart", v, mo);
      }
    );
  }, []);
  var E = t.removeScrollBar,
    R = t.inert;
  return y.createElement(
    y.Fragment,
    null,
    R ? y.createElement(u, { styles: XT(c) }) : null,
    E
      ? y.createElement(ZT, { noRelative: t.noRelative, gapMode: t.gapMode })
      : null
  );
}
function FT(t) {
  for (var r = null; t !== null; )
    t instanceof ShadowRoot && ((r = t.host), (t = t.host)), (t = t.parentNode);
  return r;
}
const JT = RT(Gb, QT);
var Wd = y.forwardRef(function (t, r) {
  return y.createElement(vs, kn({}, t, { ref: r, sideCar: JT }));
});
Wd.classNames = vs.classNames;
var WT = function (t) {
    if (typeof document > "u") return null;
    var r = Array.isArray(t) ? t[0] : t;
    return r.ownerDocument.body;
  },
  go = new WeakMap(),
  Mc = new WeakMap(),
  kc = {},
  ad = 0,
  Pb = function (t) {
    return t && (t.host || Pb(t.parentNode));
  },
  eN = function (t, r) {
    return r
      .map(function (o) {
        if (t.contains(o)) return o;
        var l = Pb(o);
        return l && t.contains(l)
          ? l
          : (console.error(
              "aria-hidden",
              o,
              "in not contained inside",
              t,
              ". Doing nothing"
            ),
            null);
      })
      .filter(function (o) {
        return !!o;
      });
  },
  tN = function (t, r, o, l) {
    var c = eN(r, Array.isArray(t) ? t : [t]);
    kc[o] || (kc[o] = new WeakMap());
    var u = kc[o],
      d = [],
      h = new Set(),
      p = new Set(c),
      m = function (x) {
        !x || h.has(x) || (h.add(x), m(x.parentNode));
      };
    c.forEach(m);
    var v = function (x) {
      !x ||
        p.has(x) ||
        Array.prototype.forEach.call(x.children, function (_) {
          if (h.has(_)) v(_);
          else
            try {
              var E = _.getAttribute(l),
                R = E !== null && E !== "false",
                w = (go.get(_) || 0) + 1,
                C = (u.get(_) || 0) + 1;
              go.set(_, w),
                u.set(_, C),
                d.push(_),
                w === 1 && R && Mc.set(_, !0),
                C === 1 && _.setAttribute(o, "true"),
                R || _.setAttribute(l, "true");
            } catch (O) {
              console.error("aria-hidden: cannot operate on ", _, O);
            }
        });
    };
    return (
      v(r),
      h.clear(),
      ad++,
      function () {
        d.forEach(function (x) {
          var _ = go.get(x) - 1,
            E = u.get(x) - 1;
          go.set(x, _),
            u.set(x, E),
            _ || (Mc.has(x) || x.removeAttribute(l), Mc.delete(x)),
            E || x.removeAttribute(o);
        }),
          ad--,
          ad ||
            ((go = new WeakMap()),
            (go = new WeakMap()),
            (Mc = new WeakMap()),
            (kc = {}));
      }
    );
  },
  Xb = function (t, r, o) {
    o === void 0 && (o = "data-aria-hidden");
    var l = Array.from(Array.isArray(t) ? t : [t]),
      c = WT(t);
    return c
      ? (l.push.apply(l, Array.from(c.querySelectorAll("[aria-live], script"))),
        tN(l, c, o, "aria-hidden"))
      : function () {
          return null;
        };
  },
  ys = "Dialog",
  [Kb, GM] = sr(ys),
  [nN, An] = Kb(ys),
  Qb = (t) => {
    const {
        __scopeDialog: r,
        children: o,
        open: l,
        defaultOpen: c,
        onOpenChange: u,
        modal: d = !0,
      } = t,
      h = y.useRef(null),
      p = y.useRef(null),
      [m, v] = va({ prop: l, defaultProp: c ?? !1, onChange: u, caller: ys });
    return g.jsx(nN, {
      scope: r,
      triggerRef: h,
      contentRef: p,
      contentId: Br(),
      titleId: Br(),
      descriptionId: Br(),
      open: m,
      onOpenChange: v,
      onOpenToggle: y.useCallback(() => v((x) => !x), [v]),
      modal: d,
      children: o,
    });
  };
Qb.displayName = ys;
var Fb = "DialogTrigger",
  Jb = y.forwardRef((t, r) => {
    const { __scopeDialog: o, ...l } = t,
      c = An(Fb, o),
      u = Be(r, c.triggerRef);
    return g.jsx(De.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": c.open,
      "aria-controls": c.contentId,
      "data-state": nh(c.open),
      ...l,
      ref: u,
      onClick: Se(t.onClick, c.onOpenToggle),
    });
  });
Jb.displayName = Fb;
var eh = "DialogPortal",
  [rN, Wb] = Kb(eh, { forceMount: void 0 }),
  e0 = (t) => {
    const { __scopeDialog: r, forceMount: o, children: l, container: c } = t,
      u = An(eh, r);
    return g.jsx(rN, {
      scope: r,
      forceMount: o,
      children: y.Children.map(l, (d) =>
        g.jsx(Yr, {
          present: o || u.open,
          children: g.jsx(gs, { asChild: !0, container: c, children: d }),
        })
      ),
    });
  };
e0.displayName = eh;
var Kc = "DialogOverlay",
  t0 = y.forwardRef((t, r) => {
    const o = Wb(Kc, t.__scopeDialog),
      { forceMount: l = o.forceMount, ...c } = t,
      u = An(Kc, t.__scopeDialog);
    return u.modal
      ? g.jsx(Yr, {
          present: l || u.open,
          children: g.jsx(oN, { ...c, ref: r }),
        })
      : null;
  });
t0.displayName = Kc;
var aN = Ro("DialogOverlay.RemoveScroll"),
  oN = y.forwardRef((t, r) => {
    const { __scopeDialog: o, ...l } = t,
      c = An(Kc, o);
    return g.jsx(Wd, {
      as: aN,
      allowPinchZoom: !0,
      shards: [c.contentRef],
      children: g.jsx(De.div, {
        "data-state": nh(c.open),
        ...l,
        ref: r,
        style: { pointerEvents: "auto", ...l.style },
      }),
    });
  }),
  ya = "DialogContent",
  n0 = y.forwardRef((t, r) => {
    const o = Wb(ya, t.__scopeDialog),
      { forceMount: l = o.forceMount, ...c } = t,
      u = An(ya, t.__scopeDialog);
    return g.jsx(Yr, {
      present: l || u.open,
      children: u.modal
        ? g.jsx(lN, { ...c, ref: r })
        : g.jsx(iN, { ...c, ref: r }),
    });
  });
n0.displayName = ya;
var lN = y.forwardRef((t, r) => {
    const o = An(ya, t.__scopeDialog),
      l = y.useRef(null),
      c = Be(r, o.contentRef, l);
    return (
      y.useEffect(() => {
        const u = l.current;
        if (u) return Xb(u);
      }, []),
      g.jsx(r0, {
        ...t,
        ref: c,
        trapFocus: o.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Se(t.onCloseAutoFocus, (u) => {
          u.preventDefault(), o.triggerRef.current?.focus();
        }),
        onPointerDownOutside: Se(t.onPointerDownOutside, (u) => {
          const d = u.detail.originalEvent,
            h = d.button === 0 && d.ctrlKey === !0;
          (d.button === 2 || h) && u.preventDefault();
        }),
        onFocusOutside: Se(t.onFocusOutside, (u) => u.preventDefault()),
      })
    );
  }),
  iN = y.forwardRef((t, r) => {
    const o = An(ya, t.__scopeDialog),
      l = y.useRef(!1),
      c = y.useRef(!1);
    return g.jsx(r0, {
      ...t,
      ref: r,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (u) => {
        t.onCloseAutoFocus?.(u),
          u.defaultPrevented ||
            (l.current || o.triggerRef.current?.focus(), u.preventDefault()),
          (l.current = !1),
          (c.current = !1);
      },
      onInteractOutside: (u) => {
        t.onInteractOutside?.(u),
          u.defaultPrevented ||
            ((l.current = !0),
            u.detail.originalEvent.type === "pointerdown" && (c.current = !0));
        const d = u.target;
        o.triggerRef.current?.contains(d) && u.preventDefault(),
          u.detail.originalEvent.type === "focusin" &&
            c.current &&
            u.preventDefault();
      },
    });
  }),
  r0 = y.forwardRef((t, r) => {
    const {
        __scopeDialog: o,
        trapFocus: l,
        onOpenAutoFocus: c,
        onCloseAutoFocus: u,
        ...d
      } = t,
      h = An(ya, o),
      p = y.useRef(null),
      m = Be(r, p);
    return (
      Zb(),
      g.jsxs(g.Fragment, {
        children: [
          g.jsx(Jd, {
            asChild: !0,
            loop: !0,
            trapped: l,
            onMountAutoFocus: c,
            onUnmountAutoFocus: u,
            children: g.jsx(ps, {
              role: "dialog",
              id: h.contentId,
              "aria-describedby": h.descriptionId,
              "aria-labelledby": h.titleId,
              "data-state": nh(h.open),
              ...d,
              ref: m,
              onDismiss: () => h.onOpenChange(!1),
            }),
          }),
          g.jsxs(g.Fragment, {
            children: [
              g.jsx(sN, { titleId: h.titleId }),
              g.jsx(fN, { contentRef: p, descriptionId: h.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  th = "DialogTitle",
  a0 = y.forwardRef((t, r) => {
    const { __scopeDialog: o, ...l } = t,
      c = An(th, o);
    return g.jsx(De.h2, { id: c.titleId, ...l, ref: r });
  });
a0.displayName = th;
var o0 = "DialogDescription",
  cN = y.forwardRef((t, r) => {
    const { __scopeDialog: o, ...l } = t,
      c = An(o0, o);
    return g.jsx(De.p, { id: c.descriptionId, ...l, ref: r });
  });
cN.displayName = o0;
var l0 = "DialogClose",
  i0 = y.forwardRef((t, r) => {
    const { __scopeDialog: o, ...l } = t,
      c = An(l0, o);
    return g.jsx(De.button, {
      type: "button",
      ...l,
      ref: r,
      onClick: Se(t.onClick, () => c.onOpenChange(!1)),
    });
  });
i0.displayName = l0;
function nh(t) {
  return t ? "open" : "closed";
}
var c0 = "DialogTitleWarning",
  [YM, s0] = UA(c0, { contentName: ya, titleName: th, docsSlug: "dialog" }),
  sN = ({ titleId: t }) => {
    const r = s0(c0),
      o = `\`${r.contentName}\` requires a \`${r.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${r.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${r.docsSlug}`;
    return (
      y.useEffect(() => {
        t && (document.getElementById(t) || console.error(o));
      }, [o, t]),
      null
    );
  },
  uN = "DialogDescriptionWarning",
  fN = ({ contentRef: t, descriptionId: r }) => {
    const l = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${
      s0(uN).contentName
    }}.`;
    return (
      y.useEffect(() => {
        const c = t.current?.getAttribute("aria-describedby");
        r && c && (document.getElementById(r) || console.warn(l));
      }, [l, t, r]),
      null
    );
  },
  dN = Qb,
  hN = Jb,
  mN = e0,
  pN = t0,
  gN = n0,
  vN = a0,
  yN = i0;
function Ql({ ...t }) {
  return g.jsx(dN, { "data-slot": "dialog", ...t });
}
function Fl({ ...t }) {
  return g.jsx(hN, { "data-slot": "dialog-trigger", ...t });
}
function bN({ ...t }) {
  return g.jsx(mN, { "data-slot": "dialog-portal", ...t });
}
function xN({ className: t, ...r }) {
  return g.jsx(pN, {
    "data-slot": "dialog-overlay",
    className: lt(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      t
    ),
    ...r,
  });
}
function Jl({ className: t, children: r, showCloseButton: o = !0, ...l }) {
  return g.jsxs(bN, {
    "data-slot": "dialog-portal",
    children: [
      g.jsx(xN, {}),
      g.jsxs(gN, {
        "data-slot": "dialog-content",
        className: lt(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border p-6 shadow-2xl duration-200 sm:max-w-6xl",
          t
        ),
        ...l,
        children: [
          r,
          o &&
            g.jsxs(yN, {
              "data-slot": "dialog-close",
              className:
                "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                g.jsx(Xd, {}),
                g.jsx("span", { className: "sr-only", children: "Close" }),
              ],
            }),
        ],
      }),
    ],
  });
}
function Wl({ className: t, ...r }) {
  return g.jsx("div", {
    "data-slot": "dialog-header",
    className: lt("flex flex-col gap-2 text-center sm:text-left h-fit", t),
    ...r,
  });
}
function ei({ className: t, ...r }) {
  return g.jsx(vN, {
    "data-slot": "dialog-title",
    className: lt("text-xl leading-none font-semibold", t),
    ...r,
  });
}
const SN = db(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
function ti({ className: t, variant: r, asChild: o = !1, ...l }) {
  const c = o ? cb : "span";
  return g.jsx(c, {
    "data-slot": "badge",
    className: lt(SN({ variant: r }), t),
    ...l,
  });
}
function wo({ className: t, ...r }) {
  return g.jsx("div", {
    "data-slot": "card",
    className: lt(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      t
    ),
    ...r,
  });
}
function Gc({ className: t, ...r }) {
  return g.jsx("div", {
    "data-slot": "card-header",
    className: lt(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      t
    ),
    ...r,
  });
}
function Yc({ className: t, ...r }) {
  return g.jsx("div", {
    "data-slot": "card-title",
    className: lt("leading-none font-semibold", t),
    ...r,
  });
}
function _o({ className: t, ...r }) {
  return g.jsx("div", {
    "data-slot": "card-content",
    className: lt("px-6", t),
    ...r,
  });
}
function u0({
  eventChoicesConfig: t,
  event: r,
  addEventList: o,
  deleteEventList: l,
}) {
  const c = t.some((u) => u.event_name === r.event_name);
  return g.jsxs(
    wo,
    {
      className: `relative transition-all ${
        c
          ? "border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          : "border-border/60 hover:shadow-md"
      }`,
      children: [
        g.jsxs(Gc, {
          className: "pb-2 flex items-center justify-between",
          children: [
            g.jsxs(Yc, {
              className: "text-base flex flex-col gap-2",
              children: [
                g.jsx("span", { children: r.event_name }),
                c &&
                  g.jsx(ti, {
                    variant: "outline",
                    className: "bg-primary/10 text-primary border-primary/30",
                    title: r.character_name,
                    children: r.character_name,
                  }),
              ],
            }),
            l &&
              c &&
              g.jsx(en, {
                variant: "ghost",
                size: "icon",
                onClick: () => l(r.event_name),
                className: "text-muted-foreground hover:text-destructive",
                children: g.jsx(Ab, { size: 16 }),
              }),
          ],
        }),
        g.jsx(_o, {
          children: g.jsx("div", {
            className: "space-y-3",
            children: r.choices.map((u) =>
              g.jsx(
                "div",
                {
                  onClick: () => {
                    parseInt(u.choice_number) !== 0 &&
                      o({
                        character_name: r.character_name,
                        event_name: r.event_name,
                        chosen: parseInt(u.choice_number),
                      });
                  },
                  className: `${
                    t.some(
                      (d) =>
                        d.event_name === r.event_name &&
                        d.chosen === parseInt(u.choice_number)
                    )
                      ? "border-l-4 border-primary bg-primary/10"
                      : "border-l-4 border-transparent hover:border-primary/50 hover:bg-muted/10"
                  } pl-4 py-3 rounded-r-md transition cursor-pointer`,
                  children: g.jsx("div", {
                    className: "flex justify-between items-start",
                    children: g.jsxs("div", {
                      className: "flex-1",
                      children: [
                        g.jsxs("p", {
                          className: "text-sm font-medium pr-1",
                          children: [
                            "Choice ",
                            u.choice_number,
                            ": ",
                            u.choice_text,
                          ],
                        }),
                        g.jsx("div", {
                          className: "mt-2 space-y-1",
                          children: u.variants.map((d, h) =>
                            g.jsxs(
                              "p",
                              {
                                className: "text-sm text-muted-foreground",
                                children: [
                                  d.success_type !== "-" &&
                                    g.jsxs("span", {
                                      className:
                                        "font-semibold text-foreground mr-1",
                                      children: [d.success_type, ":"],
                                    }),
                                  d.all_outcomes,
                                ],
                              },
                              h
                            )
                          ),
                        }),
                      ],
                    }),
                  }),
                },
                u.choice_number
              )
            ),
          }),
        }),
      ],
    },
    r.event_name
  );
}
function wN({
  eventSelected: t,
  selected: r,
  setSelected: o,
  eventChoicesConfig: l,
  addEventList: c,
  deleteEventList: u,
}) {
  const [d, h] = y.useState(""),
    p = y.useMemo(() => {
      const v = d.toLowerCase().trim();
      return t.filter((x) => x.event_name.toLowerCase().includes(v));
    }, [t, d]);
  y.useEffect(() => {
    h("");
  }, [r]);
  const m = (v) => {
    h(v.target.value);
  };
  return g.jsx("div", {
    className: "flex-1 overflow-y-auto p-6 bg-background",
    children: g.jsxs("div", {
      className: "space-y-6",
      children: [
        g.jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            g.jsx("h3", {
              className: "text-lg font-semibold",
              children: r ? `Events for: ${r}` : "All Events",
            }),
            g.jsxs(ti, {
              variant: "outline",
              className: "text-xs",
              children: [p.length, " events found"],
            }),
          ],
        }),
        g.jsx(gn, { value: d, onChange: m, placeholder: "Search events..." }),
        g.jsx("div", {
          className: "space-y-4",
          children:
            p.length > 0
              ? p.map((v) =>
                  g.jsx(
                    u0,
                    {
                      addEventList: c,
                      event: v,
                      eventChoicesConfig: l,
                      deleteEventList: u,
                    },
                    v.event_name
                  )
                )
              : g.jsx(wo, {
                  className: "border-dashed",
                  children: g.jsxs(_o, {
                    className: "py-12 text-center text-muted-foreground",
                    children: [
                      g.jsx(Rb, {
                        className: "w-12 h-12 mx-auto mb-3 opacity-50",
                      }),
                      r
                        ? g.jsxs(g.Fragment, {
                            children: [
                              g.jsx("p", {
                                className: "font-medium mb-1",
                                children: "No events found for this filter.",
                              }),
                              g.jsx(en, {
                                variant: "outline",
                                size: "sm",
                                onClick: () => o(""),
                                children: "Clear Filter",
                              }),
                            ],
                          })
                        : g.jsx("p", {
                            children:
                              "Select a scenario, character, or support card from the sidebar to view events.",
                          }),
                    ],
                  }),
                }),
        }),
      ],
    }),
  });
}
function iy({ data: t, button: r, setSelected: o }) {
  const [l, c] = y.useState(""),
    [u, d] = y.useState(!1),
    h = y.useMemo(() => {
      const m = l.toLowerCase().trim();
      return t.filter((v) => v.name.toLowerCase().includes(m));
    }, [t, l]),
    p = (m) => {
      c(m.target.value);
    };
  return g.jsxs(Ql, {
    open: u,
    onOpenChange: d,
    children: [
      g.jsx(Fl, {
        asChild: !0,
        children: g.jsxs(en, {
          variant: "outline",
          className: "flex items-center gap-2",
          children: [g.jsx(Zc, { className: "w-4 h-4" }), r],
        }),
      }),
      g.jsxs(Jl, {
        className: "max-w-4xl h-[80vh]",
        children: [
          g.jsx(Wl, {
            children: g.jsxs(ei, {
              className: "flex items-center gap-2",
              children: [g.jsx(Zc, { className: "w-5 h-5" }), r],
            }),
          }),
          g.jsxs("div", {
            className: "space-y-4",
            children: [
              g.jsxs("div", {
                className: "relative",
                children: [
                  g.jsx(Zc, {
                    className:
                      "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                  }),
                  g.jsx(gn, {
                    type: "search",
                    placeholder: "Search...",
                    value: l,
                    onChange: p,
                    className: "pl-10",
                  }),
                ],
              }),
              g.jsx("div", {
                className: "border rounded-lg h-[60vh] overflow-auto",
                children: g.jsx("div", {
                  className:
                    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4",
                  children: h.map((m) =>
                    g.jsx(
                      wo,
                      {
                        className:
                          "cursor-pointer transition-all hover:scale-105 hover:shadow-md",
                        onClick: () => {
                          o(m.name), d(!1), c("");
                        },
                        children: g.jsxs(_o, {
                          className:
                            "p-3 flex flex-col items-center text-center",
                          children: [
                            g.jsx("img", {
                              src: m.image_url,
                              alt: m.name,
                              className:
                                "w-16 h-16 object-contain mb-2 rounded",
                            }),
                            g.jsx("p", {
                              className: "text-xs font-medium leading-tight",
                              children: m.name,
                            }),
                            m.rarity &&
                              g.jsx(ti, {
                                variant: "secondary",
                                className: "mt-1 text-xs",
                                children: m.rarity,
                              }),
                          ],
                        }),
                      },
                      m.id
                    )
                  ),
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function _N({ selected: t, setSelected: r, data: o }) {
  return g.jsxs("div", {
    className: "w-80 border-r bg-muted/10 p-4 space-y-6 overflow-y-auto",
    children: [
      g.jsxs("div", {
        children: [
          g.jsxs("h3", {
            className: "font-semibold text-sm flex items-center gap-2 mb-1",
            children: [g.jsx(Rb, { className: "w-4 h-4" }), "Filter Options"],
          }),
          g.jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Filter events by scenario, character, or support card",
          }),
        ],
      }),
      g.jsxs(wo, {
        children: [
          g.jsx(Gc, {
            className: "pb-2",
            children: g.jsxs(Yc, {
              className: "text-sm flex items-center gap-2",
              children: [
                g.jsx(_A, { className: "w-4 h-4 text-blue-500" }),
                "Scenario",
              ],
            }),
          }),
          g.jsx(_o, {
            children: g.jsxs("button", {
              onClick: () => {
                r("URA Finale");
              },
              className:
                "flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full text-left",
              children: [
                g.jsx("img", {
                  width: 48,
                  src: "https://img.game8.co/4249469/184a67f04794400ec7360a33184c357f.png/show",
                  alt: "URA Scenario",
                  className: "rounded",
                }),
                g.jsxs("div", {
                  children: [
                    g.jsx("p", {
                      className: "font-medium text-sm",
                      children: "URA Finale",
                    }),
                    g.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Main Scenario",
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      g.jsxs(wo, {
        children: [
          g.jsx(Gc, {
            className: "pb-2",
            children: g.jsxs(Yc, {
              className: "text-sm flex items-center gap-2",
              children: [
                g.jsx(kA, { className: "w-4 h-4 text-green-500" }),
                "Character",
              ],
            }),
          }),
          g.jsx(_o, {
            children: g.jsx(iy, {
              button: "Select Character",
              data: o?.characterArraySchema.characters ?? [],
              setSelected: (l) => {
                r(l);
              },
            }),
          }),
        ],
      }),
      g.jsxs(wo, {
        children: [
          g.jsx(Gc, {
            className: "pb-2",
            children: g.jsxs(Yc, {
              className: "text-sm flex items-center gap-2",
              children: [
                g.jsx(TA, { className: "w-4 h-4 text-purple-500" }),
                "Support Card",
              ],
            }),
          }),
          g.jsx(_o, {
            children: g.jsx(iy, {
              button: "Select Support Card",
              data: o?.supportCardArraySchema.supportCards ?? [],
              setSelected: (l) => {
                r(l);
              },
            }),
          }),
        ],
      }),
      t &&
        g.jsxs(en, {
          variant: "outline",
          onClick: () => r(""),
          className: "w-full flex items-center gap-2",
          children: [g.jsx(Xd, { className: "w-4 h-4" }), "Clear Filter"],
        }),
    ],
  });
}
function EN({
  data: t,
  groupedChoices: r,
  eventChoicesConfig: o,
  addEventList: l,
  deleteEventList: c,
}) {
  const [u, d] = y.useState(""),
    h = u
      ? r?.filter((p) =>
          p.character_name.toLowerCase().includes(u.toLowerCase())
        )
      : [];
  return g.jsx("div", {
    children: g.jsxs(Ql, {
      children: [
        g.jsx(Fl, {
          asChild: !0,
          children: g.jsxs(en, {
            className:
              "flex items-center gap-2 shadow-sm hover:shadow-md transition",
            children: [g.jsx(Xv, { className: "w-4 h-4" }), "Event List"],
          }),
        }),
        g.jsxs(Jl, {
          className:
            "max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden p-0 [&>button]:hidden",
          children: [
            g.jsx(Wl, {
              className: "px-6 py-4 border-b bg-muted/30 backdrop-blur-sm",
              children: g.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  g.jsxs(ei, {
                    className: "flex items-center gap-2 text-xl font-semibold",
                    children: [
                      g.jsx(Xv, { className: "w-5 h-5 text-primary" }),
                      "Event Database",
                    ],
                  }),
                  u &&
                    g.jsxs(ti, {
                      variant: "secondary",
                      className: "flex items-center gap-1 text-sm",
                      children: [
                        "Filter: ",
                        u,
                        g.jsx("button", {
                          onClick: () => d(""),
                          className: "ml-1 hover:text-destructive",
                          children: g.jsx(Xd, { className: "w-3 h-3" }),
                        }),
                      ],
                    }),
                ],
              }),
            }),
            g.jsxs("div", {
              className: "flex-1 flex overflow-hidden",
              children: [
                g.jsx(_N, { selected: u, setSelected: d, data: t }),
                g.jsx(wN, {
                  deleteEventList: c,
                  addEventList: l,
                  eventChoicesConfig: o,
                  eventSelected: h,
                  selected: u,
                  setSelected: d,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function CN({
  data: t,
  groupedChoices: r,
  eventChoicesConfig: o,
  addEventList: l,
  deleteEventList: c,
  clearEventList: u,
}) {
  const d = [
      ...(t?.scenarios ?? []),
      ...(t?.characterArraySchema?.characters ?? []),
      ...(t?.supportCardArraySchema?.supportCards ?? []),
    ],
    [h, p] = y.useState(""),
    [m, v] = y.useState(!1),
    x = [
      ...new Set(
        o.flatMap((w) =>
          (w.character_name || "")
            .toLowerCase()
            .split(",")
            .map((O) => O.trim())
            .filter((O) => O !== "" && !O.includes("tracen academy"))
        )
      ),
    ],
    _ = r?.filter((w) => o.some((C) => C.event_name === w.event_name)),
    E = y.useMemo(() => {
      const w = h.toLowerCase().toLowerCase();
      return _?.filter(
        (C) =>
          C.event_name.toLowerCase().includes(w) ||
          C.character_name.toLowerCase().includes(w)
      );
    }, [_, h]),
    R = (w) => p(w.target.value);
  return g.jsxs(Ql, {
    open: m,
    onOpenChange: (w) => {
      v(w), p("");
    },
    children: [
      g.jsx(Fl, {
        asChild: !0,
        children: g.jsxs(en, {
          variant: "outline",
          className: "flex items-center gap-2",
          children: [
            "Selected Events",
            o.length > 0 &&
              g.jsx(ti, {
                variant: "secondary",
                className: "ml-1 text-xs px-2",
                children: o.length,
              }),
          ],
        }),
      }),
      g.jsxs(Jl, {
        className:
          "h-[85vh] w-full max-w-[90vw] p-0 overflow-hidden [&>button]:hidden",
        children: [
          g.jsxs(Wl, {
            className:
              "p-4 border-b flex flex-row items-center justify-between bg-muted/40",
            children: [
              g.jsx(ei, {
                className: "text-lg font-semibold",
                children: "Selected Events",
              }),
              o.length > 0 &&
                g.jsxs(en, {
                  variant: "destructive",
                  size: "sm",
                  onClick: u,
                  className: "flex items-center gap-1",
                  children: [
                    g.jsx(Ab, { className: "w-4 h-4" }),
                    " Clear All Events",
                  ],
                }),
            ],
          }),
          g.jsxs("div", {
            className: "flex h-[75vh]",
            children: [
              g.jsxs("div", {
                className: "border-r p-4 flex flex-col gap-4",
                children: [
                  g.jsxs("div", {
                    className: "relative",
                    children: [
                      g.jsx(Zc, {
                        className:
                          "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                      }),
                      g.jsx(gn, {
                        type: "search",
                        placeholder: "Search events or characters...",
                        value: h,
                        onChange: R,
                        className: "pl-10",
                      }),
                    ],
                  }),
                  g.jsxs("div", {
                    className: "overflow-y-auto px-2",
                    children: [
                      g.jsx("p", {
                        className:
                          "text-sm font-medium mb-2 text-muted-foreground",
                        children: "Filter",
                      }),
                      g.jsx("div", {
                        className: "grid grid-cols-3 gap-3 p-1",
                        children: d
                          ?.filter((w) => x.includes(w.name.toLowerCase()))
                          .map((w) =>
                            g.jsxs(
                              "button",
                              {
                                onClick: () => p(w.name),
                                className: "flex flex-col items-center w-20",
                                children: [
                                  g.jsx("img", {
                                    src: w.image_url,
                                    alt: w.name,
                                    className: `object-cover rounded-lg border ${
                                      w.name.toLowerCase() === h.toLowerCase()
                                        ? "ring-2"
                                        : "hover:ring-2"
                                    } hover:ring-primary transition`,
                                  }),
                                  g.jsx("p", {
                                    className:
                                      "text-xs mt-1 text-muted-foreground truncate w-full text-center",
                                    children: w.name,
                                  }),
                                ],
                              },
                              w.name
                            )
                          ),
                      }),
                    ],
                  }),
                ],
              }),
              g.jsx("div", {
                className: "flex-1 overflow-y-auto p-4",
                children:
                  E?.length > 0
                    ? g.jsx("div", {
                        className: "flex flex-col gap-4",
                        children: E.map((w) =>
                          g.jsx(
                            u0,
                            {
                              addEventList: l,
                              event: w,
                              eventChoicesConfig: o,
                              deleteEventList: c,
                            },
                            w.event_name
                          )
                        ),
                      })
                    : g.jsxs("div", {
                        className:
                          "h-full flex flex-col items-center justify-center text-center text-muted-foreground",
                        children: [
                          g.jsx("p", {
                            className: "text-base font-medium",
                            children: "No events selected yet",
                          }),
                          g.jsx("p", {
                            className: "text-sm",
                            children:
                              "Select some from the list to see them here",
                          }),
                        ],
                      }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function RN({ config: t, updateConfig: r }) {
  const { event: o } = t,
    { use_optimal_event_choice: l, event_choices: c } = o,
    [u, d] = y.useState(null);
  y.useEffect(() => {
    (async () => {
      try {
        const _ = await (
          await fetch(
            "https://raw.githubusercontent.com/samsulpanjul/umamusume-auto-train/refs/heads/emulator/data/events.json"
          )
        ).json();
        d(_);
      } catch (x) {
        console.error("Failed to fetch events:", x);
      }
    })();
  }, []);
  const h = (v) => {
      const x = c.findIndex((E) => E.event_name === v.event_name),
        _ =
          x !== -1
            ? c.map((E, R) => (R === x ? { ...E, chosen: v.chosen } : E))
            : [...c, v];
      r("event", { ...o, event_choices: _ });
    },
    p = (v) =>
      r("event", { ...o, event_choices: c.filter((x) => x.event_name !== v) }),
    m = y.useMemo(() => {
      const v = u?.choiceArraySchema?.choices ?? [];
      return Object.values(
        v.reduce((x, _) => {
          x[_.event_name] ||
            (x[_.event_name] = {
              event_name: _.event_name,
              character_name: _.character_name,
              choices: [],
            });
          const E = x[_.event_name];
          let R = E.choices.find((w) => w.choice_number === _.choice_number);
          return (
            R ||
              ((R = {
                choice_number: _.choice_number,
                choice_text: _.choice_text,
                variants: [],
              }),
              E.choices.push(R)),
            R.variants.push({
              success_type: _.success_type,
              all_outcomes: _.all_outcomes,
            }),
            x
          );
        }, {})
      );
    }, [u]);
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(OA, { className: "text-primary" }), " Event"],
      }),
      g.jsx(JA, {
        isUseOptimalEventChoice: l,
        setIsUseOptimalEventChoice: (v) =>
          r("event", { ...o, use_optimal_event_choice: v }),
      }),
      g.jsxs("div", {
        className: "flex gap-6 mt-6",
        children: [
          g.jsx(EN, {
            eventChoicesConfig: c,
            addEventList: h,
            deleteEventList: p,
            data: u,
            groupedChoices: m,
          }),
          g.jsx(CN, {
            data: u,
            groupedChoices: m,
            eventChoicesConfig: c,
            addEventList: h,
            deleteEventList: p,
            clearEventList: () => r("event", { ...o, event_choices: [] }),
          }),
        ],
      }),
    ],
  });
}
function AN({ prioritizeG1Race: t, setPrioritizeG1: r }) {
  return g.jsx("div", {
    className: "w-fit",
    children: g.jsxs("label", {
      htmlFor: "prioritize-g1",
      className: "flex gap-2 items-center",
      children: [
        g.jsx(Do, {
          id: "prioritize-g1",
          checked: t,
          onCheckedChange: () => r(!t),
        }),
        g.jsx("span", {
          className: "text-lg font-medium shrink-0",
          children: "Run Race Schedule?",
        }),
      ],
    }),
  });
}
function TN({ cancelConsecutive: t, setCancelConsecutive: r }) {
  return g.jsx("div", {
    className: "w-fit",
    children: g.jsxs("label", {
      htmlFor: "cancel-consecutive",
      className: "flex gap-2 items-center",
      children: [
        g.jsx(Do, {
          id: "cancel-consecutive",
          checked: t,
          onCheckedChange: () => r(!t),
        }),
        g.jsx("span", {
          className: "text-lg font-medium shrink-0",
          children: "Cancel Consecutive Race?",
        }),
      ],
    }),
  });
}
function NN({
  raceSchedule: t,
  addRaceSchedule: r,
  deleteRaceSchedule: o,
  clearRaceSchedule: l,
}) {
  const [c, u] = y.useState(null);
  return (
    y.useEffect(() => {
      (async () => {
        try {
          const p = await (
            await fetch(
              "https://raw.githubusercontent.com/Dangko2218/umamusume-auto-train/refs/heads/dev/data/races.json"
            )
          ).json();
          u(p);
        } catch (h) {
          console.error("Failed to fetch races:", h);
        }
      })();
    }, []),
    g.jsx("div", {
      children: g.jsxs(Ql, {
        children: [
          g.jsx(Fl, {
            asChild: !0,
            children: g.jsx(en, {
              className: "font-semibold",
              children: "Select Race",
            }),
          }),
          g.jsxs(Jl, {
            className: "min-h-[512px] max-w-4xl",
            children: [
              g.jsx(Wl, { children: g.jsx(ei, { children: "Race Schedule" }) }),
              g.jsxs("div", {
                className: "flex gap-6 min-h-[400px]",
                children: [
                  g.jsx("div", {
                    className:
                      "w-9/12 flex flex-col gap-4 max-h-[420px] overflow-auto",
                    children:
                      c &&
                      Object.entries(c).map(([d, h]) =>
                        g.jsxs(
                          "div",
                          {
                            className: "flex flex-col gap-2 relative",
                            children: [
                              g.jsx("p", {
                                className:
                                  "text-xl font-semibold sticky top-0 bg-card pb-2",
                                children: d,
                              }),
                              g.jsx("div", {
                                className: "flex flex-col gap-2 px-4",
                                children: Object.entries(h).map(([p, m]) =>
                                  g.jsxs(
                                    "div",
                                    {
                                      className: `border-2 ${
                                        t.some(
                                          (v) => v.name === p && v.year === d
                                        )
                                          ? "border-primary bg-primary/10"
                                          : "border-border cursor-pointer"
                                      } rounded-md px-4 py-2 flex justify-between hover:border-primary/50 transition`,
                                      onClick: () => {
                                        r({ name: p, date: m.date, year: d }),
                                          t.some(
                                            (v) => v.name === p && v.year === d
                                          ) && o(p, d);
                                      },
                                      children: [
                                        g.jsxs("div", {
                                          children: [
                                            g.jsxs("p", {
                                              className: "font-semibold mb-2",
                                              children: [p, " - ", m.racetrack],
                                            }),
                                            g.jsxs("p", {
                                              children: [
                                                "Sparks: ",
                                                m.sparks.join(", "),
                                              ],
                                            }),
                                            g.jsxs("p", {
                                              children: [
                                                "Fans required:",
                                                " ",
                                                m.fans.required.toLocaleString(),
                                              ],
                                            }),
                                            g.jsxs("p", {
                                              children: [
                                                "Fans gained: ",
                                                m.fans.gained.toLocaleString(),
                                              ],
                                            }),
                                          ],
                                        }),
                                        g.jsxs("div", {
                                          className: "text-right",
                                          children: [
                                            g.jsx("p", {
                                              className: "mb-2",
                                              children: m.date,
                                            }),
                                            g.jsx("p", {
                                              children: m.distance.type,
                                            }),
                                            g.jsx("p", {
                                              children: m.distance.meters,
                                            }),
                                            g.jsx("p", { children: m.terrain }),
                                          ],
                                        }),
                                      ],
                                    },
                                    p
                                  )
                                ),
                              }),
                            ],
                          },
                          d
                        )
                      ),
                  }),
                  g.jsxs("div", {
                    className: "w-3/12 flex flex-col",
                    children: [
                      g.jsxs("div", {
                        className: "flex justify-between items-center",
                        children: [
                          g.jsx("p", {
                            className: "text-lg font-semibold",
                            children: "Race to schedule",
                          }),
                          g.jsx(en, {
                            size: "sm",
                            className: "cursor-pointer",
                            onClick: () => l(),
                            children: "Clear",
                          }),
                        ],
                      }),
                      g.jsx("div", {
                        className:
                          "flex flex-col gap-2 overflow-auto pr-2 max-h-[395px] mt-2",
                        children: t.map((d) =>
                          g.jsxs(
                            "div",
                            {
                              className:
                                "px-4 py-2 border-2 border-border rounded-md hover:border-primary/50 transition cursor-pointer",
                              onClick: () => o(d.name, d.year),
                              children: [
                                g.jsx("p", {
                                  className: "font-semibold",
                                  children: d.name,
                                }),
                                g.jsxs("p", {
                                  children: [d.year, " ", d.date],
                                }),
                              ],
                            },
                            d.name
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function ON({ config: t, updateConfig: r }) {
  const {
    prioritize_g1_race: o,
    cancel_consecutive_race: l,
    race_schedule: c,
  } = t;
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(mA, { className: "text-primary" }), "Race Schedule"],
      }),
      g.jsxs("div", {
        className: "flex flex-col gap-4",
        children: [
          g.jsx(AN, {
            prioritizeG1Race: o,
            setPrioritizeG1: (u) => r("prioritize_g1_race", u),
          }),
          g.jsx(TN, {
            cancelConsecutive: l,
            setCancelConsecutive: (u) => r("cancel_consecutive_race", u),
          }),
          g.jsx(NN, {
            raceSchedule: c,
            addRaceSchedule: (u) => r("race_schedule", [...c, u]),
            deleteRaceSchedule: (u, d) =>
              r(
                "race_schedule",
                c.filter((h) => h.name !== u || h.year !== d)
              ),
            clearRaceSchedule: () => r("race_schedule", []),
          }),
        ],
      }),
    ],
  });
}
function DN({ isAutoBuySkill: t, setAutoBuySkill: r }) {
  return g.jsxs("label", {
    htmlFor: "buy-auto-skill",
    className: "flex gap-2 items-center",
    children: [
      g.jsx(Do, {
        id: "buy-auto-skill",
        checked: t,
        onCheckedChange: () => r(!t),
      }),
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Auto Buy Skill? ",
      }),
    ],
  });
}
function jN({ skillPtsCheck: t, setSkillPtsCheck: r }) {
  return g.jsxs("label", {
    className: "flex flex-col gap-2",
    children: [
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Skill Pts Check",
      }),
      g.jsx(gn, {
        className: "w-24",
        type: "number",
        min: 0,
        value: t,
        onChange: (o) => r(o.target.valueAsNumber),
      }),
    ],
  });
}
function zN({ list: t, addSkillList: r, deleteSkillList: o }) {
  const [l, c] = y.useState([]),
    [u, d] = y.useState("");
  y.useEffect(() => {
    (async () => {
      try {
        const x = await (
          await fetch(
            "https://raw.githubusercontent.com/samsulpanjul/umamusume-auto-train/refs/heads/dev/data/skills.json"
          )
        ).json();
        c(x);
      } catch (v) {
        console.error("Failed to fetch skills:", v);
      }
    })();
  }, []);
  const h = y.useMemo(
      () =>
        l.filter(
          (m) =>
            m.name.toLowerCase().includes(u.toLowerCase()) ||
            m.description.toLowerCase().includes(u.toLowerCase())
        ),
      [l, u]
    ),
    p = (m) => {
      d(m.target.value);
    };
  return g.jsxs("div", {
    children: [
      g.jsx("p", {
        className: "text-lg font-medium mb-2",
        children: "Select skill you want to buy",
      }),
      g.jsxs(Ql, {
        children: [
          g.jsx(Fl, {
            asChild: !0,
            children: g.jsx(en, {
              className: "font-semibold",
              children: "Open",
            }),
          }),
          g.jsxs(Jl, {
            className: "min-h-[512px] max-w-4xl",
            children: [
              g.jsx(Wl, { children: g.jsx(ei, { children: "Skills List" }) }),
              g.jsxs("div", {
                className: "flex gap-6 min-h-[400px]",
                children: [
                  g.jsxs("div", {
                    className: "w-9/12 flex flex-col",
                    children: [
                      g.jsx(gn, {
                        placeholder: "Search...",
                        type: "search",
                        value: u,
                        onChange: p,
                      }),
                      g.jsx("div", {
                        className:
                          "mt-4 grid grid-cols-2 gap-4 overflow-auto pr-2 max-h-[420px]",
                        children: h.map(
                          (m) =>
                            !t.includes(m.name) &&
                            g.jsxs(
                              "div",
                              {
                                className:
                                  "w-full border-2 border-border rounded-lg px-3 py-2 cursor-pointer hover:border-primary/50 transition",
                                onClick: () => r(m.name),
                                children: [
                                  g.jsx("p", {
                                    className: "text-lg font-semibold",
                                    children: m.name,
                                  }),
                                  g.jsx("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: m.description,
                                  }),
                                ],
                              },
                              m.name
                            )
                        ),
                      }),
                    ],
                  }),
                  g.jsxs("div", {
                    className: "w-3/12 flex flex-col",
                    children: [
                      g.jsx("p", {
                        className: "font-semibold mb-2",
                        children: "Skills to buy",
                      }),
                      g.jsx("div", {
                        className:
                          "flex flex-col gap-2 overflow-auto pr-2 max-h-[420px]",
                        children: t.map((m) =>
                          g.jsx(
                            "div",
                            {
                              className:
                                "px-4 py-2 cursor-pointer border-2 border-border rounded-lg flex justify-between items-center hover:border-destructive/50 transition",
                              onClick: () => o(m),
                              children: g.jsx("p", { children: m }),
                            },
                            m
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function MN({ config: t, updateConfig: r }) {
  const { skill: o } = t;
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(oA, { className: "text-primary" }), "Skill"],
      }),
      g.jsxs("div", {
        className: "flex flex-col gap-6",
        children: [
          g.jsx(DN, {
            isAutoBuySkill: o.is_auto_buy_skill,
            setAutoBuySkill: (l) => r("skill", { ...o, is_auto_buy_skill: l }),
          }),
          g.jsx(jN, {
            skillPtsCheck: o.skill_pts_check,
            setSkillPtsCheck: (l) => r("skill", { ...o, skill_pts_check: l }),
          }),
          g.jsx(zN, {
            list: o.skill_list,
            addSkillList: (l) =>
              r("skill", { ...o, skill_list: [l, ...o.skill_list] }),
            deleteSkillList: (l) =>
              r("skill", {
                ...o,
                skill_list: o.skill_list.filter((c) => c !== l),
              }),
          }),
        ],
      }),
    ],
  });
}
function kN({ positionSelectionEnabled: t, setPositionSelectionEnabled: r }) {
  return g.jsxs("label", {
    htmlFor: "position-selection-enabled",
    className: "flex gap-2 items-center",
    children: [
      g.jsx(Do, {
        id: "position-selection-enabled",
        checked: t,
        onCheckedChange: () => r(!t),
      }),
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Position Selection Enabled",
      }),
    ],
  });
}
function cy(t, [r, o]) {
  return Math.min(o, Math.max(r, t));
}
function f0(t) {
  const r = t + "CollectionProvider",
    [o, l] = sr(r),
    [c, u] = o(r, { collectionRef: { current: null }, itemMap: new Map() }),
    d = (w) => {
      const { scope: C, children: O } = w,
        D = nt.useRef(null),
        j = nt.useRef(new Map()).current;
      return g.jsx(c, { scope: C, itemMap: j, collectionRef: D, children: O });
    };
  d.displayName = r;
  const h = t + "CollectionSlot",
    p = Ro(h),
    m = nt.forwardRef((w, C) => {
      const { scope: O, children: D } = w,
        j = u(h, O),
        B = Be(C, j.collectionRef);
      return g.jsx(p, { ref: B, children: D });
    });
  m.displayName = h;
  const v = t + "CollectionItemSlot",
    x = "data-radix-collection-item",
    _ = Ro(v),
    E = nt.forwardRef((w, C) => {
      const { scope: O, children: D, ...j } = w,
        B = nt.useRef(null),
        L = Be(C, B),
        F = u(v, O);
      return (
        nt.useEffect(
          () => (
            F.itemMap.set(B, { ref: B, ...j }), () => void F.itemMap.delete(B)
          )
        ),
        g.jsx(_, { [x]: "", ref: L, children: D })
      );
    });
  E.displayName = v;
  function R(w) {
    const C = u(t + "CollectionConsumer", w);
    return nt.useCallback(() => {
      const D = C.collectionRef.current;
      if (!D) return [];
      const j = Array.from(D.querySelectorAll(`[${x}]`));
      return Array.from(C.itemMap.values()).sort(
        (F, Y) => j.indexOf(F.ref.current) - j.indexOf(Y.ref.current)
      );
    }, [C.collectionRef, C.itemMap]);
  }
  return [{ Provider: d, Slot: m, ItemSlot: E }, R, l];
}
var LN = y.createContext(void 0);
function rh(t) {
  const r = y.useContext(LN);
  return t || r || "ltr";
}
const UN = ["top", "right", "bottom", "left"],
  Hr = Math.min,
  Wt = Math.max,
  Qc = Math.round,
  Lc = Math.floor,
  Bn = (t) => ({ x: t, y: t }),
  BN = { left: "right", right: "left", bottom: "top", top: "bottom" },
  ZN = { start: "end", end: "start" };
function _d(t, r, o) {
  return Wt(t, Hr(r, o));
}
function ir(t, r) {
  return typeof t == "function" ? t(r) : t;
}
function cr(t) {
  return t.split("-")[0];
}
function jo(t) {
  return t.split("-")[1];
}
function ah(t) {
  return t === "x" ? "y" : "x";
}
function oh(t) {
  return t === "y" ? "height" : "width";
}
const HN = new Set(["top", "bottom"]);
function Un(t) {
  return HN.has(cr(t)) ? "y" : "x";
}
function lh(t) {
  return ah(Un(t));
}
function $N(t, r, o) {
  o === void 0 && (o = !1);
  const l = jo(t),
    c = lh(t),
    u = oh(c);
  let d =
    c === "x"
      ? l === (o ? "end" : "start")
        ? "right"
        : "left"
      : l === "start"
      ? "bottom"
      : "top";
  return r.reference[u] > r.floating[u] && (d = Fc(d)), [d, Fc(d)];
}
function GN(t) {
  const r = Fc(t);
  return [Ed(t), r, Ed(r)];
}
function Ed(t) {
  return t.replace(/start|end/g, (r) => ZN[r]);
}
const sy = ["left", "right"],
  uy = ["right", "left"],
  YN = ["top", "bottom"],
  VN = ["bottom", "top"];
function IN(t, r, o) {
  switch (t) {
    case "top":
    case "bottom":
      return o ? (r ? uy : sy) : r ? sy : uy;
    case "left":
    case "right":
      return r ? YN : VN;
    default:
      return [];
  }
}
function qN(t, r, o, l) {
  const c = jo(t);
  let u = IN(cr(t), o === "start", l);
  return (
    c && ((u = u.map((d) => d + "-" + c)), r && (u = u.concat(u.map(Ed)))), u
  );
}
function Fc(t) {
  return t.replace(/left|right|bottom|top/g, (r) => BN[r]);
}
function PN(t) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...t };
}
function d0(t) {
  return typeof t != "number"
    ? PN(t)
    : { top: t, right: t, bottom: t, left: t };
}
function Jc(t) {
  const { x: r, y: o, width: l, height: c } = t;
  return {
    width: l,
    height: c,
    top: o,
    left: r,
    right: r + l,
    bottom: o + c,
    x: r,
    y: o,
  };
}
function fy(t, r, o) {
  let { reference: l, floating: c } = t;
  const u = Un(r),
    d = lh(r),
    h = oh(d),
    p = cr(r),
    m = u === "y",
    v = l.x + l.width / 2 - c.width / 2,
    x = l.y + l.height / 2 - c.height / 2,
    _ = l[h] / 2 - c[h] / 2;
  let E;
  switch (p) {
    case "top":
      E = { x: v, y: l.y - c.height };
      break;
    case "bottom":
      E = { x: v, y: l.y + l.height };
      break;
    case "right":
      E = { x: l.x + l.width, y: x };
      break;
    case "left":
      E = { x: l.x - c.width, y: x };
      break;
    default:
      E = { x: l.x, y: l.y };
  }
  switch (jo(r)) {
    case "start":
      E[d] -= _ * (o && m ? -1 : 1);
      break;
    case "end":
      E[d] += _ * (o && m ? -1 : 1);
      break;
  }
  return E;
}
const XN = async (t, r, o) => {
  const {
      placement: l = "bottom",
      strategy: c = "absolute",
      middleware: u = [],
      platform: d,
    } = o,
    h = u.filter(Boolean),
    p = await (d.isRTL == null ? void 0 : d.isRTL(r));
  let m = await d.getElementRects({ reference: t, floating: r, strategy: c }),
    { x: v, y: x } = fy(m, l, p),
    _ = l,
    E = {},
    R = 0;
  for (let w = 0; w < h.length; w++) {
    const { name: C, fn: O } = h[w],
      {
        x: D,
        y: j,
        data: B,
        reset: L,
      } = await O({
        x: v,
        y: x,
        initialPlacement: l,
        placement: _,
        strategy: c,
        middlewareData: E,
        rects: m,
        platform: d,
        elements: { reference: t, floating: r },
      });
    (v = D ?? v),
      (x = j ?? x),
      (E = { ...E, [C]: { ...E[C], ...B } }),
      L &&
        R <= 50 &&
        (R++,
        typeof L == "object" &&
          (L.placement && (_ = L.placement),
          L.rects &&
            (m =
              L.rects === !0
                ? await d.getElementRects({
                    reference: t,
                    floating: r,
                    strategy: c,
                  })
                : L.rects),
          ({ x: v, y: x } = fy(m, _, p))),
        (w = -1));
  }
  return { x: v, y: x, placement: _, strategy: c, middlewareData: E };
};
async function Yl(t, r) {
  var o;
  r === void 0 && (r = {});
  const { x: l, y: c, platform: u, rects: d, elements: h, strategy: p } = t,
    {
      boundary: m = "clippingAncestors",
      rootBoundary: v = "viewport",
      elementContext: x = "floating",
      altBoundary: _ = !1,
      padding: E = 0,
    } = ir(r, t),
    R = d0(E),
    C = h[_ ? (x === "floating" ? "reference" : "floating") : x],
    O = Jc(
      await u.getClippingRect({
        element:
          (o = await (u.isElement == null ? void 0 : u.isElement(C))) == null ||
          o
            ? C
            : C.contextElement ||
              (await (u.getDocumentElement == null
                ? void 0
                : u.getDocumentElement(h.floating))),
        boundary: m,
        rootBoundary: v,
        strategy: p,
      })
    ),
    D =
      x === "floating"
        ? { x: l, y: c, width: d.floating.width, height: d.floating.height }
        : d.reference,
    j = await (u.getOffsetParent == null
      ? void 0
      : u.getOffsetParent(h.floating)),
    B = (await (u.isElement == null ? void 0 : u.isElement(j)))
      ? (await (u.getScale == null ? void 0 : u.getScale(j))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    L = Jc(
      u.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await u.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: h,
            rect: D,
            offsetParent: j,
            strategy: p,
          })
        : D
    );
  return {
    top: (O.top - L.top + R.top) / B.y,
    bottom: (L.bottom - O.bottom + R.bottom) / B.y,
    left: (O.left - L.left + R.left) / B.x,
    right: (L.right - O.right + R.right) / B.x,
  };
}
const KN = (t) => ({
    name: "arrow",
    options: t,
    async fn(r) {
      const {
          x: o,
          y: l,
          placement: c,
          rects: u,
          platform: d,
          elements: h,
          middlewareData: p,
        } = r,
        { element: m, padding: v = 0 } = ir(t, r) || {};
      if (m == null) return {};
      const x = d0(v),
        _ = { x: o, y: l },
        E = lh(c),
        R = oh(E),
        w = await d.getDimensions(m),
        C = E === "y",
        O = C ? "top" : "left",
        D = C ? "bottom" : "right",
        j = C ? "clientHeight" : "clientWidth",
        B = u.reference[R] + u.reference[E] - _[E] - u.floating[R],
        L = _[E] - u.reference[E],
        F = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(m));
      let Y = F ? F[j] : 0;
      (!Y || !(await (d.isElement == null ? void 0 : d.isElement(F)))) &&
        (Y = h.floating[j] || u.floating[R]);
      const G = B / 2 - L / 2,
        te = Y / 2 - w[R] / 2 - 1,
        se = Hr(x[O], te),
        re = Hr(x[D], te),
        ue = se,
        ge = Y - w[R] - re,
        he = Y / 2 - w[R] / 2 + G,
        me = _d(ue, he, ge),
        z =
          !p.arrow &&
          jo(c) != null &&
          he !== me &&
          u.reference[R] / 2 - (he < ue ? se : re) - w[R] / 2 < 0,
        V = z ? (he < ue ? he - ue : he - ge) : 0;
      return {
        [E]: _[E] + V,
        data: {
          [E]: me,
          centerOffset: he - me - V,
          ...(z && { alignmentOffset: V }),
        },
        reset: z,
      };
    },
  }),
  QN = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: "flip",
        options: t,
        async fn(r) {
          var o, l;
          const {
              placement: c,
              middlewareData: u,
              rects: d,
              initialPlacement: h,
              platform: p,
              elements: m,
            } = r,
            {
              mainAxis: v = !0,
              crossAxis: x = !0,
              fallbackPlacements: _,
              fallbackStrategy: E = "bestFit",
              fallbackAxisSideDirection: R = "none",
              flipAlignment: w = !0,
              ...C
            } = ir(t, r);
          if ((o = u.arrow) != null && o.alignmentOffset) return {};
          const O = cr(c),
            D = Un(h),
            j = cr(h) === h,
            B = await (p.isRTL == null ? void 0 : p.isRTL(m.floating)),
            L = _ || (j || !w ? [Fc(h)] : GN(h)),
            F = R !== "none";
          !_ && F && L.push(...qN(h, w, R, B));
          const Y = [h, ...L],
            G = await Yl(r, C),
            te = [];
          let se = ((l = u.flip) == null ? void 0 : l.overflows) || [];
          if ((v && te.push(G[O]), x)) {
            const he = $N(c, d, B);
            te.push(G[he[0]], G[he[1]]);
          }
          if (
            ((se = [...se, { placement: c, overflows: te }]),
            !te.every((he) => he <= 0))
          ) {
            var re, ue;
            const he = (((re = u.flip) == null ? void 0 : re.index) || 0) + 1,
              me = Y[he];
            if (
              me &&
              (!(x === "alignment" ? D !== Un(me) : !1) ||
                se.every(($) =>
                  Un($.placement) === D ? $.overflows[0] > 0 : !0
                ))
            )
              return {
                data: { index: he, overflows: se },
                reset: { placement: me },
              };
            let z =
              (ue = se
                .filter((V) => V.overflows[0] <= 0)
                .sort((V, $) => V.overflows[1] - $.overflows[1])[0]) == null
                ? void 0
                : ue.placement;
            if (!z)
              switch (E) {
                case "bestFit": {
                  var ge;
                  const V =
                    (ge = se
                      .filter(($) => {
                        if (F) {
                          const ae = Un($.placement);
                          return ae === D || ae === "y";
                        }
                        return !0;
                      })
                      .map(($) => [
                        $.placement,
                        $.overflows
                          .filter((ae) => ae > 0)
                          .reduce((ae, T) => ae + T, 0),
                      ])
                      .sort(($, ae) => $[1] - ae[1])[0]) == null
                      ? void 0
                      : ge[0];
                  V && (z = V);
                  break;
                }
                case "initialPlacement":
                  z = h;
                  break;
              }
            if (c !== z) return { reset: { placement: z } };
          }
          return {};
        },
      }
    );
  };
function dy(t, r) {
  return {
    top: t.top - r.height,
    right: t.right - r.width,
    bottom: t.bottom - r.height,
    left: t.left - r.width,
  };
}
function hy(t) {
  return UN.some((r) => t[r] >= 0);
}
const FN = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: "hide",
        options: t,
        async fn(r) {
          const { rects: o } = r,
            { strategy: l = "referenceHidden", ...c } = ir(t, r);
          switch (l) {
            case "referenceHidden": {
              const u = await Yl(r, { ...c, elementContext: "reference" }),
                d = dy(u, o.reference);
              return {
                data: { referenceHiddenOffsets: d, referenceHidden: hy(d) },
              };
            }
            case "escaped": {
              const u = await Yl(r, { ...c, altBoundary: !0 }),
                d = dy(u, o.floating);
              return { data: { escapedOffsets: d, escaped: hy(d) } };
            }
            default:
              return {};
          }
        },
      }
    );
  },
  h0 = new Set(["left", "top"]);
async function JN(t, r) {
  const { placement: o, platform: l, elements: c } = t,
    u = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)),
    d = cr(o),
    h = jo(o),
    p = Un(o) === "y",
    m = h0.has(d) ? -1 : 1,
    v = u && p ? -1 : 1,
    x = ir(r, t);
  let {
    mainAxis: _,
    crossAxis: E,
    alignmentAxis: R,
  } = typeof x == "number"
    ? { mainAxis: x, crossAxis: 0, alignmentAxis: null }
    : {
        mainAxis: x.mainAxis || 0,
        crossAxis: x.crossAxis || 0,
        alignmentAxis: x.alignmentAxis,
      };
  return (
    h && typeof R == "number" && (E = h === "end" ? R * -1 : R),
    p ? { x: E * v, y: _ * m } : { x: _ * m, y: E * v }
  );
}
const WN = function (t) {
    return (
      t === void 0 && (t = 0),
      {
        name: "offset",
        options: t,
        async fn(r) {
          var o, l;
          const { x: c, y: u, placement: d, middlewareData: h } = r,
            p = await JN(r, t);
          return d === ((o = h.offset) == null ? void 0 : o.placement) &&
            (l = h.arrow) != null &&
            l.alignmentOffset
            ? {}
            : { x: c + p.x, y: u + p.y, data: { ...p, placement: d } };
        },
      }
    );
  },
  eO = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: "shift",
        options: t,
        async fn(r) {
          const { x: o, y: l, placement: c } = r,
            {
              mainAxis: u = !0,
              crossAxis: d = !1,
              limiter: h = {
                fn: (C) => {
                  let { x: O, y: D } = C;
                  return { x: O, y: D };
                },
              },
              ...p
            } = ir(t, r),
            m = { x: o, y: l },
            v = await Yl(r, p),
            x = Un(cr(c)),
            _ = ah(x);
          let E = m[_],
            R = m[x];
          if (u) {
            const C = _ === "y" ? "top" : "left",
              O = _ === "y" ? "bottom" : "right",
              D = E + v[C],
              j = E - v[O];
            E = _d(D, E, j);
          }
          if (d) {
            const C = x === "y" ? "top" : "left",
              O = x === "y" ? "bottom" : "right",
              D = R + v[C],
              j = R - v[O];
            R = _d(D, R, j);
          }
          const w = h.fn({ ...r, [_]: E, [x]: R });
          return {
            ...w,
            data: { x: w.x - o, y: w.y - l, enabled: { [_]: u, [x]: d } },
          };
        },
      }
    );
  },
  tO = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        options: t,
        fn(r) {
          const { x: o, y: l, placement: c, rects: u, middlewareData: d } = r,
            { offset: h = 0, mainAxis: p = !0, crossAxis: m = !0 } = ir(t, r),
            v = { x: o, y: l },
            x = Un(c),
            _ = ah(x);
          let E = v[_],
            R = v[x];
          const w = ir(h, r),
            C =
              typeof w == "number"
                ? { mainAxis: w, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...w };
          if (p) {
            const j = _ === "y" ? "height" : "width",
              B = u.reference[_] - u.floating[j] + C.mainAxis,
              L = u.reference[_] + u.reference[j] - C.mainAxis;
            E < B ? (E = B) : E > L && (E = L);
          }
          if (m) {
            var O, D;
            const j = _ === "y" ? "width" : "height",
              B = h0.has(cr(c)),
              L =
                u.reference[x] -
                u.floating[j] +
                ((B && ((O = d.offset) == null ? void 0 : O[x])) || 0) +
                (B ? 0 : C.crossAxis),
              F =
                u.reference[x] +
                u.reference[j] +
                (B ? 0 : ((D = d.offset) == null ? void 0 : D[x]) || 0) -
                (B ? C.crossAxis : 0);
            R < L ? (R = L) : R > F && (R = F);
          }
          return { [_]: E, [x]: R };
        },
      }
    );
  },
  nO = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: "size",
        options: t,
        async fn(r) {
          var o, l;
          const { placement: c, rects: u, platform: d, elements: h } = r,
            { apply: p = () => {}, ...m } = ir(t, r),
            v = await Yl(r, m),
            x = cr(c),
            _ = jo(c),
            E = Un(c) === "y",
            { width: R, height: w } = u.floating;
          let C, O;
          x === "top" || x === "bottom"
            ? ((C = x),
              (O =
                _ ===
                ((await (d.isRTL == null ? void 0 : d.isRTL(h.floating)))
                  ? "start"
                  : "end")
                  ? "left"
                  : "right"))
            : ((O = x), (C = _ === "end" ? "top" : "bottom"));
          const D = w - v.top - v.bottom,
            j = R - v.left - v.right,
            B = Hr(w - v[C], D),
            L = Hr(R - v[O], j),
            F = !r.middlewareData.shift;
          let Y = B,
            G = L;
          if (
            ((o = r.middlewareData.shift) != null && o.enabled.x && (G = j),
            (l = r.middlewareData.shift) != null && l.enabled.y && (Y = D),
            F && !_)
          ) {
            const se = Wt(v.left, 0),
              re = Wt(v.right, 0),
              ue = Wt(v.top, 0),
              ge = Wt(v.bottom, 0);
            E
              ? (G =
                  R -
                  2 * (se !== 0 || re !== 0 ? se + re : Wt(v.left, v.right)))
              : (Y =
                  w -
                  2 * (ue !== 0 || ge !== 0 ? ue + ge : Wt(v.top, v.bottom)));
          }
          await p({ ...r, availableWidth: G, availableHeight: Y });
          const te = await d.getDimensions(h.floating);
          return R !== te.width || w !== te.height
            ? { reset: { rects: !0 } }
            : {};
        },
      }
    );
  };
function bs() {
  return typeof window < "u";
}
function zo(t) {
  return m0(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function tn(t) {
  var r;
  return (
    (t == null || (r = t.ownerDocument) == null ? void 0 : r.defaultView) ||
    window
  );
}
function $n(t) {
  var r;
  return (r = (m0(t) ? t.ownerDocument : t.document) || window.document) == null
    ? void 0
    : r.documentElement;
}
function m0(t) {
  return bs() ? t instanceof Node || t instanceof tn(t).Node : !1;
}
function En(t) {
  return bs() ? t instanceof Element || t instanceof tn(t).Element : !1;
}
function Zn(t) {
  return bs() ? t instanceof HTMLElement || t instanceof tn(t).HTMLElement : !1;
}
function my(t) {
  return !bs() || typeof ShadowRoot > "u"
    ? !1
    : t instanceof ShadowRoot || t instanceof tn(t).ShadowRoot;
}
const rO = new Set(["inline", "contents"]);
function ni(t) {
  const { overflow: r, overflowX: o, overflowY: l, display: c } = Cn(t);
  return /auto|scroll|overlay|hidden|clip/.test(r + l + o) && !rO.has(c);
}
const aO = new Set(["table", "td", "th"]);
function oO(t) {
  return aO.has(zo(t));
}
const lO = [":popover-open", ":modal"];
function xs(t) {
  return lO.some((r) => {
    try {
      return t.matches(r);
    } catch {
      return !1;
    }
  });
}
const iO = ["transform", "translate", "scale", "rotate", "perspective"],
  cO = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
  sO = ["paint", "layout", "strict", "content"];
function ih(t) {
  const r = ch(),
    o = En(t) ? Cn(t) : t;
  return (
    iO.some((l) => (o[l] ? o[l] !== "none" : !1)) ||
    (o.containerType ? o.containerType !== "normal" : !1) ||
    (!r && (o.backdropFilter ? o.backdropFilter !== "none" : !1)) ||
    (!r && (o.filter ? o.filter !== "none" : !1)) ||
    cO.some((l) => (o.willChange || "").includes(l)) ||
    sO.some((l) => (o.contain || "").includes(l))
  );
}
function uO(t) {
  let r = $r(t);
  for (; Zn(r) && !Ao(r); ) {
    if (ih(r)) return r;
    if (xs(r)) return null;
    r = $r(r);
  }
  return null;
}
function ch() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
const fO = new Set(["html", "body", "#document"]);
function Ao(t) {
  return fO.has(zo(t));
}
function Cn(t) {
  return tn(t).getComputedStyle(t);
}
function Ss(t) {
  return En(t)
    ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
    : { scrollLeft: t.scrollX, scrollTop: t.scrollY };
}
function $r(t) {
  if (zo(t) === "html") return t;
  const r = t.assignedSlot || t.parentNode || (my(t) && t.host) || $n(t);
  return my(r) ? r.host : r;
}
function p0(t) {
  const r = $r(t);
  return Ao(r)
    ? t.ownerDocument
      ? t.ownerDocument.body
      : t.body
    : Zn(r) && ni(r)
    ? r
    : p0(r);
}
function Vl(t, r, o) {
  var l;
  r === void 0 && (r = []), o === void 0 && (o = !0);
  const c = p0(t),
    u = c === ((l = t.ownerDocument) == null ? void 0 : l.body),
    d = tn(c);
  if (u) {
    const h = Cd(d);
    return r.concat(
      d,
      d.visualViewport || [],
      ni(c) ? c : [],
      h && o ? Vl(h) : []
    );
  }
  return r.concat(c, Vl(c, [], o));
}
function Cd(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function g0(t) {
  const r = Cn(t);
  let o = parseFloat(r.width) || 0,
    l = parseFloat(r.height) || 0;
  const c = Zn(t),
    u = c ? t.offsetWidth : o,
    d = c ? t.offsetHeight : l,
    h = Qc(o) !== u || Qc(l) !== d;
  return h && ((o = u), (l = d)), { width: o, height: l, $: h };
}
function sh(t) {
  return En(t) ? t : t.contextElement;
}
function Eo(t) {
  const r = sh(t);
  if (!Zn(r)) return Bn(1);
  const o = r.getBoundingClientRect(),
    { width: l, height: c, $: u } = g0(r);
  let d = (u ? Qc(o.width) : o.width) / l,
    h = (u ? Qc(o.height) : o.height) / c;
  return (
    (!d || !Number.isFinite(d)) && (d = 1),
    (!h || !Number.isFinite(h)) && (h = 1),
    { x: d, y: h }
  );
}
const dO = Bn(0);
function v0(t) {
  const r = tn(t);
  return !ch() || !r.visualViewport
    ? dO
    : { x: r.visualViewport.offsetLeft, y: r.visualViewport.offsetTop };
}
function hO(t, r, o) {
  return r === void 0 && (r = !1), !o || (r && o !== tn(t)) ? !1 : r;
}
function ba(t, r, o, l) {
  r === void 0 && (r = !1), o === void 0 && (o = !1);
  const c = t.getBoundingClientRect(),
    u = sh(t);
  let d = Bn(1);
  r && (l ? En(l) && (d = Eo(l)) : (d = Eo(t)));
  const h = hO(u, o, l) ? v0(u) : Bn(0);
  let p = (c.left + h.x) / d.x,
    m = (c.top + h.y) / d.y,
    v = c.width / d.x,
    x = c.height / d.y;
  if (u) {
    const _ = tn(u),
      E = l && En(l) ? tn(l) : l;
    let R = _,
      w = Cd(R);
    for (; w && l && E !== R; ) {
      const C = Eo(w),
        O = w.getBoundingClientRect(),
        D = Cn(w),
        j = O.left + (w.clientLeft + parseFloat(D.paddingLeft)) * C.x,
        B = O.top + (w.clientTop + parseFloat(D.paddingTop)) * C.y;
      (p *= C.x),
        (m *= C.y),
        (v *= C.x),
        (x *= C.y),
        (p += j),
        (m += B),
        (R = tn(w)),
        (w = Cd(R));
    }
  }
  return Jc({ width: v, height: x, x: p, y: m });
}
function ws(t, r) {
  const o = Ss(t).scrollLeft;
  return r ? r.left + o : ba($n(t)).left + o;
}
function y0(t, r) {
  const o = t.getBoundingClientRect(),
    l = o.left + r.scrollLeft - ws(t, o),
    c = o.top + r.scrollTop;
  return { x: l, y: c };
}
function mO(t) {
  let { elements: r, rect: o, offsetParent: l, strategy: c } = t;
  const u = c === "fixed",
    d = $n(l),
    h = r ? xs(r.floating) : !1;
  if (l === d || (h && u)) return o;
  let p = { scrollLeft: 0, scrollTop: 0 },
    m = Bn(1);
  const v = Bn(0),
    x = Zn(l);
  if (
    (x || (!x && !u)) &&
    ((zo(l) !== "body" || ni(d)) && (p = Ss(l)), Zn(l))
  ) {
    const E = ba(l);
    (m = Eo(l)), (v.x = E.x + l.clientLeft), (v.y = E.y + l.clientTop);
  }
  const _ = d && !x && !u ? y0(d, p) : Bn(0);
  return {
    width: o.width * m.x,
    height: o.height * m.y,
    x: o.x * m.x - p.scrollLeft * m.x + v.x + _.x,
    y: o.y * m.y - p.scrollTop * m.y + v.y + _.y,
  };
}
function pO(t) {
  return Array.from(t.getClientRects());
}
function gO(t) {
  const r = $n(t),
    o = Ss(t),
    l = t.ownerDocument.body,
    c = Wt(r.scrollWidth, r.clientWidth, l.scrollWidth, l.clientWidth),
    u = Wt(r.scrollHeight, r.clientHeight, l.scrollHeight, l.clientHeight);
  let d = -o.scrollLeft + ws(t);
  const h = -o.scrollTop;
  return (
    Cn(l).direction === "rtl" && (d += Wt(r.clientWidth, l.clientWidth) - c),
    { width: c, height: u, x: d, y: h }
  );
}
const py = 25;
function vO(t, r) {
  const o = tn(t),
    l = $n(t),
    c = o.visualViewport;
  let u = l.clientWidth,
    d = l.clientHeight,
    h = 0,
    p = 0;
  if (c) {
    (u = c.width), (d = c.height);
    const v = ch();
    (!v || (v && r === "fixed")) && ((h = c.offsetLeft), (p = c.offsetTop));
  }
  const m = ws(l);
  if (m <= 0) {
    const v = l.ownerDocument,
      x = v.body,
      _ = getComputedStyle(x),
      E =
        (v.compatMode === "CSS1Compat" &&
          parseFloat(_.marginLeft) + parseFloat(_.marginRight)) ||
        0,
      R = Math.abs(l.clientWidth - x.clientWidth - E);
    R <= py && (u -= R);
  } else m <= py && (u += m);
  return { width: u, height: d, x: h, y: p };
}
const yO = new Set(["absolute", "fixed"]);
function bO(t, r) {
  const o = ba(t, !0, r === "fixed"),
    l = o.top + t.clientTop,
    c = o.left + t.clientLeft,
    u = Zn(t) ? Eo(t) : Bn(1),
    d = t.clientWidth * u.x,
    h = t.clientHeight * u.y,
    p = c * u.x,
    m = l * u.y;
  return { width: d, height: h, x: p, y: m };
}
function gy(t, r, o) {
  let l;
  if (r === "viewport") l = vO(t, o);
  else if (r === "document") l = gO($n(t));
  else if (En(r)) l = bO(r, o);
  else {
    const c = v0(t);
    l = { x: r.x - c.x, y: r.y - c.y, width: r.width, height: r.height };
  }
  return Jc(l);
}
function b0(t, r) {
  const o = $r(t);
  return o === r || !En(o) || Ao(o)
    ? !1
    : Cn(o).position === "fixed" || b0(o, r);
}
function xO(t, r) {
  const o = r.get(t);
  if (o) return o;
  let l = Vl(t, [], !1).filter((h) => En(h) && zo(h) !== "body"),
    c = null;
  const u = Cn(t).position === "fixed";
  let d = u ? $r(t) : t;
  for (; En(d) && !Ao(d); ) {
    const h = Cn(d),
      p = ih(d);
    !p && h.position === "fixed" && (c = null),
      (
        u
          ? !p && !c
          : (!p && h.position === "static" && !!c && yO.has(c.position)) ||
            (ni(d) && !p && b0(t, d))
      )
        ? (l = l.filter((v) => v !== d))
        : (c = h),
      (d = $r(d));
  }
  return r.set(t, l), l;
}
function SO(t) {
  let { element: r, boundary: o, rootBoundary: l, strategy: c } = t;
  const d = [
      ...(o === "clippingAncestors"
        ? xs(r)
          ? []
          : xO(r, this._c)
        : [].concat(o)),
      l,
    ],
    h = d[0],
    p = d.reduce((m, v) => {
      const x = gy(r, v, c);
      return (
        (m.top = Wt(x.top, m.top)),
        (m.right = Hr(x.right, m.right)),
        (m.bottom = Hr(x.bottom, m.bottom)),
        (m.left = Wt(x.left, m.left)),
        m
      );
    }, gy(r, h, c));
  return {
    width: p.right - p.left,
    height: p.bottom - p.top,
    x: p.left,
    y: p.top,
  };
}
function wO(t) {
  const { width: r, height: o } = g0(t);
  return { width: r, height: o };
}
function _O(t, r, o) {
  const l = Zn(r),
    c = $n(r),
    u = o === "fixed",
    d = ba(t, !0, u, r);
  let h = { scrollLeft: 0, scrollTop: 0 };
  const p = Bn(0);
  function m() {
    p.x = ws(c);
  }
  if (l || (!l && !u))
    if (((zo(r) !== "body" || ni(c)) && (h = Ss(r)), l)) {
      const E = ba(r, !0, u, r);
      (p.x = E.x + r.clientLeft), (p.y = E.y + r.clientTop);
    } else c && m();
  u && !l && c && m();
  const v = c && !l && !u ? y0(c, h) : Bn(0),
    x = d.left + h.scrollLeft - p.x - v.x,
    _ = d.top + h.scrollTop - p.y - v.y;
  return { x, y: _, width: d.width, height: d.height };
}
function od(t) {
  return Cn(t).position === "static";
}
function vy(t, r) {
  if (!Zn(t) || Cn(t).position === "fixed") return null;
  if (r) return r(t);
  let o = t.offsetParent;
  return $n(t) === o && (o = o.ownerDocument.body), o;
}
function x0(t, r) {
  const o = tn(t);
  if (xs(t)) return o;
  if (!Zn(t)) {
    let c = $r(t);
    for (; c && !Ao(c); ) {
      if (En(c) && !od(c)) return c;
      c = $r(c);
    }
    return o;
  }
  let l = vy(t, r);
  for (; l && oO(l) && od(l); ) l = vy(l, r);
  return l && Ao(l) && od(l) && !ih(l) ? o : l || uO(t) || o;
}
const EO = async function (t) {
  const r = this.getOffsetParent || x0,
    o = this.getDimensions,
    l = await o(t.floating);
  return {
    reference: _O(t.reference, await r(t.floating), t.strategy),
    floating: { x: 0, y: 0, width: l.width, height: l.height },
  };
};
function CO(t) {
  return Cn(t).direction === "rtl";
}
const RO = {
  convertOffsetParentRelativeRectToViewportRelativeRect: mO,
  getDocumentElement: $n,
  getClippingRect: SO,
  getOffsetParent: x0,
  getElementRects: EO,
  getClientRects: pO,
  getDimensions: wO,
  getScale: Eo,
  isElement: En,
  isRTL: CO,
};
function S0(t, r) {
  return (
    t.x === r.x && t.y === r.y && t.width === r.width && t.height === r.height
  );
}
function AO(t, r) {
  let o = null,
    l;
  const c = $n(t);
  function u() {
    var h;
    clearTimeout(l), (h = o) == null || h.disconnect(), (o = null);
  }
  function d(h, p) {
    h === void 0 && (h = !1), p === void 0 && (p = 1), u();
    const m = t.getBoundingClientRect(),
      { left: v, top: x, width: _, height: E } = m;
    if ((h || r(), !_ || !E)) return;
    const R = Lc(x),
      w = Lc(c.clientWidth - (v + _)),
      C = Lc(c.clientHeight - (x + E)),
      O = Lc(v),
      j = {
        rootMargin: -R + "px " + -w + "px " + -C + "px " + -O + "px",
        threshold: Wt(0, Hr(1, p)) || 1,
      };
    let B = !0;
    function L(F) {
      const Y = F[0].intersectionRatio;
      if (Y !== p) {
        if (!B) return d();
        Y
          ? d(!1, Y)
          : (l = setTimeout(() => {
              d(!1, 1e-7);
            }, 1e3));
      }
      Y === 1 && !S0(m, t.getBoundingClientRect()) && d(), (B = !1);
    }
    try {
      o = new IntersectionObserver(L, { ...j, root: c.ownerDocument });
    } catch {
      o = new IntersectionObserver(L, j);
    }
    o.observe(t);
  }
  return d(!0), u;
}
function TO(t, r, o, l) {
  l === void 0 && (l = {});
  const {
      ancestorScroll: c = !0,
      ancestorResize: u = !0,
      elementResize: d = typeof ResizeObserver == "function",
      layoutShift: h = typeof IntersectionObserver == "function",
      animationFrame: p = !1,
    } = l,
    m = sh(t),
    v = c || u ? [...(m ? Vl(m) : []), ...Vl(r)] : [];
  v.forEach((O) => {
    c && O.addEventListener("scroll", o, { passive: !0 }),
      u && O.addEventListener("resize", o);
  });
  const x = m && h ? AO(m, o) : null;
  let _ = -1,
    E = null;
  d &&
    ((E = new ResizeObserver((O) => {
      let [D] = O;
      D &&
        D.target === m &&
        E &&
        (E.unobserve(r),
        cancelAnimationFrame(_),
        (_ = requestAnimationFrame(() => {
          var j;
          (j = E) == null || j.observe(r);
        }))),
        o();
    })),
    m && !p && E.observe(m),
    E.observe(r));
  let R,
    w = p ? ba(t) : null;
  p && C();
  function C() {
    const O = ba(t);
    w && !S0(w, O) && o(), (w = O), (R = requestAnimationFrame(C));
  }
  return (
    o(),
    () => {
      var O;
      v.forEach((D) => {
        c && D.removeEventListener("scroll", o),
          u && D.removeEventListener("resize", o);
      }),
        x?.(),
        (O = E) == null || O.disconnect(),
        (E = null),
        p && cancelAnimationFrame(R);
    }
  );
}
const NO = WN,
  OO = eO,
  DO = QN,
  jO = nO,
  zO = FN,
  yy = KN,
  MO = tO,
  kO = (t, r, o) => {
    const l = new Map(),
      c = { platform: RO, ...o },
      u = { ...c.platform, _c: l };
    return XN(t, r, { ...c, platform: u });
  };
var LO = typeof document < "u",
  UO = function () {},
  Vc = LO ? y.useLayoutEffect : UO;
function Wc(t, r) {
  if (t === r) return !0;
  if (typeof t != typeof r) return !1;
  if (typeof t == "function" && t.toString() === r.toString()) return !0;
  let o, l, c;
  if (t && r && typeof t == "object") {
    if (Array.isArray(t)) {
      if (((o = t.length), o !== r.length)) return !1;
      for (l = o; l-- !== 0; ) if (!Wc(t[l], r[l])) return !1;
      return !0;
    }
    if (((c = Object.keys(t)), (o = c.length), o !== Object.keys(r).length))
      return !1;
    for (l = o; l-- !== 0; ) if (!{}.hasOwnProperty.call(r, c[l])) return !1;
    for (l = o; l-- !== 0; ) {
      const u = c[l];
      if (!(u === "_owner" && t.$$typeof) && !Wc(t[u], r[u])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}
function w0(t) {
  return typeof window > "u"
    ? 1
    : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function by(t, r) {
  const o = w0(t);
  return Math.round(r * o) / o;
}
function ld(t) {
  const r = y.useRef(t);
  return (
    Vc(() => {
      r.current = t;
    }),
    r
  );
}
function BO(t) {
  t === void 0 && (t = {});
  const {
      placement: r = "bottom",
      strategy: o = "absolute",
      middleware: l = [],
      platform: c,
      elements: { reference: u, floating: d } = {},
      transform: h = !0,
      whileElementsMounted: p,
      open: m,
    } = t,
    [v, x] = y.useState({
      x: 0,
      y: 0,
      strategy: o,
      placement: r,
      middlewareData: {},
      isPositioned: !1,
    }),
    [_, E] = y.useState(l);
  Wc(_, l) || E(l);
  const [R, w] = y.useState(null),
    [C, O] = y.useState(null),
    D = y.useCallback(($) => {
      $ !== F.current && ((F.current = $), w($));
    }, []),
    j = y.useCallback(($) => {
      $ !== Y.current && ((Y.current = $), O($));
    }, []),
    B = u || R,
    L = d || C,
    F = y.useRef(null),
    Y = y.useRef(null),
    G = y.useRef(v),
    te = p != null,
    se = ld(p),
    re = ld(c),
    ue = ld(m),
    ge = y.useCallback(() => {
      if (!F.current || !Y.current) return;
      const $ = { placement: r, strategy: o, middleware: _ };
      re.current && ($.platform = re.current),
        kO(F.current, Y.current, $).then((ae) => {
          const T = { ...ae, isPositioned: ue.current !== !1 };
          he.current &&
            !Wc(G.current, T) &&
            ((G.current = T),
            Ln.flushSync(() => {
              x(T);
            }));
        });
    }, [_, r, o, re, ue]);
  Vc(() => {
    m === !1 &&
      G.current.isPositioned &&
      ((G.current.isPositioned = !1), x(($) => ({ ...$, isPositioned: !1 })));
  }, [m]);
  const he = y.useRef(!1);
  Vc(
    () => (
      (he.current = !0),
      () => {
        he.current = !1;
      }
    ),
    []
  ),
    Vc(() => {
      if ((B && (F.current = B), L && (Y.current = L), B && L)) {
        if (se.current) return se.current(B, L, ge);
        ge();
      }
    }, [B, L, ge, se, te]);
  const me = y.useMemo(
      () => ({ reference: F, floating: Y, setReference: D, setFloating: j }),
      [D, j]
    ),
    z = y.useMemo(() => ({ reference: B, floating: L }), [B, L]),
    V = y.useMemo(() => {
      const $ = { position: o, left: 0, top: 0 };
      if (!z.floating) return $;
      const ae = by(z.floating, v.x),
        T = by(z.floating, v.y);
      return h
        ? {
            ...$,
            transform: "translate(" + ae + "px, " + T + "px)",
            ...(w0(z.floating) >= 1.5 && { willChange: "transform" }),
          }
        : { position: o, left: ae, top: T };
    }, [o, h, z.floating, v.x, v.y]);
  return y.useMemo(
    () => ({ ...v, update: ge, refs: me, elements: z, floatingStyles: V }),
    [v, ge, me, z, V]
  );
}
const ZO = (t) => {
    function r(o) {
      return {}.hasOwnProperty.call(o, "current");
    }
    return {
      name: "arrow",
      options: t,
      fn(o) {
        const { element: l, padding: c } = typeof t == "function" ? t(o) : t;
        return l && r(l)
          ? l.current != null
            ? yy({ element: l.current, padding: c }).fn(o)
            : {}
          : l
          ? yy({ element: l, padding: c }).fn(o)
          : {};
      },
    };
  },
  HO = (t, r) => ({ ...NO(t), options: [t, r] }),
  $O = (t, r) => ({ ...OO(t), options: [t, r] }),
  GO = (t, r) => ({ ...MO(t), options: [t, r] }),
  YO = (t, r) => ({ ...DO(t), options: [t, r] }),
  VO = (t, r) => ({ ...jO(t), options: [t, r] }),
  IO = (t, r) => ({ ...zO(t), options: [t, r] }),
  qO = (t, r) => ({ ...ZO(t), options: [t, r] });
var PO = "Arrow",
  _0 = y.forwardRef((t, r) => {
    const { children: o, width: l = 10, height: c = 5, ...u } = t;
    return g.jsx(De.svg, {
      ...u,
      ref: r,
      width: l,
      height: c,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: t.asChild ? o : g.jsx("polygon", { points: "0,0 30,0 15,10" }),
    });
  });
_0.displayName = PO;
var XO = _0,
  uh = "Popper",
  [E0, _s] = sr(uh),
  [KO, C0] = E0(uh),
  R0 = (t) => {
    const { __scopePopper: r, children: o } = t,
      [l, c] = y.useState(null);
    return g.jsx(KO, { scope: r, anchor: l, onAnchorChange: c, children: o });
  };
R0.displayName = uh;
var A0 = "PopperAnchor",
  T0 = y.forwardRef((t, r) => {
    const { __scopePopper: o, virtualRef: l, ...c } = t,
      u = C0(A0, o),
      d = y.useRef(null),
      h = Be(r, d),
      p = y.useRef(null);
    return (
      y.useEffect(() => {
        const m = p.current;
        (p.current = l?.current || d.current),
          m !== p.current && u.onAnchorChange(p.current);
      }),
      l ? null : g.jsx(De.div, { ...c, ref: h })
    );
  });
T0.displayName = A0;
var fh = "PopperContent",
  [QO, FO] = E0(fh),
  N0 = y.forwardRef((t, r) => {
    const {
        __scopePopper: o,
        side: l = "bottom",
        sideOffset: c = 0,
        align: u = "center",
        alignOffset: d = 0,
        arrowPadding: h = 0,
        avoidCollisions: p = !0,
        collisionBoundary: m = [],
        collisionPadding: v = 0,
        sticky: x = "partial",
        hideWhenDetached: _ = !1,
        updatePositionStrategy: E = "optimized",
        onPlaced: R,
        ...w
      } = t,
      C = C0(fh, o),
      [O, D] = y.useState(null),
      j = Be(r, (W) => D(W)),
      [B, L] = y.useState(null),
      F = Qd(B),
      Y = F?.width ?? 0,
      G = F?.height ?? 0,
      te = l + (u !== "center" ? "-" + u : ""),
      se =
        typeof v == "number"
          ? v
          : { top: 0, right: 0, bottom: 0, left: 0, ...v },
      re = Array.isArray(m) ? m : [m],
      ue = re.length > 0,
      ge = { padding: se, boundary: re.filter(WO), altBoundary: ue },
      {
        refs: he,
        floatingStyles: me,
        placement: z,
        isPositioned: V,
        middlewareData: $,
      } = BO({
        strategy: "fixed",
        placement: te,
        whileElementsMounted: (...W) =>
          TO(...W, { animationFrame: E === "always" }),
        elements: { reference: C.anchor },
        middleware: [
          HO({ mainAxis: c + G, alignmentAxis: d }),
          p &&
            $O({
              mainAxis: !0,
              crossAxis: !1,
              limiter: x === "partial" ? GO() : void 0,
              ...ge,
            }),
          p && YO({ ...ge }),
          VO({
            ...ge,
            apply: ({
              elements: W,
              rects: fe,
              availableWidth: Ee,
              availableHeight: ce,
            }) => {
              const { width: Ce, height: _e } = fe.reference,
                Qe = W.floating.style;
              Qe.setProperty("--radix-popper-available-width", `${Ee}px`),
                Qe.setProperty("--radix-popper-available-height", `${ce}px`),
                Qe.setProperty("--radix-popper-anchor-width", `${Ce}px`),
                Qe.setProperty("--radix-popper-anchor-height", `${_e}px`);
            },
          }),
          B && qO({ element: B, padding: h }),
          eD({ arrowWidth: Y, arrowHeight: G }),
          _ && IO({ strategy: "referenceHidden", ...ge }),
        ],
      }),
      [ae, T] = j0(z),
      q = Zr(R);
    Mt(() => {
      V && q?.();
    }, [V, q]);
    const J = $.arrow?.x,
      Q = $.arrow?.y,
      ee = $.arrow?.centerOffset !== 0,
      [ye, ne] = y.useState();
    return (
      Mt(() => {
        O && ne(window.getComputedStyle(O).zIndex);
      }, [O]),
      g.jsx("div", {
        ref: he.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...me,
          transform: V ? me.transform : "translate(0, -200%)",
          minWidth: "max-content",
          zIndex: ye,
          "--radix-popper-transform-origin": [
            $.transformOrigin?.x,
            $.transformOrigin?.y,
          ].join(" "),
          ...($.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none",
          }),
        },
        dir: t.dir,
        children: g.jsx(QO, {
          scope: o,
          placedSide: ae,
          onArrowChange: L,
          arrowX: J,
          arrowY: Q,
          shouldHideArrow: ee,
          children: g.jsx(De.div, {
            "data-side": ae,
            "data-align": T,
            ...w,
            ref: j,
            style: { ...w.style, animation: V ? void 0 : "none" },
          }),
        }),
      })
    );
  });
N0.displayName = fh;
var O0 = "PopperArrow",
  JO = { top: "bottom", right: "left", bottom: "top", left: "right" },
  D0 = y.forwardRef(function (r, o) {
    const { __scopePopper: l, ...c } = r,
      u = FO(O0, l),
      d = JO[u.placedSide];
    return g.jsx("span", {
      ref: u.onArrowChange,
      style: {
        position: "absolute",
        left: u.arrowX,
        top: u.arrowY,
        [d]: 0,
        transformOrigin: {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[u.placedSide],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: "rotate(180deg)",
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[u.placedSide],
        visibility: u.shouldHideArrow ? "hidden" : void 0,
      },
      children: g.jsx(XO, {
        ...c,
        ref: o,
        style: { ...c.style, display: "block" },
      }),
    });
  });
D0.displayName = O0;
function WO(t) {
  return t !== null;
}
var eD = (t) => ({
  name: "transformOrigin",
  options: t,
  fn(r) {
    const { placement: o, rects: l, middlewareData: c } = r,
      d = c.arrow?.centerOffset !== 0,
      h = d ? 0 : t.arrowWidth,
      p = d ? 0 : t.arrowHeight,
      [m, v] = j0(o),
      x = { start: "0%", center: "50%", end: "100%" }[v],
      _ = (c.arrow?.x ?? 0) + h / 2,
      E = (c.arrow?.y ?? 0) + p / 2;
    let R = "",
      w = "";
    return (
      m === "bottom"
        ? ((R = d ? x : `${_}px`), (w = `${-p}px`))
        : m === "top"
        ? ((R = d ? x : `${_}px`), (w = `${l.floating.height + p}px`))
        : m === "right"
        ? ((R = `${-p}px`), (w = d ? x : `${E}px`))
        : m === "left" &&
          ((R = `${l.floating.width + p}px`), (w = d ? x : `${E}px`)),
      { data: { x: R, y: w } }
    );
  },
});
function j0(t) {
  const [r, o = "center"] = t.split("-");
  return [r, o];
}
var z0 = R0,
  M0 = T0,
  k0 = N0,
  L0 = D0,
  U0 = Object.freeze({
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal",
  }),
  tD = "VisuallyHidden",
  B0 = y.forwardRef((t, r) =>
    g.jsx(De.span, { ...t, ref: r, style: { ...U0, ...t.style } })
  );
B0.displayName = tD;
var nD = B0,
  rD = [" ", "Enter", "ArrowUp", "ArrowDown"],
  aD = [" ", "Enter"],
  xa = "Select",
  [Es, Cs, oD] = f0(xa),
  [Mo, VM] = sr(xa, [oD, _s]),
  Rs = _s(),
  [lD, Vr] = Mo(xa),
  [iD, cD] = Mo(xa),
  Z0 = (t) => {
    const {
        __scopeSelect: r,
        children: o,
        open: l,
        defaultOpen: c,
        onOpenChange: u,
        value: d,
        defaultValue: h,
        onValueChange: p,
        dir: m,
        name: v,
        autoComplete: x,
        disabled: _,
        required: E,
        form: R,
      } = t,
      w = Rs(r),
      [C, O] = y.useState(null),
      [D, j] = y.useState(null),
      [B, L] = y.useState(!1),
      F = rh(m),
      [Y, G] = va({ prop: l, defaultProp: c ?? !1, onChange: u, caller: xa }),
      [te, se] = va({ prop: d, defaultProp: h, onChange: p, caller: xa }),
      re = y.useRef(null),
      ue = C ? R || !!C.closest("form") : !0,
      [ge, he] = y.useState(new Set()),
      me = Array.from(ge)
        .map((z) => z.props.value)
        .join(";");
    return g.jsx(z0, {
      ...w,
      children: g.jsxs(lD, {
        required: E,
        scope: r,
        trigger: C,
        onTriggerChange: O,
        valueNode: D,
        onValueNodeChange: j,
        valueNodeHasChildren: B,
        onValueNodeHasChildrenChange: L,
        contentId: Br(),
        value: te,
        onValueChange: se,
        open: Y,
        onOpenChange: G,
        dir: F,
        triggerPointerDownPosRef: re,
        disabled: _,
        children: [
          g.jsx(Es.Provider, {
            scope: r,
            children: g.jsx(iD, {
              scope: t.__scopeSelect,
              onNativeOptionAdd: y.useCallback((z) => {
                he((V) => new Set(V).add(z));
              }, []),
              onNativeOptionRemove: y.useCallback((z) => {
                he((V) => {
                  const $ = new Set(V);
                  return $.delete(z), $;
                });
              }, []),
              children: o,
            }),
          }),
          ue
            ? g.jsxs(
                ix,
                {
                  "aria-hidden": !0,
                  required: E,
                  tabIndex: -1,
                  name: v,
                  autoComplete: x,
                  value: te,
                  onChange: (z) => se(z.target.value),
                  disabled: _,
                  form: R,
                  children: [
                    te === void 0 ? g.jsx("option", { value: "" }) : null,
                    Array.from(ge),
                  ],
                },
                me
              )
            : null,
        ],
      }),
    });
  };
Z0.displayName = xa;
var H0 = "SelectTrigger",
  $0 = y.forwardRef((t, r) => {
    const { __scopeSelect: o, disabled: l = !1, ...c } = t,
      u = Rs(o),
      d = Vr(H0, o),
      h = d.disabled || l,
      p = Be(r, d.onTriggerChange),
      m = Cs(o),
      v = y.useRef("touch"),
      [x, _, E] = sx((w) => {
        const C = m().filter((j) => !j.disabled),
          O = C.find((j) => j.value === d.value),
          D = ux(C, w, O);
        D !== void 0 && d.onValueChange(D.value);
      }),
      R = (w) => {
        h || (d.onOpenChange(!0), E()),
          w &&
            (d.triggerPointerDownPosRef.current = {
              x: Math.round(w.pageX),
              y: Math.round(w.pageY),
            });
      };
    return g.jsx(M0, {
      asChild: !0,
      ...u,
      children: g.jsx(De.button, {
        type: "button",
        role: "combobox",
        "aria-controls": d.contentId,
        "aria-expanded": d.open,
        "aria-required": d.required,
        "aria-autocomplete": "none",
        dir: d.dir,
        "data-state": d.open ? "open" : "closed",
        disabled: h,
        "data-disabled": h ? "" : void 0,
        "data-placeholder": cx(d.value) ? "" : void 0,
        ...c,
        ref: p,
        onClick: Se(c.onClick, (w) => {
          w.currentTarget.focus(), v.current !== "mouse" && R(w);
        }),
        onPointerDown: Se(c.onPointerDown, (w) => {
          v.current = w.pointerType;
          const C = w.target;
          C.hasPointerCapture(w.pointerId) &&
            C.releasePointerCapture(w.pointerId),
            w.button === 0 &&
              w.ctrlKey === !1 &&
              w.pointerType === "mouse" &&
              (R(w), w.preventDefault());
        }),
        onKeyDown: Se(c.onKeyDown, (w) => {
          const C = x.current !== "";
          !(w.ctrlKey || w.altKey || w.metaKey) &&
            w.key.length === 1 &&
            _(w.key),
            !(C && w.key === " ") &&
              rD.includes(w.key) &&
              (R(), w.preventDefault());
        }),
      }),
    });
  });
$0.displayName = H0;
var G0 = "SelectValue",
  Y0 = y.forwardRef((t, r) => {
    const {
        __scopeSelect: o,
        className: l,
        style: c,
        children: u,
        placeholder: d = "",
        ...h
      } = t,
      p = Vr(G0, o),
      { onValueNodeHasChildrenChange: m } = p,
      v = u !== void 0,
      x = Be(r, p.onValueNodeChange);
    return (
      Mt(() => {
        m(v);
      }, [m, v]),
      g.jsx(De.span, {
        ...h,
        ref: x,
        style: { pointerEvents: "none" },
        children: cx(p.value) ? g.jsx(g.Fragment, { children: d }) : u,
      })
    );
  });
Y0.displayName = G0;
var sD = "SelectIcon",
  V0 = y.forwardRef((t, r) => {
    const { __scopeSelect: o, children: l, ...c } = t;
    return g.jsx(De.span, {
      "aria-hidden": !0,
      ...c,
      ref: r,
      children: l || "▼",
    });
  });
V0.displayName = sD;
var uD = "SelectPortal",
  I0 = (t) => g.jsx(gs, { asChild: !0, ...t });
I0.displayName = uD;
var Sa = "SelectContent",
  q0 = y.forwardRef((t, r) => {
    const o = Vr(Sa, t.__scopeSelect),
      [l, c] = y.useState();
    if (
      (Mt(() => {
        c(new DocumentFragment());
      }, []),
      !o.open)
    ) {
      const u = l;
      return u
        ? Ln.createPortal(
            g.jsx(P0, {
              scope: t.__scopeSelect,
              children: g.jsx(Es.Slot, {
                scope: t.__scopeSelect,
                children: g.jsx("div", { children: t.children }),
              }),
            }),
            u
          )
        : null;
    }
    return g.jsx(X0, { ...t, ref: r });
  });
q0.displayName = Sa;
var _n = 10,
  [P0, Ir] = Mo(Sa),
  fD = "SelectContentImpl",
  dD = Ro("SelectContent.RemoveScroll"),
  X0 = y.forwardRef((t, r) => {
    const {
        __scopeSelect: o,
        position: l = "item-aligned",
        onCloseAutoFocus: c,
        onEscapeKeyDown: u,
        onPointerDownOutside: d,
        side: h,
        sideOffset: p,
        align: m,
        alignOffset: v,
        arrowPadding: x,
        collisionBoundary: _,
        collisionPadding: E,
        sticky: R,
        hideWhenDetached: w,
        avoidCollisions: C,
        ...O
      } = t,
      D = Vr(Sa, o),
      [j, B] = y.useState(null),
      [L, F] = y.useState(null),
      Y = Be(r, (W) => B(W)),
      [G, te] = y.useState(null),
      [se, re] = y.useState(null),
      ue = Cs(o),
      [ge, he] = y.useState(!1),
      me = y.useRef(!1);
    y.useEffect(() => {
      if (j) return Xb(j);
    }, [j]),
      Zb();
    const z = y.useCallback(
        (W) => {
          const [fe, ...Ee] = ue().map((_e) => _e.ref.current),
            [ce] = Ee.slice(-1),
            Ce = document.activeElement;
          for (const _e of W)
            if (
              _e === Ce ||
              (_e?.scrollIntoView({ block: "nearest" }),
              _e === fe && L && (L.scrollTop = 0),
              _e === ce && L && (L.scrollTop = L.scrollHeight),
              _e?.focus(),
              document.activeElement !== Ce)
            )
              return;
        },
        [ue, L]
      ),
      V = y.useCallback(() => z([G, j]), [z, G, j]);
    y.useEffect(() => {
      ge && V();
    }, [ge, V]);
    const { onOpenChange: $, triggerPointerDownPosRef: ae } = D;
    y.useEffect(() => {
      if (j) {
        let W = { x: 0, y: 0 };
        const fe = (ce) => {
            W = {
              x: Math.abs(Math.round(ce.pageX) - (ae.current?.x ?? 0)),
              y: Math.abs(Math.round(ce.pageY) - (ae.current?.y ?? 0)),
            };
          },
          Ee = (ce) => {
            W.x <= 10 && W.y <= 10
              ? ce.preventDefault()
              : j.contains(ce.target) || $(!1),
              document.removeEventListener("pointermove", fe),
              (ae.current = null);
          };
        return (
          ae.current !== null &&
            (document.addEventListener("pointermove", fe),
            document.addEventListener("pointerup", Ee, {
              capture: !0,
              once: !0,
            })),
          () => {
            document.removeEventListener("pointermove", fe),
              document.removeEventListener("pointerup", Ee, { capture: !0 });
          }
        );
      }
    }, [j, $, ae]),
      y.useEffect(() => {
        const W = () => $(!1);
        return (
          window.addEventListener("blur", W),
          window.addEventListener("resize", W),
          () => {
            window.removeEventListener("blur", W),
              window.removeEventListener("resize", W);
          }
        );
      }, [$]);
    const [T, q] = sx((W) => {
        const fe = ue().filter((Ce) => !Ce.disabled),
          Ee = fe.find((Ce) => Ce.ref.current === document.activeElement),
          ce = ux(fe, W, Ee);
        ce && setTimeout(() => ce.ref.current.focus());
      }),
      J = y.useCallback(
        (W, fe, Ee) => {
          const ce = !me.current && !Ee;
          ((D.value !== void 0 && D.value === fe) || ce) &&
            (te(W), ce && (me.current = !0));
        },
        [D.value]
      ),
      Q = y.useCallback(() => j?.focus(), [j]),
      ee = y.useCallback(
        (W, fe, Ee) => {
          const ce = !me.current && !Ee;
          ((D.value !== void 0 && D.value === fe) || ce) && re(W);
        },
        [D.value]
      ),
      ye = l === "popper" ? Rd : K0,
      ne =
        ye === Rd
          ? {
              side: h,
              sideOffset: p,
              align: m,
              alignOffset: v,
              arrowPadding: x,
              collisionBoundary: _,
              collisionPadding: E,
              sticky: R,
              hideWhenDetached: w,
              avoidCollisions: C,
            }
          : {};
    return g.jsx(P0, {
      scope: o,
      content: j,
      viewport: L,
      onViewportChange: F,
      itemRefCallback: J,
      selectedItem: G,
      onItemLeave: Q,
      itemTextRefCallback: ee,
      focusSelectedItem: V,
      selectedItemText: se,
      position: l,
      isPositioned: ge,
      searchRef: T,
      children: g.jsx(Wd, {
        as: dD,
        allowPinchZoom: !0,
        children: g.jsx(Jd, {
          asChild: !0,
          trapped: D.open,
          onMountAutoFocus: (W) => {
            W.preventDefault();
          },
          onUnmountAutoFocus: Se(c, (W) => {
            D.trigger?.focus({ preventScroll: !0 }), W.preventDefault();
          }),
          children: g.jsx(ps, {
            asChild: !0,
            disableOutsidePointerEvents: !0,
            onEscapeKeyDown: u,
            onPointerDownOutside: d,
            onFocusOutside: (W) => W.preventDefault(),
            onDismiss: () => D.onOpenChange(!1),
            children: g.jsx(ye, {
              role: "listbox",
              id: D.contentId,
              "data-state": D.open ? "open" : "closed",
              dir: D.dir,
              onContextMenu: (W) => W.preventDefault(),
              ...O,
              ...ne,
              onPlaced: () => he(!0),
              ref: Y,
              style: {
                display: "flex",
                flexDirection: "column",
                outline: "none",
                ...O.style,
              },
              onKeyDown: Se(O.onKeyDown, (W) => {
                const fe = W.ctrlKey || W.altKey || W.metaKey;
                if (
                  (W.key === "Tab" && W.preventDefault(),
                  !fe && W.key.length === 1 && q(W.key),
                  ["ArrowUp", "ArrowDown", "Home", "End"].includes(W.key))
                ) {
                  let ce = ue()
                    .filter((Ce) => !Ce.disabled)
                    .map((Ce) => Ce.ref.current);
                  if (
                    (["ArrowUp", "End"].includes(W.key) &&
                      (ce = ce.slice().reverse()),
                    ["ArrowUp", "ArrowDown"].includes(W.key))
                  ) {
                    const Ce = W.target,
                      _e = ce.indexOf(Ce);
                    ce = ce.slice(_e + 1);
                  }
                  setTimeout(() => z(ce)), W.preventDefault();
                }
              }),
            }),
          }),
        }),
      }),
    });
  });
X0.displayName = fD;
var hD = "SelectItemAlignedPosition",
  K0 = y.forwardRef((t, r) => {
    const { __scopeSelect: o, onPlaced: l, ...c } = t,
      u = Vr(Sa, o),
      d = Ir(Sa, o),
      [h, p] = y.useState(null),
      [m, v] = y.useState(null),
      x = Be(r, (Y) => v(Y)),
      _ = Cs(o),
      E = y.useRef(!1),
      R = y.useRef(!0),
      {
        viewport: w,
        selectedItem: C,
        selectedItemText: O,
        focusSelectedItem: D,
      } = d,
      j = y.useCallback(() => {
        if (u.trigger && u.valueNode && h && m && w && C && O) {
          const Y = u.trigger.getBoundingClientRect(),
            G = m.getBoundingClientRect(),
            te = u.valueNode.getBoundingClientRect(),
            se = O.getBoundingClientRect();
          if (u.dir !== "rtl") {
            const Ce = se.left - G.left,
              _e = te.left - Ce,
              Qe = Y.left - _e,
              rt = Y.width + Qe,
              nn = Math.max(rt, G.width),
              rn = window.innerWidth - _n,
              _t = cy(_e, [_n, Math.max(_n, rn - nn)]);
            (h.style.minWidth = rt + "px"), (h.style.left = _t + "px");
          } else {
            const Ce = G.right - se.right,
              _e = window.innerWidth - te.right - Ce,
              Qe = window.innerWidth - Y.right - _e,
              rt = Y.width + Qe,
              nn = Math.max(rt, G.width),
              rn = window.innerWidth - _n,
              _t = cy(_e, [_n, Math.max(_n, rn - nn)]);
            (h.style.minWidth = rt + "px"), (h.style.right = _t + "px");
          }
          const re = _(),
            ue = window.innerHeight - _n * 2,
            ge = w.scrollHeight,
            he = window.getComputedStyle(m),
            me = parseInt(he.borderTopWidth, 10),
            z = parseInt(he.paddingTop, 10),
            V = parseInt(he.borderBottomWidth, 10),
            $ = parseInt(he.paddingBottom, 10),
            ae = me + z + ge + $ + V,
            T = Math.min(C.offsetHeight * 5, ae),
            q = window.getComputedStyle(w),
            J = parseInt(q.paddingTop, 10),
            Q = parseInt(q.paddingBottom, 10),
            ee = Y.top + Y.height / 2 - _n,
            ye = ue - ee,
            ne = C.offsetHeight / 2,
            W = C.offsetTop + ne,
            fe = me + z + W,
            Ee = ae - fe;
          if (fe <= ee) {
            const Ce = re.length > 0 && C === re[re.length - 1].ref.current;
            h.style.bottom = "0px";
            const _e = m.clientHeight - w.offsetTop - w.offsetHeight,
              Qe = Math.max(ye, ne + (Ce ? Q : 0) + _e + V),
              rt = fe + Qe;
            h.style.height = rt + "px";
          } else {
            const Ce = re.length > 0 && C === re[0].ref.current;
            h.style.top = "0px";
            const Qe = Math.max(ee, me + w.offsetTop + (Ce ? J : 0) + ne) + Ee;
            (h.style.height = Qe + "px"), (w.scrollTop = fe - ee + w.offsetTop);
          }
          (h.style.margin = `${_n}px 0`),
            (h.style.minHeight = T + "px"),
            (h.style.maxHeight = ue + "px"),
            l?.(),
            requestAnimationFrame(() => (E.current = !0));
        }
      }, [_, u.trigger, u.valueNode, h, m, w, C, O, u.dir, l]);
    Mt(() => j(), [j]);
    const [B, L] = y.useState();
    Mt(() => {
      m && L(window.getComputedStyle(m).zIndex);
    }, [m]);
    const F = y.useCallback(
      (Y) => {
        Y && R.current === !0 && (j(), D?.(), (R.current = !1));
      },
      [j, D]
    );
    return g.jsx(pD, {
      scope: o,
      contentWrapper: h,
      shouldExpandOnScrollRef: E,
      onScrollButtonChange: F,
      children: g.jsx("div", {
        ref: p,
        style: {
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: B,
        },
        children: g.jsx(De.div, {
          ...c,
          ref: x,
          style: { boxSizing: "border-box", maxHeight: "100%", ...c.style },
        }),
      }),
    });
  });
K0.displayName = hD;
var mD = "SelectPopperPosition",
  Rd = y.forwardRef((t, r) => {
    const {
        __scopeSelect: o,
        align: l = "start",
        collisionPadding: c = _n,
        ...u
      } = t,
      d = Rs(o);
    return g.jsx(k0, {
      ...d,
      ...u,
      ref: r,
      align: l,
      collisionPadding: c,
      style: {
        boxSizing: "border-box",
        ...u.style,
        "--radix-select-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-select-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
Rd.displayName = mD;
var [pD, dh] = Mo(Sa, {}),
  Ad = "SelectViewport",
  Q0 = y.forwardRef((t, r) => {
    const { __scopeSelect: o, nonce: l, ...c } = t,
      u = Ir(Ad, o),
      d = dh(Ad, o),
      h = Be(r, u.onViewportChange),
      p = y.useRef(0);
    return g.jsxs(g.Fragment, {
      children: [
        g.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: l,
        }),
        g.jsx(Es.Slot, {
          scope: o,
          children: g.jsx(De.div, {
            "data-radix-select-viewport": "",
            role: "presentation",
            ...c,
            ref: h,
            style: {
              position: "relative",
              flex: 1,
              overflow: "hidden auto",
              ...c.style,
            },
            onScroll: Se(c.onScroll, (m) => {
              const v = m.currentTarget,
                { contentWrapper: x, shouldExpandOnScrollRef: _ } = d;
              if (_?.current && x) {
                const E = Math.abs(p.current - v.scrollTop);
                if (E > 0) {
                  const R = window.innerHeight - _n * 2,
                    w = parseFloat(x.style.minHeight),
                    C = parseFloat(x.style.height),
                    O = Math.max(w, C);
                  if (O < R) {
                    const D = O + E,
                      j = Math.min(R, D),
                      B = D - j;
                    (x.style.height = j + "px"),
                      x.style.bottom === "0px" &&
                        ((v.scrollTop = B > 0 ? B : 0),
                        (x.style.justifyContent = "flex-end"));
                  }
                }
              }
              p.current = v.scrollTop;
            }),
          }),
        }),
      ],
    });
  });
Q0.displayName = Ad;
var F0 = "SelectGroup",
  [gD, vD] = Mo(F0),
  yD = y.forwardRef((t, r) => {
    const { __scopeSelect: o, ...l } = t,
      c = Br();
    return g.jsx(gD, {
      scope: o,
      id: c,
      children: g.jsx(De.div, {
        role: "group",
        "aria-labelledby": c,
        ...l,
        ref: r,
      }),
    });
  });
yD.displayName = F0;
var J0 = "SelectLabel",
  bD = y.forwardRef((t, r) => {
    const { __scopeSelect: o, ...l } = t,
      c = vD(J0, o);
    return g.jsx(De.div, { id: c.id, ...l, ref: r });
  });
bD.displayName = J0;
var es = "SelectItem",
  [xD, W0] = Mo(es),
  ex = y.forwardRef((t, r) => {
    const {
        __scopeSelect: o,
        value: l,
        disabled: c = !1,
        textValue: u,
        ...d
      } = t,
      h = Vr(es, o),
      p = Ir(es, o),
      m = h.value === l,
      [v, x] = y.useState(u ?? ""),
      [_, E] = y.useState(!1),
      R = Be(r, (D) => p.itemRefCallback?.(D, l, c)),
      w = Br(),
      C = y.useRef("touch"),
      O = () => {
        c || (h.onValueChange(l), h.onOpenChange(!1));
      };
    if (l === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return g.jsx(xD, {
      scope: o,
      value: l,
      disabled: c,
      textId: w,
      isSelected: m,
      onItemTextChange: y.useCallback((D) => {
        x((j) => j || (D?.textContent ?? "").trim());
      }, []),
      children: g.jsx(Es.ItemSlot, {
        scope: o,
        value: l,
        disabled: c,
        textValue: v,
        children: g.jsx(De.div, {
          role: "option",
          "aria-labelledby": w,
          "data-highlighted": _ ? "" : void 0,
          "aria-selected": m && _,
          "data-state": m ? "checked" : "unchecked",
          "aria-disabled": c || void 0,
          "data-disabled": c ? "" : void 0,
          tabIndex: c ? void 0 : -1,
          ...d,
          ref: R,
          onFocus: Se(d.onFocus, () => E(!0)),
          onBlur: Se(d.onBlur, () => E(!1)),
          onClick: Se(d.onClick, () => {
            C.current !== "mouse" && O();
          }),
          onPointerUp: Se(d.onPointerUp, () => {
            C.current === "mouse" && O();
          }),
          onPointerDown: Se(d.onPointerDown, (D) => {
            C.current = D.pointerType;
          }),
          onPointerMove: Se(d.onPointerMove, (D) => {
            (C.current = D.pointerType),
              c
                ? p.onItemLeave?.()
                : C.current === "mouse" &&
                  D.currentTarget.focus({ preventScroll: !0 });
          }),
          onPointerLeave: Se(d.onPointerLeave, (D) => {
            D.currentTarget === document.activeElement && p.onItemLeave?.();
          }),
          onKeyDown: Se(d.onKeyDown, (D) => {
            (p.searchRef?.current !== "" && D.key === " ") ||
              (aD.includes(D.key) && O(), D.key === " " && D.preventDefault());
          }),
        }),
      }),
    });
  });
ex.displayName = es;
var Ul = "SelectItemText",
  tx = y.forwardRef((t, r) => {
    const { __scopeSelect: o, className: l, style: c, ...u } = t,
      d = Vr(Ul, o),
      h = Ir(Ul, o),
      p = W0(Ul, o),
      m = cD(Ul, o),
      [v, x] = y.useState(null),
      _ = Be(
        r,
        (O) => x(O),
        p.onItemTextChange,
        (O) => h.itemTextRefCallback?.(O, p.value, p.disabled)
      ),
      E = v?.textContent,
      R = y.useMemo(
        () =>
          g.jsx(
            "option",
            { value: p.value, disabled: p.disabled, children: E },
            p.value
          ),
        [p.disabled, p.value, E]
      ),
      { onNativeOptionAdd: w, onNativeOptionRemove: C } = m;
    return (
      Mt(() => (w(R), () => C(R)), [w, C, R]),
      g.jsxs(g.Fragment, {
        children: [
          g.jsx(De.span, { id: p.textId, ...u, ref: _ }),
          p.isSelected && d.valueNode && !d.valueNodeHasChildren
            ? Ln.createPortal(u.children, d.valueNode)
            : null,
        ],
      })
    );
  });
tx.displayName = Ul;
var nx = "SelectItemIndicator",
  rx = y.forwardRef((t, r) => {
    const { __scopeSelect: o, ...l } = t;
    return W0(nx, o).isSelected
      ? g.jsx(De.span, { "aria-hidden": !0, ...l, ref: r })
      : null;
  });
rx.displayName = nx;
var Td = "SelectScrollUpButton",
  ax = y.forwardRef((t, r) => {
    const o = Ir(Td, t.__scopeSelect),
      l = dh(Td, t.__scopeSelect),
      [c, u] = y.useState(!1),
      d = Be(r, l.onScrollButtonChange);
    return (
      Mt(() => {
        if (o.viewport && o.isPositioned) {
          let h = function () {
            const m = p.scrollTop > 0;
            u(m);
          };
          const p = o.viewport;
          return (
            h(),
            p.addEventListener("scroll", h),
            () => p.removeEventListener("scroll", h)
          );
        }
      }, [o.viewport, o.isPositioned]),
      c
        ? g.jsx(lx, {
            ...t,
            ref: d,
            onAutoScroll: () => {
              const { viewport: h, selectedItem: p } = o;
              h && p && (h.scrollTop = h.scrollTop - p.offsetHeight);
            },
          })
        : null
    );
  });
ax.displayName = Td;
var Nd = "SelectScrollDownButton",
  ox = y.forwardRef((t, r) => {
    const o = Ir(Nd, t.__scopeSelect),
      l = dh(Nd, t.__scopeSelect),
      [c, u] = y.useState(!1),
      d = Be(r, l.onScrollButtonChange);
    return (
      Mt(() => {
        if (o.viewport && o.isPositioned) {
          let h = function () {
            const m = p.scrollHeight - p.clientHeight,
              v = Math.ceil(p.scrollTop) < m;
            u(v);
          };
          const p = o.viewport;
          return (
            h(),
            p.addEventListener("scroll", h),
            () => p.removeEventListener("scroll", h)
          );
        }
      }, [o.viewport, o.isPositioned]),
      c
        ? g.jsx(lx, {
            ...t,
            ref: d,
            onAutoScroll: () => {
              const { viewport: h, selectedItem: p } = o;
              h && p && (h.scrollTop = h.scrollTop + p.offsetHeight);
            },
          })
        : null
    );
  });
ox.displayName = Nd;
var lx = y.forwardRef((t, r) => {
    const { __scopeSelect: o, onAutoScroll: l, ...c } = t,
      u = Ir("SelectScrollButton", o),
      d = y.useRef(null),
      h = Cs(o),
      p = y.useCallback(() => {
        d.current !== null &&
          (window.clearInterval(d.current), (d.current = null));
      }, []);
    return (
      y.useEffect(() => () => p(), [p]),
      Mt(() => {
        h()
          .find((v) => v.ref.current === document.activeElement)
          ?.ref.current?.scrollIntoView({ block: "nearest" });
      }, [h]),
      g.jsx(De.div, {
        "aria-hidden": !0,
        ...c,
        ref: r,
        style: { flexShrink: 0, ...c.style },
        onPointerDown: Se(c.onPointerDown, () => {
          d.current === null && (d.current = window.setInterval(l, 50));
        }),
        onPointerMove: Se(c.onPointerMove, () => {
          u.onItemLeave?.(),
            d.current === null && (d.current = window.setInterval(l, 50));
        }),
        onPointerLeave: Se(c.onPointerLeave, () => {
          p();
        }),
      })
    );
  }),
  SD = "SelectSeparator",
  wD = y.forwardRef((t, r) => {
    const { __scopeSelect: o, ...l } = t;
    return g.jsx(De.div, { "aria-hidden": !0, ...l, ref: r });
  });
wD.displayName = SD;
var Od = "SelectArrow",
  _D = y.forwardRef((t, r) => {
    const { __scopeSelect: o, ...l } = t,
      c = Rs(o),
      u = Vr(Od, o),
      d = Ir(Od, o);
    return u.open && d.position === "popper"
      ? g.jsx(L0, { ...c, ...l, ref: r })
      : null;
  });
_D.displayName = Od;
var ED = "SelectBubbleInput",
  ix = y.forwardRef(({ __scopeSelect: t, value: r, ...o }, l) => {
    const c = y.useRef(null),
      u = Be(l, c),
      d = Kd(r);
    return (
      y.useEffect(() => {
        const h = c.current;
        if (!h) return;
        const p = window.HTMLSelectElement.prototype,
          v = Object.getOwnPropertyDescriptor(p, "value").set;
        if (d !== r && v) {
          const x = new Event("change", { bubbles: !0 });
          v.call(h, r), h.dispatchEvent(x);
        }
      }, [d, r]),
      g.jsx(De.select, {
        ...o,
        style: { ...U0, ...o.style },
        ref: u,
        defaultValue: r,
      })
    );
  });
ix.displayName = ED;
function cx(t) {
  return t === "" || t === void 0;
}
function sx(t) {
  const r = Zr(t),
    o = y.useRef(""),
    l = y.useRef(0),
    c = y.useCallback(
      (d) => {
        const h = o.current + d;
        r(h),
          (function p(m) {
            (o.current = m),
              window.clearTimeout(l.current),
              m !== "" && (l.current = window.setTimeout(() => p(""), 1e3));
          })(h);
      },
      [r]
    ),
    u = y.useCallback(() => {
      (o.current = ""), window.clearTimeout(l.current);
    }, []);
  return y.useEffect(() => () => window.clearTimeout(l.current), []), [o, c, u];
}
function ux(t, r, o) {
  const c = r.length > 1 && Array.from(r).every((m) => m === r[0]) ? r[0] : r,
    u = o ? t.indexOf(o) : -1;
  let d = CD(t, Math.max(u, 0));
  c.length === 1 && (d = d.filter((m) => m !== o));
  const p = d.find((m) =>
    m.textValue.toLowerCase().startsWith(c.toLowerCase())
  );
  return p !== o ? p : void 0;
}
function CD(t, r) {
  return t.map((o, l) => t[(r + l) % t.length]);
}
var RD = Z0,
  AD = $0,
  TD = Y0,
  ND = V0,
  OD = I0,
  DD = q0,
  jD = Q0,
  zD = ex,
  MD = tx,
  kD = rx,
  LD = ax,
  UD = ox;
function ts({ ...t }) {
  return g.jsx(RD, { "data-slot": "select", ...t });
}
function ns({ ...t }) {
  return g.jsx(TD, { "data-slot": "select-value", ...t });
}
function rs({ className: t, size: r = "default", children: o, ...l }) {
  return g.jsxs(AD, {
    "data-slot": "select-trigger",
    "data-size": r,
    className: lt(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-lg transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-10 data-[size=sm]:h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      t
    ),
    ...l,
    children: [
      o,
      g.jsx(ND, {
        asChild: !0,
        children: g.jsx(Cb, { className: "size-4 opacity-50" }),
      }),
    ],
  });
}
function as({ className: t, children: r, position: o = "popper", ...l }) {
  return g.jsx(OD, {
    children: g.jsxs(DD, {
      "data-slot": "select-content",
      className: lt(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border shadow-2xl",
        o === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        t
      ),
      position: o,
      ...l,
      children: [
        g.jsx(BD, {}),
        g.jsx(jD, {
          className: lt(
            "p-1",
            o === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          ),
          children: r,
        }),
        g.jsx(ZD, {}),
      ],
    }),
  });
}
function os({ className: t, children: r, ...o }) {
  return g.jsxs(zD, {
    "data-slot": "select-item",
    className: lt(
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      t
    ),
    ...o,
    children: [
      g.jsx("span", {
        className: "absolute right-2 flex size-3.5 items-center justify-center",
        children: g.jsx(kD, { children: g.jsx(Eb, { className: "size-4" }) }),
      }),
      g.jsx(MD, { children: r }),
    ],
  });
}
function BD({ className: t, ...r }) {
  return g.jsx(LD, {
    "data-slot": "select-scroll-up-button",
    className: lt("flex cursor-default items-center justify-center py-1", t),
    ...r,
    children: g.jsx(dA, { className: "size-4" }),
  });
}
function ZD({ className: t, ...r }) {
  return g.jsx(UD, {
    "data-slot": "select-scroll-down-button",
    className: lt("flex cursor-default items-center justify-center py-1", t),
    ...r,
    children: g.jsx(Cb, { className: "size-4" }),
  });
}
function HD({
  preferredPosition: t,
  setPreferredPosition: r,
  enablePositionsByRace: o,
  positionSelectionEnabled: l,
}) {
  return g.jsxs("div", {
    className: "flex flex-col gap-2",
    children: [
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Preferred Position",
      }),
      g.jsxs(ts, {
        disabled: !(l && !o),
        value: t,
        onValueChange: (c) => r(c),
        children: [
          g.jsx(rs, {
            className: "w-24",
            children: g.jsx(ns, { placeholder: "Position" }),
          }),
          g.jsx(as, {
            children: Ly.map((c) =>
              g.jsx(os, { value: c, children: c.toUpperCase() }, c)
            ),
          }),
        ],
      }),
    ],
  });
}
function $D({
  enablePositionsByRace: t,
  setPositionByRace: r,
  positionSelectionEnabled: o,
}) {
  return g.jsxs("label", {
    htmlFor: "position-by-race",
    className: "flex gap-2 items-center",
    children: [
      g.jsx(Do, {
        disabled: !o,
        id: "position-by-race",
        checked: t,
        onCheckedChange: () => r(!t),
      }),
      g.jsx("span", {
        className: "text-lg font-medium shrink-0",
        children: "Position By Race?",
      }),
    ],
  });
}
function GD({
  positionByRace: t,
  setPositionByRace: r,
  enablePositionsByRace: o,
  positionSelectionEnabled: l,
}) {
  return g.jsxs("div", {
    className: "flex flex-col gap-2",
    children: [
      g.jsx("p", {
        className: "text-lg font-medium",
        children: "Position By Race:",
      }),
      g.jsx("div", {
        className: "flex flex-col gap-2",
        children: Object.entries(t).map(([c, u]) =>
          g.jsxs(
            "label",
            {
              htmlFor: c,
              className: "flex gap-2 items-center w-44 justify-between",
              children: [
                g.jsx("span", { className: "capitalize", children: c }),
                g.jsxs(ts, {
                  disabled: !(o && l),
                  value: u,
                  onValueChange: (d) => r(c, d),
                  children: [
                    g.jsx(rs, {
                      className: "w-24",
                      children: g.jsx(ns, { placeholder: "Position" }),
                    }),
                    g.jsx(as, {
                      children: Ly.map((d) =>
                        g.jsx(os, { value: d, children: d.toUpperCase() }, d)
                      ),
                    }),
                  ],
                }),
              ],
            },
            c
          )
        ),
      }),
    ],
  });
}
function YD({ config: t, updateConfig: r }) {
  const {
    position_selection_enabled: o,
    preferred_position: l,
    enable_positions_by_race: c,
    positions_by_race: u,
  } = t;
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(zA, { className: "text-primary" }), "Race Style"],
      }),
      g.jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
        children: [
          g.jsxs("div", {
            className: "flex flex-col gap-6",
            children: [
              g.jsx(kN, {
                positionSelectionEnabled: o,
                setPositionSelectionEnabled: (d) =>
                  r("position_selection_enabled", d),
              }),
              g.jsx(HD, {
                preferredPosition: l,
                setPreferredPosition: (d) => r("preferred_position", d),
                enablePositionsByRace: c,
                positionSelectionEnabled: o,
              }),
            ],
          }),
          g.jsxs("div", {
            className: "flex flex-col gap-6",
            children: [
              g.jsx($D, {
                enablePositionsByRace: c,
                setPositionByRace: (d) => r("enable_positions_by_race", d),
                positionSelectionEnabled: o,
              }),
              g.jsx(GD, {
                positionByRace: u,
                setPositionByRace: (d, h) =>
                  r("positions_by_race", { ...u, [d]: h }),
                enablePositionsByRace: c,
                positionSelectionEnabled: o,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function VD() {
  for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++)
    r[o] = arguments[o];
  return y.useMemo(
    () => (l) => {
      r.forEach((c) => c(l));
    },
    r
  );
}
const As =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
function ko(t) {
  const r = Object.prototype.toString.call(t);
  return r === "[object Window]" || r === "[object global]";
}
function hh(t) {
  return "nodeType" in t;
}
function Yt(t) {
  var r, o;
  return t
    ? ko(t)
      ? t
      : hh(t) &&
        (r = (o = t.ownerDocument) == null ? void 0 : o.defaultView) != null
      ? r
      : window
    : window;
}
function mh(t) {
  const { Document: r } = Yt(t);
  return t instanceof r;
}
function ri(t) {
  return ko(t) ? !1 : t instanceof Yt(t).HTMLElement;
}
function fx(t) {
  return t instanceof Yt(t).SVGElement;
}
function Lo(t) {
  return t
    ? ko(t)
      ? t.document
      : hh(t)
      ? mh(t)
        ? t
        : ri(t) || fx(t)
        ? t.ownerDocument
        : document
      : document
    : document;
}
const Hn = As ? y.useLayoutEffect : y.useEffect;
function ph(t) {
  const r = y.useRef(t);
  return (
    Hn(() => {
      r.current = t;
    }),
    y.useCallback(function () {
      for (var o = arguments.length, l = new Array(o), c = 0; c < o; c++)
        l[c] = arguments[c];
      return r.current == null ? void 0 : r.current(...l);
    }, [])
  );
}
function ID() {
  const t = y.useRef(null),
    r = y.useCallback((l, c) => {
      t.current = setInterval(l, c);
    }, []),
    o = y.useCallback(() => {
      t.current !== null && (clearInterval(t.current), (t.current = null));
    }, []);
  return [r, o];
}
function Il(t, r) {
  r === void 0 && (r = [t]);
  const o = y.useRef(t);
  return (
    Hn(() => {
      o.current !== t && (o.current = t);
    }, r),
    o
  );
}
function ai(t, r) {
  const o = y.useRef();
  return y.useMemo(() => {
    const l = t(o.current);
    return (o.current = l), l;
  }, [...r]);
}
function ls(t) {
  const r = ph(t),
    o = y.useRef(null),
    l = y.useCallback((c) => {
      c !== o.current && r?.(c, o.current), (o.current = c);
    }, []);
  return [o, l];
}
function Dd(t) {
  const r = y.useRef();
  return (
    y.useEffect(() => {
      r.current = t;
    }, [t]),
    r.current
  );
}
let id = {};
function oi(t, r) {
  return y.useMemo(() => {
    if (r) return r;
    const o = id[t] == null ? 0 : id[t] + 1;
    return (id[t] = o), t + "-" + o;
  }, [t, r]);
}
function dx(t) {
  return function (r) {
    for (
      var o = arguments.length, l = new Array(o > 1 ? o - 1 : 0), c = 1;
      c < o;
      c++
    )
      l[c - 1] = arguments[c];
    return l.reduce(
      (u, d) => {
        const h = Object.entries(d);
        for (const [p, m] of h) {
          const v = u[p];
          v != null && (u[p] = v + t * m);
        }
        return u;
      },
      { ...r }
    );
  };
}
const Co = dx(1),
  is = dx(-1);
function qD(t) {
  return "clientX" in t && "clientY" in t;
}
function gh(t) {
  if (!t) return !1;
  const { KeyboardEvent: r } = Yt(t.target);
  return r && t instanceof r;
}
function PD(t) {
  if (!t) return !1;
  const { TouchEvent: r } = Yt(t.target);
  return r && t instanceof r;
}
function jd(t) {
  if (PD(t)) {
    if (t.touches && t.touches.length) {
      const { clientX: r, clientY: o } = t.touches[0];
      return { x: r, y: o };
    } else if (t.changedTouches && t.changedTouches.length) {
      const { clientX: r, clientY: o } = t.changedTouches[0];
      return { x: r, y: o };
    }
  }
  return qD(t) ? { x: t.clientX, y: t.clientY } : null;
}
const ql = Object.freeze({
    Translate: {
      toString(t) {
        if (!t) return;
        const { x: r, y: o } = t;
        return (
          "translate3d(" +
          (r ? Math.round(r) : 0) +
          "px, " +
          (o ? Math.round(o) : 0) +
          "px, 0)"
        );
      },
    },
    Scale: {
      toString(t) {
        if (!t) return;
        const { scaleX: r, scaleY: o } = t;
        return "scaleX(" + r + ") scaleY(" + o + ")";
      },
    },
    Transform: {
      toString(t) {
        if (t)
          return [ql.Translate.toString(t), ql.Scale.toString(t)].join(" ");
      },
    },
    Transition: {
      toString(t) {
        let { property: r, duration: o, easing: l } = t;
        return r + " " + o + "ms " + l;
      },
    },
  }),
  xy =
    "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
function XD(t) {
  return t.matches(xy) ? t : t.querySelector(xy);
}
const KD = { display: "none" };
function QD(t) {
  let { id: r, value: o } = t;
  return nt.createElement("div", { id: r, style: KD }, o);
}
function FD(t) {
  let { id: r, announcement: o, ariaLiveType: l = "assertive" } = t;
  const c = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(100%)",
    whiteSpace: "nowrap",
  };
  return nt.createElement(
    "div",
    { id: r, style: c, role: "status", "aria-live": l, "aria-atomic": !0 },
    o
  );
}
function JD() {
  const [t, r] = y.useState("");
  return {
    announce: y.useCallback((l) => {
      l != null && r(l);
    }, []),
    announcement: t,
  };
}
const hx = y.createContext(null);
function WD(t) {
  const r = y.useContext(hx);
  y.useEffect(() => {
    if (!r)
      throw new Error(
        "useDndMonitor must be used within a children of <DndContext>"
      );
    return r(t);
  }, [t, r]);
}
function ej() {
  const [t] = y.useState(() => new Set()),
    r = y.useCallback((l) => (t.add(l), () => t.delete(l)), [t]);
  return [
    y.useCallback(
      (l) => {
        let { type: c, event: u } = l;
        t.forEach((d) => {
          var h;
          return (h = d[c]) == null ? void 0 : h.call(d, u);
        });
      },
      [t]
    ),
    r,
  ];
}
const tj = {
    draggable: `
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
  },
  nj = {
    onDragStart(t) {
      let { active: r } = t;
      return "Picked up draggable item " + r.id + ".";
    },
    onDragOver(t) {
      let { active: r, over: o } = t;
      return o
        ? "Draggable item " +
            r.id +
            " was moved over droppable area " +
            o.id +
            "."
        : "Draggable item " + r.id + " is no longer over a droppable area.";
    },
    onDragEnd(t) {
      let { active: r, over: o } = t;
      return o
        ? "Draggable item " + r.id + " was dropped over droppable area " + o.id
        : "Draggable item " + r.id + " was dropped.";
    },
    onDragCancel(t) {
      let { active: r } = t;
      return "Dragging was cancelled. Draggable item " + r.id + " was dropped.";
    },
  };
function rj(t) {
  let {
    announcements: r = nj,
    container: o,
    hiddenTextDescribedById: l,
    screenReaderInstructions: c = tj,
  } = t;
  const { announce: u, announcement: d } = JD(),
    h = oi("DndLiveRegion"),
    [p, m] = y.useState(!1);
  if (
    (y.useEffect(() => {
      m(!0);
    }, []),
    WD(
      y.useMemo(
        () => ({
          onDragStart(x) {
            let { active: _ } = x;
            u(r.onDragStart({ active: _ }));
          },
          onDragMove(x) {
            let { active: _, over: E } = x;
            r.onDragMove && u(r.onDragMove({ active: _, over: E }));
          },
          onDragOver(x) {
            let { active: _, over: E } = x;
            u(r.onDragOver({ active: _, over: E }));
          },
          onDragEnd(x) {
            let { active: _, over: E } = x;
            u(r.onDragEnd({ active: _, over: E }));
          },
          onDragCancel(x) {
            let { active: _, over: E } = x;
            u(r.onDragCancel({ active: _, over: E }));
          },
        }),
        [u, r]
      )
    ),
    !p)
  )
    return null;
  const v = nt.createElement(
    nt.Fragment,
    null,
    nt.createElement(QD, { id: l, value: c.draggable }),
    nt.createElement(FD, { id: h, announcement: d })
  );
  return o ? Ln.createPortal(v, o) : v;
}
var vt;
(function (t) {
  (t.DragStart = "dragStart"),
    (t.DragMove = "dragMove"),
    (t.DragEnd = "dragEnd"),
    (t.DragCancel = "dragCancel"),
    (t.DragOver = "dragOver"),
    (t.RegisterDroppable = "registerDroppable"),
    (t.SetDroppableDisabled = "setDroppableDisabled"),
    (t.UnregisterDroppable = "unregisterDroppable");
})(vt || (vt = {}));
function cs() {}
function aj(t, r) {
  return y.useMemo(() => ({ sensor: t, options: {} }), [t, r]);
}
function oj() {
  for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++)
    r[o] = arguments[o];
  return y.useMemo(() => [...r].filter((l) => l != null), [...r]);
}
const Rn = Object.freeze({ x: 0, y: 0 });
function lj(t, r) {
  return Math.sqrt(Math.pow(t.x - r.x, 2) + Math.pow(t.y - r.y, 2));
}
function ij(t, r) {
  let {
      data: { value: o },
    } = t,
    {
      data: { value: l },
    } = r;
  return o - l;
}
function cj(t, r) {
  let {
      data: { value: o },
    } = t,
    {
      data: { value: l },
    } = r;
  return l - o;
}
function sj(t, r) {
  if (!t || t.length === 0) return null;
  const [o] = t;
  return o[r];
}
function Sy(t, r, o) {
  return (
    r === void 0 && (r = t.left),
    o === void 0 && (o = t.top),
    { x: r + t.width * 0.5, y: o + t.height * 0.5 }
  );
}
const uj = (t) => {
  let { collisionRect: r, droppableRects: o, droppableContainers: l } = t;
  const c = Sy(r, r.left, r.top),
    u = [];
  for (const d of l) {
    const { id: h } = d,
      p = o.get(h);
    if (p) {
      const m = lj(Sy(p), c);
      u.push({ id: h, data: { droppableContainer: d, value: m } });
    }
  }
  return u.sort(ij);
};
function fj(t, r) {
  const o = Math.max(r.top, t.top),
    l = Math.max(r.left, t.left),
    c = Math.min(r.left + r.width, t.left + t.width),
    u = Math.min(r.top + r.height, t.top + t.height),
    d = c - l,
    h = u - o;
  if (l < c && o < u) {
    const p = r.width * r.height,
      m = t.width * t.height,
      v = d * h,
      x = v / (p + m - v);
    return Number(x.toFixed(4));
  }
  return 0;
}
const dj = (t) => {
  let { collisionRect: r, droppableRects: o, droppableContainers: l } = t;
  const c = [];
  for (const u of l) {
    const { id: d } = u,
      h = o.get(d);
    if (h) {
      const p = fj(h, r);
      p > 0 && c.push({ id: d, data: { droppableContainer: u, value: p } });
    }
  }
  return c.sort(cj);
};
function hj(t, r, o) {
  return {
    ...t,
    scaleX: r && o ? r.width / o.width : 1,
    scaleY: r && o ? r.height / o.height : 1,
  };
}
function mx(t, r) {
  return t && r ? { x: t.left - r.left, y: t.top - r.top } : Rn;
}
function mj(t) {
  return function (o) {
    for (
      var l = arguments.length, c = new Array(l > 1 ? l - 1 : 0), u = 1;
      u < l;
      u++
    )
      c[u - 1] = arguments[u];
    return c.reduce(
      (d, h) => ({
        ...d,
        top: d.top + t * h.y,
        bottom: d.bottom + t * h.y,
        left: d.left + t * h.x,
        right: d.right + t * h.x,
      }),
      { ...o }
    );
  };
}
const pj = mj(1);
function gj(t) {
  if (t.startsWith("matrix3d(")) {
    const r = t.slice(9, -1).split(/, /);
    return { x: +r[12], y: +r[13], scaleX: +r[0], scaleY: +r[5] };
  } else if (t.startsWith("matrix(")) {
    const r = t.slice(7, -1).split(/, /);
    return { x: +r[4], y: +r[5], scaleX: +r[0], scaleY: +r[3] };
  }
  return null;
}
function vj(t, r, o) {
  const l = gj(r);
  if (!l) return t;
  const { scaleX: c, scaleY: u, x: d, y: h } = l,
    p = t.left - d - (1 - c) * parseFloat(o),
    m = t.top - h - (1 - u) * parseFloat(o.slice(o.indexOf(" ") + 1)),
    v = c ? t.width / c : t.width,
    x = u ? t.height / u : t.height;
  return { width: v, height: x, top: m, right: p + v, bottom: m + x, left: p };
}
const yj = { ignoreTransform: !1 };
function Uo(t, r) {
  r === void 0 && (r = yj);
  let o = t.getBoundingClientRect();
  if (r.ignoreTransform) {
    const { transform: m, transformOrigin: v } = Yt(t).getComputedStyle(t);
    m && (o = vj(o, m, v));
  }
  const { top: l, left: c, width: u, height: d, bottom: h, right: p } = o;
  return { top: l, left: c, width: u, height: d, bottom: h, right: p };
}
function wy(t) {
  return Uo(t, { ignoreTransform: !0 });
}
function bj(t) {
  const r = t.innerWidth,
    o = t.innerHeight;
  return { top: 0, left: 0, right: r, bottom: o, width: r, height: o };
}
function xj(t, r) {
  return (
    r === void 0 && (r = Yt(t).getComputedStyle(t)), r.position === "fixed"
  );
}
function Sj(t, r) {
  r === void 0 && (r = Yt(t).getComputedStyle(t));
  const o = /(auto|scroll|overlay)/;
  return ["overflow", "overflowX", "overflowY"].some((c) => {
    const u = r[c];
    return typeof u == "string" ? o.test(u) : !1;
  });
}
function vh(t, r) {
  const o = [];
  function l(c) {
    if ((r != null && o.length >= r) || !c) return o;
    if (mh(c) && c.scrollingElement != null && !o.includes(c.scrollingElement))
      return o.push(c.scrollingElement), o;
    if (!ri(c) || fx(c) || o.includes(c)) return o;
    const u = Yt(t).getComputedStyle(c);
    return c !== t && Sj(c, u) && o.push(c), xj(c, u) ? o : l(c.parentNode);
  }
  return t ? l(t) : o;
}
function px(t) {
  const [r] = vh(t, 1);
  return r ?? null;
}
function cd(t) {
  return !As || !t
    ? null
    : ko(t)
    ? t
    : hh(t)
    ? mh(t) || t === Lo(t).scrollingElement
      ? window
      : ri(t)
      ? t
      : null
    : null;
}
function gx(t) {
  return ko(t) ? t.scrollX : t.scrollLeft;
}
function vx(t) {
  return ko(t) ? t.scrollY : t.scrollTop;
}
function zd(t) {
  return { x: gx(t), y: vx(t) };
}
var wt;
(function (t) {
  (t[(t.Forward = 1)] = "Forward"), (t[(t.Backward = -1)] = "Backward");
})(wt || (wt = {}));
function yx(t) {
  return !As || !t ? !1 : t === document.scrollingElement;
}
function bx(t) {
  const r = { x: 0, y: 0 },
    o = yx(t)
      ? { height: window.innerHeight, width: window.innerWidth }
      : { height: t.clientHeight, width: t.clientWidth },
    l = { x: t.scrollWidth - o.width, y: t.scrollHeight - o.height },
    c = t.scrollTop <= r.y,
    u = t.scrollLeft <= r.x,
    d = t.scrollTop >= l.y,
    h = t.scrollLeft >= l.x;
  return {
    isTop: c,
    isLeft: u,
    isBottom: d,
    isRight: h,
    maxScroll: l,
    minScroll: r,
  };
}
const wj = { x: 0.2, y: 0.2 };
function _j(t, r, o, l, c) {
  let { top: u, left: d, right: h, bottom: p } = o;
  l === void 0 && (l = 10), c === void 0 && (c = wj);
  const { isTop: m, isBottom: v, isLeft: x, isRight: _ } = bx(t),
    E = { x: 0, y: 0 },
    R = { x: 0, y: 0 },
    w = { height: r.height * c.y, width: r.width * c.x };
  return (
    !m && u <= r.top + w.height
      ? ((E.y = wt.Backward),
        (R.y = l * Math.abs((r.top + w.height - u) / w.height)))
      : !v &&
        p >= r.bottom - w.height &&
        ((E.y = wt.Forward),
        (R.y = l * Math.abs((r.bottom - w.height - p) / w.height))),
    !_ && h >= r.right - w.width
      ? ((E.x = wt.Forward),
        (R.x = l * Math.abs((r.right - w.width - h) / w.width)))
      : !x &&
        d <= r.left + w.width &&
        ((E.x = wt.Backward),
        (R.x = l * Math.abs((r.left + w.width - d) / w.width))),
    { direction: E, speed: R }
  );
}
function Ej(t) {
  if (t === document.scrollingElement) {
    const { innerWidth: u, innerHeight: d } = window;
    return { top: 0, left: 0, right: u, bottom: d, width: u, height: d };
  }
  const { top: r, left: o, right: l, bottom: c } = t.getBoundingClientRect();
  return {
    top: r,
    left: o,
    right: l,
    bottom: c,
    width: t.clientWidth,
    height: t.clientHeight,
  };
}
function xx(t) {
  return t.reduce((r, o) => Co(r, zd(o)), Rn);
}
function Cj(t) {
  return t.reduce((r, o) => r + gx(o), 0);
}
function Rj(t) {
  return t.reduce((r, o) => r + vx(o), 0);
}
function Aj(t, r) {
  if ((r === void 0 && (r = Uo), !t)) return;
  const { top: o, left: l, bottom: c, right: u } = r(t);
  px(t) &&
    (c <= 0 || u <= 0 || o >= window.innerHeight || l >= window.innerWidth) &&
    t.scrollIntoView({ block: "center", inline: "center" });
}
const Tj = [
  ["x", ["left", "right"], Cj],
  ["y", ["top", "bottom"], Rj],
];
class yh {
  constructor(r, o) {
    (this.rect = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.right = void 0),
      (this.left = void 0);
    const l = vh(o),
      c = xx(l);
    (this.rect = { ...r }), (this.width = r.width), (this.height = r.height);
    for (const [u, d, h] of Tj)
      for (const p of d)
        Object.defineProperty(this, p, {
          get: () => {
            const m = h(l),
              v = c[u] - m;
            return this.rect[p] + v;
          },
          enumerable: !0,
        });
    Object.defineProperty(this, "rect", { enumerable: !1 });
  }
}
class Bl {
  constructor(r) {
    (this.target = void 0),
      (this.listeners = []),
      (this.removeAll = () => {
        this.listeners.forEach((o) => {
          var l;
          return (l = this.target) == null
            ? void 0
            : l.removeEventListener(...o);
        });
      }),
      (this.target = r);
  }
  add(r, o, l) {
    var c;
    (c = this.target) == null || c.addEventListener(r, o, l),
      this.listeners.push([r, o, l]);
  }
}
function Nj(t) {
  const { EventTarget: r } = Yt(t);
  return t instanceof r ? t : Lo(t);
}
function sd(t, r) {
  const o = Math.abs(t.x),
    l = Math.abs(t.y);
  return typeof r == "number"
    ? Math.sqrt(o ** 2 + l ** 2) > r
    : "x" in r && "y" in r
    ? o > r.x && l > r.y
    : "x" in r
    ? o > r.x
    : "y" in r
    ? l > r.y
    : !1;
}
var mn;
(function (t) {
  (t.Click = "click"),
    (t.DragStart = "dragstart"),
    (t.Keydown = "keydown"),
    (t.ContextMenu = "contextmenu"),
    (t.Resize = "resize"),
    (t.SelectionChange = "selectionchange"),
    (t.VisibilityChange = "visibilitychange");
})(mn || (mn = {}));
function _y(t) {
  t.preventDefault();
}
function Oj(t) {
  t.stopPropagation();
}
var ke;
(function (t) {
  (t.Space = "Space"),
    (t.Down = "ArrowDown"),
    (t.Right = "ArrowRight"),
    (t.Left = "ArrowLeft"),
    (t.Up = "ArrowUp"),
    (t.Esc = "Escape"),
    (t.Enter = "Enter"),
    (t.Tab = "Tab");
})(ke || (ke = {}));
const Sx = {
    start: [ke.Space, ke.Enter],
    cancel: [ke.Esc],
    end: [ke.Space, ke.Enter, ke.Tab],
  },
  Dj = (t, r) => {
    let { currentCoordinates: o } = r;
    switch (t.code) {
      case ke.Right:
        return { ...o, x: o.x + 25 };
      case ke.Left:
        return { ...o, x: o.x - 25 };
      case ke.Down:
        return { ...o, y: o.y + 25 };
      case ke.Up:
        return { ...o, y: o.y - 25 };
    }
  };
class wx {
  constructor(r) {
    (this.props = void 0),
      (this.autoScrollEnabled = !1),
      (this.referenceCoordinates = void 0),
      (this.listeners = void 0),
      (this.windowListeners = void 0),
      (this.props = r);
    const {
      event: { target: o },
    } = r;
    (this.props = r),
      (this.listeners = new Bl(Lo(o))),
      (this.windowListeners = new Bl(Yt(o))),
      (this.handleKeyDown = this.handleKeyDown.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      this.attach();
  }
  attach() {
    this.handleStart(),
      this.windowListeners.add(mn.Resize, this.handleCancel),
      this.windowListeners.add(mn.VisibilityChange, this.handleCancel),
      setTimeout(() => this.listeners.add(mn.Keydown, this.handleKeyDown));
  }
  handleStart() {
    const { activeNode: r, onStart: o } = this.props,
      l = r.node.current;
    l && Aj(l), o(Rn);
  }
  handleKeyDown(r) {
    if (gh(r)) {
      const { active: o, context: l, options: c } = this.props,
        {
          keyboardCodes: u = Sx,
          coordinateGetter: d = Dj,
          scrollBehavior: h = "smooth",
        } = c,
        { code: p } = r;
      if (u.end.includes(p)) {
        this.handleEnd(r);
        return;
      }
      if (u.cancel.includes(p)) {
        this.handleCancel(r);
        return;
      }
      const { collisionRect: m } = l.current,
        v = m ? { x: m.left, y: m.top } : Rn;
      this.referenceCoordinates || (this.referenceCoordinates = v);
      const x = d(r, { active: o, context: l.current, currentCoordinates: v });
      if (x) {
        const _ = is(x, v),
          E = { x: 0, y: 0 },
          { scrollableAncestors: R } = l.current;
        for (const w of R) {
          const C = r.code,
            {
              isTop: O,
              isRight: D,
              isLeft: j,
              isBottom: B,
              maxScroll: L,
              minScroll: F,
            } = bx(w),
            Y = Ej(w),
            G = {
              x: Math.min(
                C === ke.Right ? Y.right - Y.width / 2 : Y.right,
                Math.max(C === ke.Right ? Y.left : Y.left + Y.width / 2, x.x)
              ),
              y: Math.min(
                C === ke.Down ? Y.bottom - Y.height / 2 : Y.bottom,
                Math.max(C === ke.Down ? Y.top : Y.top + Y.height / 2, x.y)
              ),
            },
            te = (C === ke.Right && !D) || (C === ke.Left && !j),
            se = (C === ke.Down && !B) || (C === ke.Up && !O);
          if (te && G.x !== x.x) {
            const re = w.scrollLeft + _.x,
              ue =
                (C === ke.Right && re <= L.x) || (C === ke.Left && re >= F.x);
            if (ue && !_.y) {
              w.scrollTo({ left: re, behavior: h });
              return;
            }
            ue
              ? (E.x = w.scrollLeft - re)
              : (E.x =
                  C === ke.Right ? w.scrollLeft - L.x : w.scrollLeft - F.x),
              E.x && w.scrollBy({ left: -E.x, behavior: h });
            break;
          } else if (se && G.y !== x.y) {
            const re = w.scrollTop + _.y,
              ue = (C === ke.Down && re <= L.y) || (C === ke.Up && re >= F.y);
            if (ue && !_.x) {
              w.scrollTo({ top: re, behavior: h });
              return;
            }
            ue
              ? (E.y = w.scrollTop - re)
              : (E.y = C === ke.Down ? w.scrollTop - L.y : w.scrollTop - F.y),
              E.y && w.scrollBy({ top: -E.y, behavior: h });
            break;
          }
        }
        this.handleMove(r, Co(is(x, this.referenceCoordinates), E));
      }
    }
  }
  handleMove(r, o) {
    const { onMove: l } = this.props;
    r.preventDefault(), l(o);
  }
  handleEnd(r) {
    const { onEnd: o } = this.props;
    r.preventDefault(), this.detach(), o();
  }
  handleCancel(r) {
    const { onCancel: o } = this.props;
    r.preventDefault(), this.detach(), o();
  }
  detach() {
    this.listeners.removeAll(), this.windowListeners.removeAll();
  }
}
wx.activators = [
  {
    eventName: "onKeyDown",
    handler: (t, r, o) => {
      let { keyboardCodes: l = Sx, onActivation: c } = r,
        { active: u } = o;
      const { code: d } = t.nativeEvent;
      if (l.start.includes(d)) {
        const h = u.activatorNode.current;
        return h && t.target !== h
          ? !1
          : (t.preventDefault(), c?.({ event: t.nativeEvent }), !0);
      }
      return !1;
    },
  },
];
function Ey(t) {
  return !!(t && "distance" in t);
}
function Cy(t) {
  return !!(t && "delay" in t);
}
class bh {
  constructor(r, o, l) {
    var c;
    l === void 0 && (l = Nj(r.event.target)),
      (this.props = void 0),
      (this.events = void 0),
      (this.autoScrollEnabled = !0),
      (this.document = void 0),
      (this.activated = !1),
      (this.initialCoordinates = void 0),
      (this.timeoutId = null),
      (this.listeners = void 0),
      (this.documentListeners = void 0),
      (this.windowListeners = void 0),
      (this.props = r),
      (this.events = o);
    const { event: u } = r,
      { target: d } = u;
    (this.props = r),
      (this.events = o),
      (this.document = Lo(d)),
      (this.documentListeners = new Bl(this.document)),
      (this.listeners = new Bl(l)),
      (this.windowListeners = new Bl(Yt(d))),
      (this.initialCoordinates = (c = jd(u)) != null ? c : Rn),
      (this.handleStart = this.handleStart.bind(this)),
      (this.handleMove = this.handleMove.bind(this)),
      (this.handleEnd = this.handleEnd.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      (this.handleKeydown = this.handleKeydown.bind(this)),
      (this.removeTextSelection = this.removeTextSelection.bind(this)),
      this.attach();
  }
  attach() {
    const {
      events: r,
      props: {
        options: { activationConstraint: o, bypassActivationConstraint: l },
      },
    } = this;
    if (
      (this.listeners.add(r.move.name, this.handleMove, { passive: !1 }),
      this.listeners.add(r.end.name, this.handleEnd),
      r.cancel && this.listeners.add(r.cancel.name, this.handleCancel),
      this.windowListeners.add(mn.Resize, this.handleCancel),
      this.windowListeners.add(mn.DragStart, _y),
      this.windowListeners.add(mn.VisibilityChange, this.handleCancel),
      this.windowListeners.add(mn.ContextMenu, _y),
      this.documentListeners.add(mn.Keydown, this.handleKeydown),
      o)
    ) {
      if (
        l != null &&
        l({
          event: this.props.event,
          activeNode: this.props.activeNode,
          options: this.props.options,
        })
      )
        return this.handleStart();
      if (Cy(o)) {
        (this.timeoutId = setTimeout(this.handleStart, o.delay)),
          this.handlePending(o);
        return;
      }
      if (Ey(o)) {
        this.handlePending(o);
        return;
      }
    }
    this.handleStart();
  }
  detach() {
    this.listeners.removeAll(),
      this.windowListeners.removeAll(),
      setTimeout(this.documentListeners.removeAll, 50),
      this.timeoutId !== null &&
        (clearTimeout(this.timeoutId), (this.timeoutId = null));
  }
  handlePending(r, o) {
    const { active: l, onPending: c } = this.props;
    c(l, r, this.initialCoordinates, o);
  }
  handleStart() {
    const { initialCoordinates: r } = this,
      { onStart: o } = this.props;
    r &&
      ((this.activated = !0),
      this.documentListeners.add(mn.Click, Oj, { capture: !0 }),
      this.removeTextSelection(),
      this.documentListeners.add(mn.SelectionChange, this.removeTextSelection),
      o(r));
  }
  handleMove(r) {
    var o;
    const { activated: l, initialCoordinates: c, props: u } = this,
      {
        onMove: d,
        options: { activationConstraint: h },
      } = u;
    if (!c) return;
    const p = (o = jd(r)) != null ? o : Rn,
      m = is(c, p);
    if (!l && h) {
      if (Ey(h)) {
        if (h.tolerance != null && sd(m, h.tolerance))
          return this.handleCancel();
        if (sd(m, h.distance)) return this.handleStart();
      }
      if (Cy(h) && sd(m, h.tolerance)) return this.handleCancel();
      this.handlePending(h, m);
      return;
    }
    r.cancelable && r.preventDefault(), d(p);
  }
  handleEnd() {
    const { onAbort: r, onEnd: o } = this.props;
    this.detach(), this.activated || r(this.props.active), o();
  }
  handleCancel() {
    const { onAbort: r, onCancel: o } = this.props;
    this.detach(), this.activated || r(this.props.active), o();
  }
  handleKeydown(r) {
    r.code === ke.Esc && this.handleCancel();
  }
  removeTextSelection() {
    var r;
    (r = this.document.getSelection()) == null || r.removeAllRanges();
  }
}
const jj = {
  cancel: { name: "pointercancel" },
  move: { name: "pointermove" },
  end: { name: "pointerup" },
};
class xh extends bh {
  constructor(r) {
    const { event: o } = r,
      l = Lo(o.target);
    super(r, jj, l);
  }
}
xh.activators = [
  {
    eventName: "onPointerDown",
    handler: (t, r) => {
      let { nativeEvent: o } = t,
        { onActivation: l } = r;
      return !o.isPrimary || o.button !== 0 ? !1 : (l?.({ event: o }), !0);
    },
  },
];
const zj = { move: { name: "mousemove" }, end: { name: "mouseup" } };
var Md;
(function (t) {
  t[(t.RightClick = 2)] = "RightClick";
})(Md || (Md = {}));
class Mj extends bh {
  constructor(r) {
    super(r, zj, Lo(r.event.target));
  }
}
Mj.activators = [
  {
    eventName: "onMouseDown",
    handler: (t, r) => {
      let { nativeEvent: o } = t,
        { onActivation: l } = r;
      return o.button === Md.RightClick ? !1 : (l?.({ event: o }), !0);
    },
  },
];
const ud = {
  cancel: { name: "touchcancel" },
  move: { name: "touchmove" },
  end: { name: "touchend" },
};
class kj extends bh {
  constructor(r) {
    super(r, ud);
  }
  static setup() {
    return (
      window.addEventListener(ud.move.name, r, { capture: !1, passive: !1 }),
      function () {
        window.removeEventListener(ud.move.name, r);
      }
    );
    function r() {}
  }
}
kj.activators = [
  {
    eventName: "onTouchStart",
    handler: (t, r) => {
      let { nativeEvent: o } = t,
        { onActivation: l } = r;
      const { touches: c } = o;
      return c.length > 1 ? !1 : (l?.({ event: o }), !0);
    },
  },
];
var Zl;
(function (t) {
  (t[(t.Pointer = 0)] = "Pointer"),
    (t[(t.DraggableRect = 1)] = "DraggableRect");
})(Zl || (Zl = {}));
var ss;
(function (t) {
  (t[(t.TreeOrder = 0)] = "TreeOrder"),
    (t[(t.ReversedTreeOrder = 1)] = "ReversedTreeOrder");
})(ss || (ss = {}));
function Lj(t) {
  let {
    acceleration: r,
    activator: o = Zl.Pointer,
    canScroll: l,
    draggingRect: c,
    enabled: u,
    interval: d = 5,
    order: h = ss.TreeOrder,
    pointerCoordinates: p,
    scrollableAncestors: m,
    scrollableAncestorRects: v,
    delta: x,
    threshold: _,
  } = t;
  const E = Bj({ delta: x, disabled: !u }),
    [R, w] = ID(),
    C = y.useRef({ x: 0, y: 0 }),
    O = y.useRef({ x: 0, y: 0 }),
    D = y.useMemo(() => {
      switch (o) {
        case Zl.Pointer:
          return p ? { top: p.y, bottom: p.y, left: p.x, right: p.x } : null;
        case Zl.DraggableRect:
          return c;
      }
    }, [o, c, p]),
    j = y.useRef(null),
    B = y.useCallback(() => {
      const F = j.current;
      if (!F) return;
      const Y = C.current.x * O.current.x,
        G = C.current.y * O.current.y;
      F.scrollBy(Y, G);
    }, []),
    L = y.useMemo(() => (h === ss.TreeOrder ? [...m].reverse() : m), [h, m]);
  y.useEffect(() => {
    if (!u || !m.length || !D) {
      w();
      return;
    }
    for (const F of L) {
      if (l?.(F) === !1) continue;
      const Y = m.indexOf(F),
        G = v[Y];
      if (!G) continue;
      const { direction: te, speed: se } = _j(F, G, D, r, _);
      for (const re of ["x", "y"])
        E[re][te[re]] || ((se[re] = 0), (te[re] = 0));
      if (se.x > 0 || se.y > 0) {
        w(), (j.current = F), R(B, d), (C.current = se), (O.current = te);
        return;
      }
    }
    (C.current = { x: 0, y: 0 }), (O.current = { x: 0, y: 0 }), w();
  }, [
    r,
    B,
    l,
    w,
    u,
    d,
    JSON.stringify(D),
    JSON.stringify(E),
    R,
    m,
    L,
    v,
    JSON.stringify(_),
  ]);
}
const Uj = {
  x: { [wt.Backward]: !1, [wt.Forward]: !1 },
  y: { [wt.Backward]: !1, [wt.Forward]: !1 },
};
function Bj(t) {
  let { delta: r, disabled: o } = t;
  const l = Dd(r);
  return ai(
    (c) => {
      if (o || !l || !c) return Uj;
      const u = { x: Math.sign(r.x - l.x), y: Math.sign(r.y - l.y) };
      return {
        x: {
          [wt.Backward]: c.x[wt.Backward] || u.x === -1,
          [wt.Forward]: c.x[wt.Forward] || u.x === 1,
        },
        y: {
          [wt.Backward]: c.y[wt.Backward] || u.y === -1,
          [wt.Forward]: c.y[wt.Forward] || u.y === 1,
        },
      };
    },
    [o, r, l]
  );
}
function Zj(t, r) {
  const o = r != null ? t.get(r) : void 0,
    l = o ? o.node.current : null;
  return ai(
    (c) => {
      var u;
      return r == null ? null : (u = l ?? c) != null ? u : null;
    },
    [l, r]
  );
}
function Hj(t, r) {
  return y.useMemo(
    () =>
      t.reduce((o, l) => {
        const { sensor: c } = l,
          u = c.activators.map((d) => ({
            eventName: d.eventName,
            handler: r(d.handler, l),
          }));
        return [...o, ...u];
      }, []),
    [t, r]
  );
}
var Pl;
(function (t) {
  (t[(t.Always = 0)] = "Always"),
    (t[(t.BeforeDragging = 1)] = "BeforeDragging"),
    (t[(t.WhileDragging = 2)] = "WhileDragging");
})(Pl || (Pl = {}));
var kd;
(function (t) {
  t.Optimized = "optimized";
})(kd || (kd = {}));
const Ry = new Map();
function $j(t, r) {
  let { dragging: o, dependencies: l, config: c } = r;
  const [u, d] = y.useState(null),
    { frequency: h, measure: p, strategy: m } = c,
    v = y.useRef(t),
    x = C(),
    _ = Il(x),
    E = y.useCallback(
      function (O) {
        O === void 0 && (O = []),
          !_.current &&
            d((D) =>
              D === null ? O : D.concat(O.filter((j) => !D.includes(j)))
            );
      },
      [_]
    ),
    R = y.useRef(null),
    w = ai(
      (O) => {
        if (x && !o) return Ry;
        if (!O || O === Ry || v.current !== t || u != null) {
          const D = new Map();
          for (let j of t) {
            if (!j) continue;
            if (u && u.length > 0 && !u.includes(j.id) && j.rect.current) {
              D.set(j.id, j.rect.current);
              continue;
            }
            const B = j.node.current,
              L = B ? new yh(p(B), B) : null;
            (j.rect.current = L), L && D.set(j.id, L);
          }
          return D;
        }
        return O;
      },
      [t, u, o, x, p]
    );
  return (
    y.useEffect(() => {
      v.current = t;
    }, [t]),
    y.useEffect(() => {
      x || E();
    }, [o, x]),
    y.useEffect(() => {
      u && u.length > 0 && d(null);
    }, [JSON.stringify(u)]),
    y.useEffect(() => {
      x ||
        typeof h != "number" ||
        R.current !== null ||
        (R.current = setTimeout(() => {
          E(), (R.current = null);
        }, h));
    }, [h, x, E, ...l]),
    {
      droppableRects: w,
      measureDroppableContainers: E,
      measuringScheduled: u != null,
    }
  );
  function C() {
    switch (m) {
      case Pl.Always:
        return !1;
      case Pl.BeforeDragging:
        return o;
      default:
        return !o;
    }
  }
}
function _x(t, r) {
  return ai(
    (o) => (t ? o || (typeof r == "function" ? r(t) : t) : null),
    [r, t]
  );
}
function Gj(t, r) {
  return _x(t, r);
}
function Yj(t) {
  let { callback: r, disabled: o } = t;
  const l = ph(r),
    c = y.useMemo(() => {
      if (o || typeof window > "u" || typeof window.MutationObserver > "u")
        return;
      const { MutationObserver: u } = window;
      return new u(l);
    }, [l, o]);
  return y.useEffect(() => () => c?.disconnect(), [c]), c;
}
function Ts(t) {
  let { callback: r, disabled: o } = t;
  const l = ph(r),
    c = y.useMemo(() => {
      if (o || typeof window > "u" || typeof window.ResizeObserver > "u")
        return;
      const { ResizeObserver: u } = window;
      return new u(l);
    }, [o]);
  return y.useEffect(() => () => c?.disconnect(), [c]), c;
}
function Vj(t) {
  return new yh(Uo(t), t);
}
function Ay(t, r, o) {
  r === void 0 && (r = Vj);
  const [l, c] = y.useState(null);
  function u() {
    c((p) => {
      if (!t) return null;
      if (t.isConnected === !1) {
        var m;
        return (m = p ?? o) != null ? m : null;
      }
      const v = r(t);
      return JSON.stringify(p) === JSON.stringify(v) ? p : v;
    });
  }
  const d = Yj({
      callback(p) {
        if (t)
          for (const m of p) {
            const { type: v, target: x } = m;
            if (
              v === "childList" &&
              x instanceof HTMLElement &&
              x.contains(t)
            ) {
              u();
              break;
            }
          }
      },
    }),
    h = Ts({ callback: u });
  return (
    Hn(() => {
      u(),
        t
          ? (h?.observe(t),
            d?.observe(document.body, { childList: !0, subtree: !0 }))
          : (h?.disconnect(), d?.disconnect());
    }, [t]),
    l
  );
}
function Ij(t) {
  const r = _x(t);
  return mx(t, r);
}
const Ty = [];
function qj(t) {
  const r = y.useRef(t),
    o = ai(
      (l) =>
        t
          ? l &&
            l !== Ty &&
            t &&
            r.current &&
            t.parentNode === r.current.parentNode
            ? l
            : vh(t)
          : Ty,
      [t]
    );
  return (
    y.useEffect(() => {
      r.current = t;
    }, [t]),
    o
  );
}
function Pj(t) {
  const [r, o] = y.useState(null),
    l = y.useRef(t),
    c = y.useCallback((u) => {
      const d = cd(u.target);
      d && o((h) => (h ? (h.set(d, zd(d)), new Map(h)) : null));
    }, []);
  return (
    y.useEffect(() => {
      const u = l.current;
      if (t !== u) {
        d(u);
        const h = t
          .map((p) => {
            const m = cd(p);
            return m
              ? (m.addEventListener("scroll", c, { passive: !0 }), [m, zd(m)])
              : null;
          })
          .filter((p) => p != null);
        o(h.length ? new Map(h) : null), (l.current = t);
      }
      return () => {
        d(t), d(u);
      };
      function d(h) {
        h.forEach((p) => {
          const m = cd(p);
          m?.removeEventListener("scroll", c);
        });
      }
    }, [c, t]),
    y.useMemo(
      () =>
        t.length
          ? r
            ? Array.from(r.values()).reduce((u, d) => Co(u, d), Rn)
            : xx(t)
          : Rn,
      [t, r]
    )
  );
}
function Ny(t, r) {
  r === void 0 && (r = []);
  const o = y.useRef(null);
  return (
    y.useEffect(() => {
      o.current = null;
    }, r),
    y.useEffect(() => {
      const l = t !== Rn;
      l && !o.current && (o.current = t), !l && o.current && (o.current = null);
    }, [t]),
    o.current ? is(t, o.current) : Rn
  );
}
function Xj(t) {
  y.useEffect(
    () => {
      if (!As) return;
      const r = t.map((o) => {
        let { sensor: l } = o;
        return l.setup == null ? void 0 : l.setup();
      });
      return () => {
        for (const o of r) o?.();
      };
    },
    t.map((r) => {
      let { sensor: o } = r;
      return o;
    })
  );
}
function Kj(t, r) {
  return y.useMemo(
    () =>
      t.reduce((o, l) => {
        let { eventName: c, handler: u } = l;
        return (
          (o[c] = (d) => {
            u(d, r);
          }),
          o
        );
      }, {}),
    [t, r]
  );
}
function Ex(t) {
  return y.useMemo(() => (t ? bj(t) : null), [t]);
}
const Oy = [];
function Qj(t, r) {
  r === void 0 && (r = Uo);
  const [o] = t,
    l = Ex(o ? Yt(o) : null),
    [c, u] = y.useState(Oy);
  function d() {
    u(() => (t.length ? t.map((p) => (yx(p) ? l : new yh(r(p), p))) : Oy));
  }
  const h = Ts({ callback: d });
  return (
    Hn(() => {
      h?.disconnect(), d(), t.forEach((p) => h?.observe(p));
    }, [t]),
    c
  );
}
function Fj(t) {
  if (!t) return null;
  if (t.children.length > 1) return t;
  const r = t.children[0];
  return ri(r) ? r : t;
}
function Jj(t) {
  let { measure: r } = t;
  const [o, l] = y.useState(null),
    c = y.useCallback(
      (m) => {
        for (const { target: v } of m)
          if (ri(v)) {
            l((x) => {
              const _ = r(v);
              return x ? { ...x, width: _.width, height: _.height } : _;
            });
            break;
          }
      },
      [r]
    ),
    u = Ts({ callback: c }),
    d = y.useCallback(
      (m) => {
        const v = Fj(m);
        u?.disconnect(), v && u?.observe(v), l(v ? r(v) : null);
      },
      [r, u]
    ),
    [h, p] = ls(d);
  return y.useMemo(() => ({ nodeRef: h, rect: o, setRef: p }), [o, h, p]);
}
const Wj = [
    { sensor: xh, options: {} },
    { sensor: wx, options: {} },
  ],
  ez = { current: {} },
  Ic = {
    draggable: { measure: wy },
    droppable: {
      measure: wy,
      strategy: Pl.WhileDragging,
      frequency: kd.Optimized,
    },
    dragOverlay: { measure: Uo },
  };
class Hl extends Map {
  get(r) {
    var o;
    return r != null && (o = super.get(r)) != null ? o : void 0;
  }
  toArray() {
    return Array.from(this.values());
  }
  getEnabled() {
    return this.toArray().filter((r) => {
      let { disabled: o } = r;
      return !o;
    });
  }
  getNodeFor(r) {
    var o, l;
    return (o = (l = this.get(r)) == null ? void 0 : l.node.current) != null
      ? o
      : void 0;
  }
}
const tz = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: new Map(),
    droppableRects: new Map(),
    droppableContainers: new Hl(),
    over: null,
    dragOverlay: { nodeRef: { current: null }, rect: null, setRef: cs },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measuringConfiguration: Ic,
    measureDroppableContainers: cs,
    windowRect: null,
    measuringScheduled: !1,
  },
  nz = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: { draggable: "" },
    dispatch: cs,
    draggableNodes: new Map(),
    over: null,
    measureDroppableContainers: cs,
  },
  Ns = y.createContext(nz),
  Cx = y.createContext(tz);
function rz() {
  return {
    draggable: {
      active: null,
      initialCoordinates: { x: 0, y: 0 },
      nodes: new Map(),
      translate: { x: 0, y: 0 },
    },
    droppable: { containers: new Hl() },
  };
}
function az(t, r) {
  switch (r.type) {
    case vt.DragStart:
      return {
        ...t,
        draggable: {
          ...t.draggable,
          initialCoordinates: r.initialCoordinates,
          active: r.active,
        },
      };
    case vt.DragMove:
      return t.draggable.active == null
        ? t
        : {
            ...t,
            draggable: {
              ...t.draggable,
              translate: {
                x: r.coordinates.x - t.draggable.initialCoordinates.x,
                y: r.coordinates.y - t.draggable.initialCoordinates.y,
              },
            },
          };
    case vt.DragEnd:
    case vt.DragCancel:
      return {
        ...t,
        draggable: {
          ...t.draggable,
          active: null,
          initialCoordinates: { x: 0, y: 0 },
          translate: { x: 0, y: 0 },
        },
      };
    case vt.RegisterDroppable: {
      const { element: o } = r,
        { id: l } = o,
        c = new Hl(t.droppable.containers);
      return (
        c.set(l, o), { ...t, droppable: { ...t.droppable, containers: c } }
      );
    }
    case vt.SetDroppableDisabled: {
      const { id: o, key: l, disabled: c } = r,
        u = t.droppable.containers.get(o);
      if (!u || l !== u.key) return t;
      const d = new Hl(t.droppable.containers);
      return (
        d.set(o, { ...u, disabled: c }),
        { ...t, droppable: { ...t.droppable, containers: d } }
      );
    }
    case vt.UnregisterDroppable: {
      const { id: o, key: l } = r,
        c = t.droppable.containers.get(o);
      if (!c || l !== c.key) return t;
      const u = new Hl(t.droppable.containers);
      return (
        u.delete(o), { ...t, droppable: { ...t.droppable, containers: u } }
      );
    }
    default:
      return t;
  }
}
function oz(t) {
  let { disabled: r } = t;
  const { active: o, activatorEvent: l, draggableNodes: c } = y.useContext(Ns),
    u = Dd(l),
    d = Dd(o?.id);
  return (
    y.useEffect(() => {
      if (!r && !l && u && d != null) {
        if (!gh(u) || document.activeElement === u.target) return;
        const h = c.get(d);
        if (!h) return;
        const { activatorNode: p, node: m } = h;
        if (!p.current && !m.current) return;
        requestAnimationFrame(() => {
          for (const v of [p.current, m.current]) {
            if (!v) continue;
            const x = XD(v);
            if (x) {
              x.focus();
              break;
            }
          }
        });
      }
    }, [l, r, c, d, u]),
    null
  );
}
function lz(t, r) {
  let { transform: o, ...l } = r;
  return t != null && t.length
    ? t.reduce((c, u) => u({ transform: c, ...l }), o)
    : o;
}
function iz(t) {
  return y.useMemo(
    () => ({
      draggable: { ...Ic.draggable, ...t?.draggable },
      droppable: { ...Ic.droppable, ...t?.droppable },
      dragOverlay: { ...Ic.dragOverlay, ...t?.dragOverlay },
    }),
    [t?.draggable, t?.droppable, t?.dragOverlay]
  );
}
function cz(t) {
  let { activeNode: r, measure: o, initialRect: l, config: c = !0 } = t;
  const u = y.useRef(!1),
    { x: d, y: h } = typeof c == "boolean" ? { x: c, y: c } : c;
  Hn(() => {
    if ((!d && !h) || !r) {
      u.current = !1;
      return;
    }
    if (u.current || !l) return;
    const m = r?.node.current;
    if (!m || m.isConnected === !1) return;
    const v = o(m),
      x = mx(v, l);
    if (
      (d || (x.x = 0),
      h || (x.y = 0),
      (u.current = !0),
      Math.abs(x.x) > 0 || Math.abs(x.y) > 0)
    ) {
      const _ = px(m);
      _ && _.scrollBy({ top: x.y, left: x.x });
    }
  }, [r, d, h, l, o]);
}
const Rx = y.createContext({ ...Rn, scaleX: 1, scaleY: 1 });
var Lr;
(function (t) {
  (t[(t.Uninitialized = 0)] = "Uninitialized"),
    (t[(t.Initializing = 1)] = "Initializing"),
    (t[(t.Initialized = 2)] = "Initialized");
})(Lr || (Lr = {}));
const sz = y.memo(function (r) {
    var o, l, c, u;
    let {
      id: d,
      accessibility: h,
      autoScroll: p = !0,
      children: m,
      sensors: v = Wj,
      collisionDetection: x = dj,
      measuring: _,
      modifiers: E,
      ...R
    } = r;
    const w = y.useReducer(az, void 0, rz),
      [C, O] = w,
      [D, j] = ej(),
      [B, L] = y.useState(Lr.Uninitialized),
      F = B === Lr.Initialized,
      {
        draggable: { active: Y, nodes: G, translate: te },
        droppable: { containers: se },
      } = C,
      re = Y != null ? G.get(Y) : null,
      ue = y.useRef({ initial: null, translated: null }),
      ge = y.useMemo(() => {
        var We;
        return Y != null
          ? { id: Y, data: (We = re?.data) != null ? We : ez, rect: ue }
          : null;
      }, [Y, re]),
      he = y.useRef(null),
      [me, z] = y.useState(null),
      [V, $] = y.useState(null),
      ae = Il(R, Object.values(R)),
      T = oi("DndDescribedBy", d),
      q = y.useMemo(() => se.getEnabled(), [se]),
      J = iz(_),
      {
        droppableRects: Q,
        measureDroppableContainers: ee,
        measuringScheduled: ye,
      } = $j(q, {
        dragging: F,
        dependencies: [te.x, te.y],
        config: J.droppable,
      }),
      ne = Zj(G, Y),
      W = y.useMemo(() => (V ? jd(V) : null), [V]),
      fe = Zo(),
      Ee = Gj(ne, J.draggable.measure);
    cz({
      activeNode: Y != null ? G.get(Y) : null,
      config: fe.layoutShiftCompensation,
      initialRect: Ee,
      measure: J.draggable.measure,
    });
    const ce = Ay(ne, J.draggable.measure, Ee),
      Ce = Ay(ne ? ne.parentElement : null),
      _e = y.useRef({
        activatorEvent: null,
        active: null,
        activeNode: ne,
        collisionRect: null,
        collisions: null,
        droppableRects: Q,
        draggableNodes: G,
        draggingNode: null,
        draggingNodeRect: null,
        droppableContainers: se,
        over: null,
        scrollableAncestors: [],
        scrollAdjustedTranslate: null,
      }),
      Qe = se.getNodeFor((o = _e.current.over) == null ? void 0 : o.id),
      rt = Jj({ measure: J.dragOverlay.measure }),
      nn = (l = rt.nodeRef.current) != null ? l : ne,
      rn = F ? ((c = rt.rect) != null ? c : ce) : null,
      _t = !!(rt.nodeRef.current && rt.rect),
      ci = Ij(_t ? null : ce),
      Ea = Ex(nn ? Yt(nn) : null),
      vn = qj(F ? Qe ?? ne : null),
      Gn = Qj(vn),
      Ca = lz(E, {
        transform: { x: te.x - ci.x, y: te.y - ci.y, scaleX: 1, scaleY: 1 },
        activatorEvent: V,
        active: ge,
        activeNodeRect: ce,
        containerNodeRect: Ce,
        draggingNodeRect: rn,
        over: _e.current.over,
        overlayNodeRect: rt.rect,
        scrollableAncestors: vn,
        scrollableAncestorRects: Gn,
        windowRect: Ea,
      }),
      Bo = W ? Co(W, te) : null,
      si = Pj(vn),
      zs = Ny(si),
      qr = Ny(si, [ce]),
      ct = Co(Ca, zs),
      kt = rn ? pj(rn, Ca) : null,
      ht =
        ge && kt
          ? x({
              active: ge,
              collisionRect: kt,
              droppableRects: Q,
              droppableContainers: q,
              pointerCoordinates: Bo,
            })
          : null,
      ui = sj(ht, "id"),
      [Tn, fi] = y.useState(null),
      Ra = _t ? Ca : Co(Ca, qr),
      Aa = hj(Ra, (u = Tn?.rect) != null ? u : null, ce),
      yn = y.useRef(null),
      Pr = y.useCallback(
        (We, Lt) => {
          let { sensor: Nt, options: bn } = Lt;
          if (he.current == null) return;
          const Ot = G.get(he.current);
          if (!Ot) return;
          const Et = We.nativeEvent,
            Vt = new Nt({
              active: he.current,
              activeNode: Ot,
              event: Et,
              options: bn,
              context: _e,
              onAbort(Ye) {
                if (!G.get(Ye)) return;
                const { onDragAbort: Pe } = ae.current,
                  Dt = { id: Ye };
                Pe?.(Dt), D({ type: "onDragAbort", event: Dt });
              },
              onPending(Ye, qe, Pe, Dt) {
                if (!G.get(Ye)) return;
                const { onDragPending: Kr } = ae.current,
                  Nn = {
                    id: Ye,
                    constraint: qe,
                    initialCoordinates: Pe,
                    offset: Dt,
                  };
                Kr?.(Nn), D({ type: "onDragPending", event: Nn });
              },
              onStart(Ye) {
                const qe = he.current;
                if (qe == null) return;
                const Pe = G.get(qe);
                if (!Pe) return;
                const { onDragStart: Dt } = ae.current,
                  Yn = {
                    activatorEvent: Et,
                    active: { id: qe, data: Pe.data, rect: ue },
                  };
                Ln.unstable_batchedUpdates(() => {
                  Dt?.(Yn),
                    L(Lr.Initializing),
                    O({
                      type: vt.DragStart,
                      initialCoordinates: Ye,
                      active: qe,
                    }),
                    D({ type: "onDragStart", event: Yn }),
                    z(yn.current),
                    $(Et);
                });
              },
              onMove(Ye) {
                O({ type: vt.DragMove, coordinates: Ye });
              },
              onEnd: ur(vt.DragEnd),
              onCancel: ur(vt.DragCancel),
            });
          yn.current = Vt;
          function ur(Ye) {
            return async function () {
              const {
                active: Pe,
                collisions: Dt,
                over: Yn,
                scrollAdjustedTranslate: Kr,
              } = _e.current;
              let Nn = null;
              if (Pe && Kr) {
                const { cancelDrop: fr } = ae.current;
                (Nn = {
                  activatorEvent: Et,
                  active: Pe,
                  collisions: Dt,
                  delta: Kr,
                  over: Yn,
                }),
                  Ye === vt.DragEnd &&
                    typeof fr == "function" &&
                    (await Promise.resolve(fr(Nn))) &&
                    (Ye = vt.DragCancel);
              }
              (he.current = null),
                Ln.unstable_batchedUpdates(() => {
                  O({ type: Ye }),
                    L(Lr.Uninitialized),
                    fi(null),
                    z(null),
                    $(null),
                    (yn.current = null);
                  const fr = Ye === vt.DragEnd ? "onDragEnd" : "onDragCancel";
                  if (Nn) {
                    const Vn = ae.current[fr];
                    Vn?.(Nn), D({ type: fr, event: Nn });
                  }
                });
            };
          }
        },
        [G]
      ),
      Xr = y.useCallback(
        (We, Lt) => (Nt, bn) => {
          const Ot = Nt.nativeEvent,
            Et = G.get(bn);
          if (he.current !== null || !Et || Ot.dndKit || Ot.defaultPrevented)
            return;
          const Vt = { active: Et };
          We(Nt, Lt.options, Vt) === !0 &&
            ((Ot.dndKit = { capturedBy: Lt.sensor }),
            (he.current = bn),
            Pr(Nt, Lt));
        },
        [G, Pr]
      ),
      di = Hj(v, Xr);
    Xj(v),
      Hn(() => {
        ce && B === Lr.Initializing && L(Lr.Initialized);
      }, [ce, B]),
      y.useEffect(() => {
        const { onDragMove: We } = ae.current,
          {
            active: Lt,
            activatorEvent: Nt,
            collisions: bn,
            over: Ot,
          } = _e.current;
        if (!Lt || !Nt) return;
        const Et = {
          active: Lt,
          activatorEvent: Nt,
          collisions: bn,
          delta: { x: ct.x, y: ct.y },
          over: Ot,
        };
        Ln.unstable_batchedUpdates(() => {
          We?.(Et), D({ type: "onDragMove", event: Et });
        });
      }, [ct.x, ct.y]),
      y.useEffect(() => {
        const {
          active: We,
          activatorEvent: Lt,
          collisions: Nt,
          droppableContainers: bn,
          scrollAdjustedTranslate: Ot,
        } = _e.current;
        if (!We || he.current == null || !Lt || !Ot) return;
        const { onDragOver: Et } = ae.current,
          Vt = bn.get(ui),
          ur =
            Vt && Vt.rect.current
              ? {
                  id: Vt.id,
                  rect: Vt.rect.current,
                  data: Vt.data,
                  disabled: Vt.disabled,
                }
              : null,
          Ye = {
            active: We,
            activatorEvent: Lt,
            collisions: Nt,
            delta: { x: Ot.x, y: Ot.y },
            over: ur,
          };
        Ln.unstable_batchedUpdates(() => {
          fi(ur), Et?.(Ye), D({ type: "onDragOver", event: Ye });
        });
      }, [ui]),
      Hn(() => {
        (_e.current = {
          activatorEvent: V,
          active: ge,
          activeNode: ne,
          collisionRect: kt,
          collisions: ht,
          droppableRects: Q,
          draggableNodes: G,
          draggingNode: nn,
          draggingNodeRect: rn,
          droppableContainers: se,
          over: Tn,
          scrollableAncestors: vn,
          scrollAdjustedTranslate: ct,
        }),
          (ue.current = { initial: rn, translated: kt });
      }, [ge, ne, ht, kt, G, nn, rn, Q, se, Tn, vn, ct]),
      Lj({
        ...fe,
        delta: te,
        draggingRect: kt,
        pointerCoordinates: Bo,
        scrollableAncestors: vn,
        scrollableAncestorRects: Gn,
      });
    const hi = y.useMemo(
        () => ({
          active: ge,
          activeNode: ne,
          activeNodeRect: ce,
          activatorEvent: V,
          collisions: ht,
          containerNodeRect: Ce,
          dragOverlay: rt,
          draggableNodes: G,
          droppableContainers: se,
          droppableRects: Q,
          over: Tn,
          measureDroppableContainers: ee,
          scrollableAncestors: vn,
          scrollableAncestorRects: Gn,
          measuringConfiguration: J,
          measuringScheduled: ye,
          windowRect: Ea,
        }),
        [ge, ne, ce, V, ht, Ce, rt, G, se, Q, Tn, ee, vn, Gn, J, ye, Ea]
      ),
      mi = y.useMemo(
        () => ({
          activatorEvent: V,
          activators: di,
          active: ge,
          activeNodeRect: ce,
          ariaDescribedById: { draggable: T },
          dispatch: O,
          draggableNodes: G,
          over: Tn,
          measureDroppableContainers: ee,
        }),
        [V, di, ge, ce, O, T, G, Tn, ee]
      );
    return nt.createElement(
      hx.Provider,
      { value: j },
      nt.createElement(
        Ns.Provider,
        { value: mi },
        nt.createElement(
          Cx.Provider,
          { value: hi },
          nt.createElement(Rx.Provider, { value: Aa }, m)
        ),
        nt.createElement(oz, { disabled: h?.restoreFocus === !1 })
      ),
      nt.createElement(rj, { ...h, hiddenTextDescribedById: T })
    );
    function Zo() {
      const We = me?.autoScrollEnabled === !1,
        Lt = typeof p == "object" ? p.enabled === !1 : p === !1,
        Nt = F && !We && !Lt;
      return typeof p == "object" ? { ...p, enabled: Nt } : { enabled: Nt };
    }
  }),
  uz = y.createContext(null),
  Dy = "button",
  fz = "Draggable";
function dz(t) {
  let { id: r, data: o, disabled: l = !1, attributes: c } = t;
  const u = oi(fz),
    {
      activators: d,
      activatorEvent: h,
      active: p,
      activeNodeRect: m,
      ariaDescribedById: v,
      draggableNodes: x,
      over: _,
    } = y.useContext(Ns),
    {
      role: E = Dy,
      roleDescription: R = "draggable",
      tabIndex: w = 0,
    } = c ?? {},
    C = p?.id === r,
    O = y.useContext(C ? Rx : uz),
    [D, j] = ls(),
    [B, L] = ls(),
    F = Kj(d, r),
    Y = Il(o);
  Hn(
    () => (
      x.set(r, { id: r, key: u, node: D, activatorNode: B, data: Y }),
      () => {
        const te = x.get(r);
        te && te.key === u && x.delete(r);
      }
    ),
    [x, r]
  );
  const G = y.useMemo(
    () => ({
      role: E,
      tabIndex: w,
      "aria-disabled": l,
      "aria-pressed": C && E === Dy ? !0 : void 0,
      "aria-roledescription": R,
      "aria-describedby": v.draggable,
    }),
    [l, E, w, C, R, v.draggable]
  );
  return {
    active: p,
    activatorEvent: h,
    activeNodeRect: m,
    attributes: G,
    isDragging: C,
    listeners: l ? void 0 : F,
    node: D,
    over: _,
    setNodeRef: j,
    setActivatorNodeRef: L,
    transform: O,
  };
}
function hz() {
  return y.useContext(Cx);
}
const mz = "Droppable",
  pz = { timeout: 25 };
function gz(t) {
  let { data: r, disabled: o = !1, id: l, resizeObserverConfig: c } = t;
  const u = oi(mz),
    {
      active: d,
      dispatch: h,
      over: p,
      measureDroppableContainers: m,
    } = y.useContext(Ns),
    v = y.useRef({ disabled: o }),
    x = y.useRef(!1),
    _ = y.useRef(null),
    E = y.useRef(null),
    { disabled: R, updateMeasurementsFor: w, timeout: C } = { ...pz, ...c },
    O = Il(w ?? l),
    D = y.useCallback(() => {
      if (!x.current) {
        x.current = !0;
        return;
      }
      E.current != null && clearTimeout(E.current),
        (E.current = setTimeout(() => {
          m(Array.isArray(O.current) ? O.current : [O.current]),
            (E.current = null);
        }, C));
    }, [C]),
    j = Ts({ callback: D, disabled: R || !d }),
    B = y.useCallback(
      (G, te) => {
        j && (te && (j.unobserve(te), (x.current = !1)), G && j.observe(G));
      },
      [j]
    ),
    [L, F] = ls(B),
    Y = Il(r);
  return (
    y.useEffect(() => {
      !j ||
        !L.current ||
        (j.disconnect(), (x.current = !1), j.observe(L.current));
    }, [L, j]),
    y.useEffect(
      () => (
        h({
          type: vt.RegisterDroppable,
          element: { id: l, key: u, disabled: o, node: L, rect: _, data: Y },
        }),
        () => h({ type: vt.UnregisterDroppable, key: u, id: l })
      ),
      [l]
    ),
    y.useEffect(() => {
      o !== v.current.disabled &&
        (h({ type: vt.SetDroppableDisabled, id: l, key: u, disabled: o }),
        (v.current.disabled = o));
    }, [l, u, o, h]),
    { active: d, rect: _, isOver: p?.id === l, node: L, over: p, setNodeRef: F }
  );
}
function Sh(t, r, o) {
  const l = t.slice();
  return l.splice(o < 0 ? l.length + o : o, 0, l.splice(r, 1)[0]), l;
}
function vz(t, r) {
  return t.reduce((o, l, c) => {
    const u = r.get(l);
    return u && (o[c] = u), o;
  }, Array(t.length));
}
function Uc(t) {
  return t !== null && t >= 0;
}
function yz(t, r) {
  if (t === r) return !0;
  if (t.length !== r.length) return !1;
  for (let o = 0; o < t.length; o++) if (t[o] !== r[o]) return !1;
  return !0;
}
function bz(t) {
  return typeof t == "boolean" ? { draggable: t, droppable: t } : t;
}
const Ax = (t) => {
    let { rects: r, activeIndex: o, overIndex: l, index: c } = t;
    const u = Sh(r, l, o),
      d = r[c],
      h = u[c];
    return !h || !d
      ? null
      : {
          x: h.left - d.left,
          y: h.top - d.top,
          scaleX: h.width / d.width,
          scaleY: h.height / d.height,
        };
  },
  Bc = { scaleX: 1, scaleY: 1 },
  xz = (t) => {
    var r;
    let {
      activeIndex: o,
      activeNodeRect: l,
      index: c,
      rects: u,
      overIndex: d,
    } = t;
    const h = (r = u[o]) != null ? r : l;
    if (!h) return null;
    if (c === o) {
      const m = u[d];
      return m
        ? {
            x: 0,
            y: o < d ? m.top + m.height - (h.top + h.height) : m.top - h.top,
            ...Bc,
          }
        : null;
    }
    const p = Sz(u, c, o);
    return c > o && c <= d
      ? { x: 0, y: -h.height - p, ...Bc }
      : c < o && c >= d
      ? { x: 0, y: h.height + p, ...Bc }
      : { x: 0, y: 0, ...Bc };
  };
function Sz(t, r, o) {
  const l = t[r],
    c = t[r - 1],
    u = t[r + 1];
  return l
    ? o < r
      ? c
        ? l.top - (c.top + c.height)
        : u
        ? u.top - (l.top + l.height)
        : 0
      : u
      ? u.top - (l.top + l.height)
      : c
      ? l.top - (c.top + c.height)
      : 0
    : 0;
}
const Tx = "Sortable",
  Nx = nt.createContext({
    activeIndex: -1,
    containerId: Tx,
    disableTransforms: !1,
    items: [],
    overIndex: -1,
    useDragOverlay: !1,
    sortedRects: [],
    strategy: Ax,
    disabled: { draggable: !1, droppable: !1 },
  });
function wz(t) {
  let { children: r, id: o, items: l, strategy: c = Ax, disabled: u = !1 } = t;
  const {
      active: d,
      dragOverlay: h,
      droppableRects: p,
      over: m,
      measureDroppableContainers: v,
    } = hz(),
    x = oi(Tx, o),
    _ = h.rect !== null,
    E = y.useMemo(
      () => l.map((F) => (typeof F == "object" && "id" in F ? F.id : F)),
      [l]
    ),
    R = d != null,
    w = d ? E.indexOf(d.id) : -1,
    C = m ? E.indexOf(m.id) : -1,
    O = y.useRef(E),
    D = !yz(E, O.current),
    j = (C !== -1 && w === -1) || D,
    B = bz(u);
  Hn(() => {
    D && R && v(E);
  }, [D, E, R, v]),
    y.useEffect(() => {
      O.current = E;
    }, [E]);
  const L = y.useMemo(
    () => ({
      activeIndex: w,
      containerId: x,
      disabled: B,
      disableTransforms: j,
      items: E,
      overIndex: C,
      useDragOverlay: _,
      sortedRects: vz(E, p),
      strategy: c,
    }),
    [w, x, B.draggable, B.droppable, j, E, C, p, _, c]
  );
  return nt.createElement(Nx.Provider, { value: L }, r);
}
const _z = (t) => {
    let { id: r, items: o, activeIndex: l, overIndex: c } = t;
    return Sh(o, l, c).indexOf(r);
  },
  Ez = (t) => {
    let {
      containerId: r,
      isSorting: o,
      wasDragging: l,
      index: c,
      items: u,
      newIndex: d,
      previousItems: h,
      previousContainerId: p,
      transition: m,
    } = t;
    return !m || !l || (h !== u && c === d) ? !1 : o ? !0 : d !== c && r === p;
  },
  Cz = { duration: 200, easing: "ease" },
  Ox = "transform",
  Rz = ql.Transition.toString({ property: Ox, duration: 0, easing: "linear" }),
  Az = { roleDescription: "sortable" };
function Tz(t) {
  let { disabled: r, index: o, node: l, rect: c } = t;
  const [u, d] = y.useState(null),
    h = y.useRef(o);
  return (
    Hn(() => {
      if (!r && o !== h.current && l.current) {
        const p = c.current;
        if (p) {
          const m = Uo(l.current, { ignoreTransform: !0 }),
            v = {
              x: p.left - m.left,
              y: p.top - m.top,
              scaleX: p.width / m.width,
              scaleY: p.height / m.height,
            };
          (v.x || v.y) && d(v);
        }
      }
      o !== h.current && (h.current = o);
    }, [r, o, l, c]),
    y.useEffect(() => {
      u && d(null);
    }, [u]),
    u
  );
}
function Nz(t) {
  let {
    animateLayoutChanges: r = Ez,
    attributes: o,
    disabled: l,
    data: c,
    getNewIndex: u = _z,
    id: d,
    strategy: h,
    resizeObserverConfig: p,
    transition: m = Cz,
  } = t;
  const {
      items: v,
      containerId: x,
      activeIndex: _,
      disabled: E,
      disableTransforms: R,
      sortedRects: w,
      overIndex: C,
      useDragOverlay: O,
      strategy: D,
    } = y.useContext(Nx),
    j = Oz(l, E),
    B = v.indexOf(d),
    L = y.useMemo(
      () => ({ sortable: { containerId: x, index: B, items: v }, ...c }),
      [x, c, B, v]
    ),
    F = y.useMemo(() => v.slice(v.indexOf(d)), [v, d]),
    {
      rect: Y,
      node: G,
      isOver: te,
      setNodeRef: se,
    } = gz({
      id: d,
      data: L,
      disabled: j.droppable,
      resizeObserverConfig: { updateMeasurementsFor: F, ...p },
    }),
    {
      active: re,
      activatorEvent: ue,
      activeNodeRect: ge,
      attributes: he,
      setNodeRef: me,
      listeners: z,
      isDragging: V,
      over: $,
      setActivatorNodeRef: ae,
      transform: T,
    } = dz({
      id: d,
      data: L,
      attributes: { ...Az, ...o },
      disabled: j.draggable,
    }),
    q = VD(se, me),
    J = !!re,
    Q = J && !R && Uc(_) && Uc(C),
    ee = !O && V,
    ye = ee && Q ? T : null,
    W = Q
      ? ye ??
        (h ?? D)({
          rects: w,
          activeNodeRect: ge,
          activeIndex: _,
          overIndex: C,
          index: B,
        })
      : null,
    fe =
      Uc(_) && Uc(C) ? u({ id: d, items: v, activeIndex: _, overIndex: C }) : B,
    Ee = re?.id,
    ce = y.useRef({ activeId: Ee, items: v, newIndex: fe, containerId: x }),
    Ce = v !== ce.current.items,
    _e = r({
      active: re,
      containerId: x,
      isDragging: V,
      isSorting: J,
      id: d,
      index: B,
      items: v,
      newIndex: ce.current.newIndex,
      previousItems: ce.current.items,
      previousContainerId: ce.current.containerId,
      transition: m,
      wasDragging: ce.current.activeId != null,
    }),
    Qe = Tz({ disabled: !_e, index: B, node: G, rect: Y });
  return (
    y.useEffect(() => {
      J && ce.current.newIndex !== fe && (ce.current.newIndex = fe),
        x !== ce.current.containerId && (ce.current.containerId = x),
        v !== ce.current.items && (ce.current.items = v);
    }, [J, fe, x, v]),
    y.useEffect(() => {
      if (Ee === ce.current.activeId) return;
      if (Ee != null && ce.current.activeId == null) {
        ce.current.activeId = Ee;
        return;
      }
      const nn = setTimeout(() => {
        ce.current.activeId = Ee;
      }, 50);
      return () => clearTimeout(nn);
    }, [Ee]),
    {
      active: re,
      activeIndex: _,
      attributes: he,
      data: L,
      rect: Y,
      index: B,
      newIndex: fe,
      items: v,
      isOver: te,
      isSorting: J,
      isDragging: V,
      listeners: z,
      node: G,
      overIndex: C,
      over: $,
      setNodeRef: q,
      setActivatorNodeRef: ae,
      setDroppableNodeRef: se,
      setDraggableNodeRef: me,
      transform: Qe ?? W,
      transition: rt(),
    }
  );
  function rt() {
    if (Qe || (Ce && ce.current.newIndex === B)) return Rz;
    if (!((ee && !gh(ue)) || !m) && (J || _e))
      return ql.Transition.toString({ ...m, property: Ox });
  }
}
function Oz(t, r) {
  var o, l;
  return typeof t == "boolean"
    ? { draggable: t, droppable: !1 }
    : {
        draggable: (o = t?.draggable) != null ? o : r.draggable,
        droppable: (l = t?.droppable) != null ? l : r.droppable,
      };
}
ke.Down, ke.Right, ke.Up, ke.Left;
function Dz({ id: t }) {
  const {
      attributes: r,
      listeners: o,
      setNodeRef: l,
      transform: c,
      transition: u,
    } = Nz({ id: t }),
    d = { transform: ql.Transform.toString(c), transition: u };
  return g.jsxs("li", {
    ref: l,
    style: d,
    ...r,
    ...o,
    className:
      "px-3 py-2 rounded-md cursor-grab flex gap-4 border-2 border-neutral-500",
    children: [g.jsx(CA, {}), t.toUpperCase()],
  });
}
function jz({ priorityStat: t, setPriorityStat: r }) {
  const o = oj(aj(xh)),
    l = (c) => {
      const { active: u, over: d } = c;
      if (u.id !== d?.id) {
        const h = t.indexOf(u.id),
          p = t.indexOf(d?.id);
        r(Sh(t, h, p));
      }
    };
  return g.jsxs("div", {
    className: "flex flex-col gap-2 w-fit",
    children: [
      g.jsx("p", {
        className: "text-lg font-medium",
        children: "Priority Stat",
      }),
      g.jsx(sz, {
        sensors: o,
        collisionDetection: uj,
        onDragEnd: l,
        children: g.jsx(wz, {
          items: t,
          strategy: xz,
          children: g.jsx("ul", {
            className: "flex flex-col gap-2 w-fit",
            children: t.map((c) => g.jsx(Dz, { id: c }, c)),
          }),
        }),
      }),
    ],
  });
}
function zz({ priorityWeights: t, setPriorityWeights: r }) {
  return g.jsxs("div", {
    className: "flex flex-col gap-2 w-fit",
    children: [
      g.jsx("p", {
        className: "text-lg font-medium",
        children: "Priority Weight Multiplier",
      }),
      g.jsx("div", {
        className: "flex flex-col gap-2",
        children: Array.from({ length: 5 }, (o, l) =>
          g.jsx(
            gn,
            {
              type: "number",
              step: 0.05,
              value: t[l],
              onChange: (c) => r(c.target.valueAsNumber, l),
            },
            l
          )
        ),
      }),
    ],
  });
}
var [Os, IM] = sr("Tooltip", [_s]),
  Ds = _s(),
  Dx = "TooltipProvider",
  Mz = 700,
  Ld = "tooltip.open",
  [kz, wh] = Os(Dx),
  jx = (t) => {
    const {
        __scopeTooltip: r,
        delayDuration: o = Mz,
        skipDelayDuration: l = 300,
        disableHoverableContent: c = !1,
        children: u,
      } = t,
      d = y.useRef(!0),
      h = y.useRef(!1),
      p = y.useRef(0);
    return (
      y.useEffect(() => {
        const m = p.current;
        return () => window.clearTimeout(m);
      }, []),
      g.jsx(kz, {
        scope: r,
        isOpenDelayedRef: d,
        delayDuration: o,
        onOpen: y.useCallback(() => {
          window.clearTimeout(p.current), (d.current = !1);
        }, []),
        onClose: y.useCallback(() => {
          window.clearTimeout(p.current),
            (p.current = window.setTimeout(() => (d.current = !0), l));
        }, [l]),
        isPointerInTransitRef: h,
        onPointerInTransitChange: y.useCallback((m) => {
          h.current = m;
        }, []),
        disableHoverableContent: c,
        children: u,
      })
    );
  };
jx.displayName = Dx;
var Xl = "Tooltip",
  [Lz, li] = Os(Xl),
  zx = (t) => {
    const {
        __scopeTooltip: r,
        children: o,
        open: l,
        defaultOpen: c,
        onOpenChange: u,
        disableHoverableContent: d,
        delayDuration: h,
      } = t,
      p = wh(Xl, t.__scopeTooltip),
      m = Ds(r),
      [v, x] = y.useState(null),
      _ = Br(),
      E = y.useRef(0),
      R = d ?? p.disableHoverableContent,
      w = h ?? p.delayDuration,
      C = y.useRef(!1),
      [O, D] = va({
        prop: l,
        defaultProp: c ?? !1,
        onChange: (Y) => {
          Y
            ? (p.onOpen(), document.dispatchEvent(new CustomEvent(Ld)))
            : p.onClose(),
            u?.(Y);
        },
        caller: Xl,
      }),
      j = y.useMemo(
        () => (O ? (C.current ? "delayed-open" : "instant-open") : "closed"),
        [O]
      ),
      B = y.useCallback(() => {
        window.clearTimeout(E.current),
          (E.current = 0),
          (C.current = !1),
          D(!0);
      }, [D]),
      L = y.useCallback(() => {
        window.clearTimeout(E.current), (E.current = 0), D(!1);
      }, [D]),
      F = y.useCallback(() => {
        window.clearTimeout(E.current),
          (E.current = window.setTimeout(() => {
            (C.current = !0), D(!0), (E.current = 0);
          }, w));
      }, [w, D]);
    return (
      y.useEffect(
        () => () => {
          E.current && (window.clearTimeout(E.current), (E.current = 0));
        },
        []
      ),
      g.jsx(z0, {
        ...m,
        children: g.jsx(Lz, {
          scope: r,
          contentId: _,
          open: O,
          stateAttribute: j,
          trigger: v,
          onTriggerChange: x,
          onTriggerEnter: y.useCallback(() => {
            p.isOpenDelayedRef.current ? F() : B();
          }, [p.isOpenDelayedRef, F, B]),
          onTriggerLeave: y.useCallback(() => {
            R ? L() : (window.clearTimeout(E.current), (E.current = 0));
          }, [L, R]),
          onOpen: B,
          onClose: L,
          disableHoverableContent: R,
          children: o,
        }),
      })
    );
  };
zx.displayName = Xl;
var Ud = "TooltipTrigger",
  Mx = y.forwardRef((t, r) => {
    const { __scopeTooltip: o, ...l } = t,
      c = li(Ud, o),
      u = wh(Ud, o),
      d = Ds(o),
      h = y.useRef(null),
      p = Be(r, h, c.onTriggerChange),
      m = y.useRef(!1),
      v = y.useRef(!1),
      x = y.useCallback(() => (m.current = !1), []);
    return (
      y.useEffect(
        () => () => document.removeEventListener("pointerup", x),
        [x]
      ),
      g.jsx(M0, {
        asChild: !0,
        ...d,
        children: g.jsx(De.button, {
          "aria-describedby": c.open ? c.contentId : void 0,
          "data-state": c.stateAttribute,
          ...l,
          ref: p,
          onPointerMove: Se(t.onPointerMove, (_) => {
            _.pointerType !== "touch" &&
              !v.current &&
              !u.isPointerInTransitRef.current &&
              (c.onTriggerEnter(), (v.current = !0));
          }),
          onPointerLeave: Se(t.onPointerLeave, () => {
            c.onTriggerLeave(), (v.current = !1);
          }),
          onPointerDown: Se(t.onPointerDown, () => {
            c.open && c.onClose(),
              (m.current = !0),
              document.addEventListener("pointerup", x, { once: !0 });
          }),
          onFocus: Se(t.onFocus, () => {
            m.current || c.onOpen();
          }),
          onBlur: Se(t.onBlur, c.onClose),
          onClick: Se(t.onClick, c.onClose),
        }),
      })
    );
  });
Mx.displayName = Ud;
var _h = "TooltipPortal",
  [Uz, Bz] = Os(_h, { forceMount: void 0 }),
  kx = (t) => {
    const { __scopeTooltip: r, forceMount: o, children: l, container: c } = t,
      u = li(_h, r);
    return g.jsx(Uz, {
      scope: r,
      forceMount: o,
      children: g.jsx(Yr, {
        present: o || u.open,
        children: g.jsx(gs, { asChild: !0, container: c, children: l }),
      }),
    });
  };
kx.displayName = _h;
var To = "TooltipContent",
  Lx = y.forwardRef((t, r) => {
    const o = Bz(To, t.__scopeTooltip),
      { forceMount: l = o.forceMount, side: c = "top", ...u } = t,
      d = li(To, t.__scopeTooltip);
    return g.jsx(Yr, {
      present: l || d.open,
      children: d.disableHoverableContent
        ? g.jsx(Ux, { side: c, ...u, ref: r })
        : g.jsx(Zz, { side: c, ...u, ref: r }),
    });
  }),
  Zz = y.forwardRef((t, r) => {
    const o = li(To, t.__scopeTooltip),
      l = wh(To, t.__scopeTooltip),
      c = y.useRef(null),
      u = Be(r, c),
      [d, h] = y.useState(null),
      { trigger: p, onClose: m } = o,
      v = c.current,
      { onPointerInTransitChange: x } = l,
      _ = y.useCallback(() => {
        h(null), x(!1);
      }, [x]),
      E = y.useCallback(
        (R, w) => {
          const C = R.currentTarget,
            O = { x: R.clientX, y: R.clientY },
            D = Yz(O, C.getBoundingClientRect()),
            j = Vz(O, D),
            B = Iz(w.getBoundingClientRect()),
            L = Pz([...j, ...B]);
          h(L), x(!0);
        },
        [x]
      );
    return (
      y.useEffect(() => () => _(), [_]),
      y.useEffect(() => {
        if (p && v) {
          const R = (C) => E(C, v),
            w = (C) => E(C, p);
          return (
            p.addEventListener("pointerleave", R),
            v.addEventListener("pointerleave", w),
            () => {
              p.removeEventListener("pointerleave", R),
                v.removeEventListener("pointerleave", w);
            }
          );
        }
      }, [p, v, E, _]),
      y.useEffect(() => {
        if (d) {
          const R = (w) => {
            const C = w.target,
              O = { x: w.clientX, y: w.clientY },
              D = p?.contains(C) || v?.contains(C),
              j = !qz(O, d);
            D ? _() : j && (_(), m());
          };
          return (
            document.addEventListener("pointermove", R),
            () => document.removeEventListener("pointermove", R)
          );
        }
      }, [p, v, d, m, _]),
      g.jsx(Ux, { ...t, ref: u })
    );
  }),
  [Hz, $z] = Os(Xl, { isInside: !1 }),
  Gz = mR("TooltipContent"),
  Ux = y.forwardRef((t, r) => {
    const {
        __scopeTooltip: o,
        children: l,
        "aria-label": c,
        onEscapeKeyDown: u,
        onPointerDownOutside: d,
        ...h
      } = t,
      p = li(To, o),
      m = Ds(o),
      { onClose: v } = p;
    return (
      y.useEffect(
        () => (
          document.addEventListener(Ld, v),
          () => document.removeEventListener(Ld, v)
        ),
        [v]
      ),
      y.useEffect(() => {
        if (p.trigger) {
          const x = (_) => {
            _.target?.contains(p.trigger) && v();
          };
          return (
            window.addEventListener("scroll", x, { capture: !0 }),
            () => window.removeEventListener("scroll", x, { capture: !0 })
          );
        }
      }, [p.trigger, v]),
      g.jsx(ps, {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: u,
        onPointerDownOutside: d,
        onFocusOutside: (x) => x.preventDefault(),
        onDismiss: v,
        children: g.jsxs(k0, {
          "data-state": p.stateAttribute,
          ...m,
          ...h,
          ref: r,
          style: {
            ...h.style,
            "--radix-tooltip-content-transform-origin":
              "var(--radix-popper-transform-origin)",
            "--radix-tooltip-content-available-width":
              "var(--radix-popper-available-width)",
            "--radix-tooltip-content-available-height":
              "var(--radix-popper-available-height)",
            "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-tooltip-trigger-height":
              "var(--radix-popper-anchor-height)",
          },
          children: [
            g.jsx(Gz, { children: l }),
            g.jsx(Hz, {
              scope: o,
              isInside: !0,
              children: g.jsx(nD, {
                id: p.contentId,
                role: "tooltip",
                children: c || l,
              }),
            }),
          ],
        }),
      })
    );
  });
Lx.displayName = To;
var Bx = "TooltipArrow",
  Zx = y.forwardRef((t, r) => {
    const { __scopeTooltip: o, ...l } = t,
      c = Ds(o);
    return $z(Bx, o).isInside ? null : g.jsx(L0, { ...c, ...l, ref: r });
  });
Zx.displayName = Bx;
function Yz(t, r) {
  const o = Math.abs(r.top - t.y),
    l = Math.abs(r.bottom - t.y),
    c = Math.abs(r.right - t.x),
    u = Math.abs(r.left - t.x);
  switch (Math.min(o, l, c, u)) {
    case u:
      return "left";
    case c:
      return "right";
    case o:
      return "top";
    case l:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Vz(t, r, o = 5) {
  const l = [];
  switch (r) {
    case "top":
      l.push({ x: t.x - o, y: t.y + o }, { x: t.x + o, y: t.y + o });
      break;
    case "bottom":
      l.push({ x: t.x - o, y: t.y - o }, { x: t.x + o, y: t.y - o });
      break;
    case "left":
      l.push({ x: t.x + o, y: t.y - o }, { x: t.x + o, y: t.y + o });
      break;
    case "right":
      l.push({ x: t.x - o, y: t.y - o }, { x: t.x - o, y: t.y + o });
      break;
  }
  return l;
}
function Iz(t) {
  const { top: r, right: o, bottom: l, left: c } = t;
  return [
    { x: c, y: r },
    { x: o, y: r },
    { x: o, y: l },
    { x: c, y: l },
  ];
}
function qz(t, r) {
  const { x: o, y: l } = t;
  let c = !1;
  for (let u = 0, d = r.length - 1; u < r.length; d = u++) {
    const h = r[u],
      p = r[d],
      m = h.x,
      v = h.y,
      x = p.x,
      _ = p.y;
    v > l != _ > l && o < ((x - m) * (l - v)) / (_ - v) + m && (c = !c);
  }
  return c;
}
function Pz(t) {
  const r = t.slice();
  return (
    r.sort((o, l) =>
      o.x < l.x ? -1 : o.x > l.x ? 1 : o.y < l.y ? -1 : o.y > l.y ? 1 : 0
    ),
    Xz(r)
  );
}
function Xz(t) {
  if (t.length <= 1) return t.slice();
  const r = [];
  for (let l = 0; l < t.length; l++) {
    const c = t[l];
    for (; r.length >= 2; ) {
      const u = r[r.length - 1],
        d = r[r.length - 2];
      if ((u.x - d.x) * (c.y - d.y) >= (u.y - d.y) * (c.x - d.x)) r.pop();
      else break;
    }
    r.push(c);
  }
  r.pop();
  const o = [];
  for (let l = t.length - 1; l >= 0; l--) {
    const c = t[l];
    for (; o.length >= 2; ) {
      const u = o[o.length - 1],
        d = o[o.length - 2];
      if ((u.x - d.x) * (c.y - d.y) >= (u.y - d.y) * (c.x - d.x)) o.pop();
      else break;
    }
    o.push(c);
  }
  return (
    o.pop(),
    r.length === 1 && o.length === 1 && r[0].x === o[0].x && r[0].y === o[0].y
      ? r
      : r.concat(o)
  );
}
var Kz = jx,
  Qz = zx,
  Fz = Mx,
  Jz = kx,
  Wz = Lx,
  eM = Zx;
function tM({ delayDuration: t = 0, ...r }) {
  return g.jsx(Kz, { "data-slot": "tooltip-provider", delayDuration: t, ...r });
}
function nM({ ...t }) {
  return g.jsx(tM, { children: g.jsx(Qz, { "data-slot": "tooltip", ...t }) });
}
function rM({ ...t }) {
  return g.jsx(Fz, { "data-slot": "tooltip-trigger", ...t });
}
function aM({ className: t, sideOffset: r = 0, children: o, ...l }) {
  return g.jsx(Jz, {
    children: g.jsxs(Wz, {
      "data-slot": "tooltip-content",
      sideOffset: r,
      className: lt(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance shadow-lg",
        t
      ),
      ...l,
      children: [
        o,
        g.jsx(eM, {
          className:
            "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
        }),
      ],
    }),
  });
}
function Hx({ children: t }) {
  return g.jsxs(nM, {
    children: [
      g.jsx(rM, { children: g.jsx(gA, { size: 20 }) }),
      g.jsx(aM, { children: t }),
    ],
  });
}
var fd = "rovingFocusGroup.onEntryFocus",
  oM = { bubbles: !1, cancelable: !0 },
  ii = "RovingFocusGroup",
  [Bd, $x, lM] = f0(ii),
  [iM, Gx] = sr(ii, [lM]),
  [cM, sM] = iM(ii),
  Yx = y.forwardRef((t, r) =>
    g.jsx(Bd.Provider, {
      scope: t.__scopeRovingFocusGroup,
      children: g.jsx(Bd.Slot, {
        scope: t.__scopeRovingFocusGroup,
        children: g.jsx(uM, { ...t, ref: r }),
      }),
    })
  );
Yx.displayName = ii;
var uM = y.forwardRef((t, r) => {
    const {
        __scopeRovingFocusGroup: o,
        orientation: l,
        loop: c = !1,
        dir: u,
        currentTabStopId: d,
        defaultCurrentTabStopId: h,
        onCurrentTabStopIdChange: p,
        onEntryFocus: m,
        preventScrollOnEntryFocus: v = !1,
        ...x
      } = t,
      _ = y.useRef(null),
      E = Be(r, _),
      R = rh(u),
      [w, C] = va({ prop: d, defaultProp: h ?? null, onChange: p, caller: ii }),
      [O, D] = y.useState(!1),
      j = Zr(m),
      B = $x(o),
      L = y.useRef(!1),
      [F, Y] = y.useState(0);
    return (
      y.useEffect(() => {
        const G = _.current;
        if (G)
          return G.addEventListener(fd, j), () => G.removeEventListener(fd, j);
      }, [j]),
      g.jsx(cM, {
        scope: o,
        orientation: l,
        dir: R,
        loop: c,
        currentTabStopId: w,
        onItemFocus: y.useCallback((G) => C(G), [C]),
        onItemShiftTab: y.useCallback(() => D(!0), []),
        onFocusableItemAdd: y.useCallback(() => Y((G) => G + 1), []),
        onFocusableItemRemove: y.useCallback(() => Y((G) => G - 1), []),
        children: g.jsx(De.div, {
          tabIndex: O || F === 0 ? -1 : 0,
          "data-orientation": l,
          ...x,
          ref: E,
          style: { outline: "none", ...t.style },
          onMouseDown: Se(t.onMouseDown, () => {
            L.current = !0;
          }),
          onFocus: Se(t.onFocus, (G) => {
            const te = !L.current;
            if (G.target === G.currentTarget && te && !O) {
              const se = new CustomEvent(fd, oM);
              if ((G.currentTarget.dispatchEvent(se), !se.defaultPrevented)) {
                const re = B().filter((z) => z.focusable),
                  ue = re.find((z) => z.active),
                  ge = re.find((z) => z.id === w),
                  me = [ue, ge, ...re]
                    .filter(Boolean)
                    .map((z) => z.ref.current);
                qx(me, v);
              }
            }
            L.current = !1;
          }),
          onBlur: Se(t.onBlur, () => D(!1)),
        }),
      })
    );
  }),
  Vx = "RovingFocusGroupItem",
  Ix = y.forwardRef((t, r) => {
    const {
        __scopeRovingFocusGroup: o,
        focusable: l = !0,
        active: c = !1,
        tabStopId: u,
        children: d,
        ...h
      } = t,
      p = Br(),
      m = u || p,
      v = sM(Vx, o),
      x = v.currentTabStopId === m,
      _ = $x(o),
      {
        onFocusableItemAdd: E,
        onFocusableItemRemove: R,
        currentTabStopId: w,
      } = v;
    return (
      y.useEffect(() => {
        if (l) return E(), () => R();
      }, [l, E, R]),
      g.jsx(Bd.ItemSlot, {
        scope: o,
        id: m,
        focusable: l,
        active: c,
        children: g.jsx(De.span, {
          tabIndex: x ? 0 : -1,
          "data-orientation": v.orientation,
          ...h,
          ref: r,
          onMouseDown: Se(t.onMouseDown, (C) => {
            l ? v.onItemFocus(m) : C.preventDefault();
          }),
          onFocus: Se(t.onFocus, () => v.onItemFocus(m)),
          onKeyDown: Se(t.onKeyDown, (C) => {
            if (C.key === "Tab" && C.shiftKey) {
              v.onItemShiftTab();
              return;
            }
            if (C.target !== C.currentTarget) return;
            const O = hM(C, v.orientation, v.dir);
            if (O !== void 0) {
              if (C.metaKey || C.ctrlKey || C.altKey || C.shiftKey) return;
              C.preventDefault();
              let j = _()
                .filter((B) => B.focusable)
                .map((B) => B.ref.current);
              if (O === "last") j.reverse();
              else if (O === "prev" || O === "next") {
                O === "prev" && j.reverse();
                const B = j.indexOf(C.currentTarget);
                j = v.loop ? mM(j, B + 1) : j.slice(B + 1);
              }
              setTimeout(() => qx(j));
            }
          }),
          children:
            typeof d == "function"
              ? d({ isCurrentTabStop: x, hasTabStop: w != null })
              : d,
        }),
      })
    );
  });
Ix.displayName = Vx;
var fM = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function dM(t, r) {
  return r !== "rtl"
    ? t
    : t === "ArrowLeft"
    ? "ArrowRight"
    : t === "ArrowRight"
    ? "ArrowLeft"
    : t;
}
function hM(t, r, o) {
  const l = dM(t.key, o);
  if (
    !(r === "vertical" && ["ArrowLeft", "ArrowRight"].includes(l)) &&
    !(r === "horizontal" && ["ArrowUp", "ArrowDown"].includes(l))
  )
    return fM[l];
}
function qx(t, r = !1) {
  const o = document.activeElement;
  for (const l of t)
    if (
      l === o ||
      (l.focus({ preventScroll: r }), document.activeElement !== o)
    )
      return;
}
function mM(t, r) {
  return t.map((o, l) => t[(r + l) % t.length]);
}
var pM = Yx,
  gM = Ix,
  Eh = "Radio",
  [vM, Px] = sr(Eh),
  [yM, bM] = vM(Eh),
  Xx = y.forwardRef((t, r) => {
    const {
        __scopeRadio: o,
        name: l,
        checked: c = !1,
        required: u,
        disabled: d,
        value: h = "on",
        onCheck: p,
        form: m,
        ...v
      } = t,
      [x, _] = y.useState(null),
      E = Be(r, (C) => _(C)),
      R = y.useRef(!1),
      w = x ? m || !!x.closest("form") : !0;
    return g.jsxs(yM, {
      scope: o,
      checked: c,
      disabled: d,
      children: [
        g.jsx(De.button, {
          type: "button",
          role: "radio",
          "aria-checked": c,
          "data-state": Jx(c),
          "data-disabled": d ? "" : void 0,
          disabled: d,
          value: h,
          ...v,
          ref: E,
          onClick: Se(t.onClick, (C) => {
            c || p?.(),
              w &&
                ((R.current = C.isPropagationStopped()),
                R.current || C.stopPropagation());
          }),
        }),
        w &&
          g.jsx(Fx, {
            control: x,
            bubbles: !R.current,
            name: l,
            value: h,
            checked: c,
            required: u,
            disabled: d,
            form: m,
            style: { transform: "translateX(-100%)" },
          }),
      ],
    });
  });
Xx.displayName = Eh;
var Kx = "RadioIndicator",
  Qx = y.forwardRef((t, r) => {
    const { __scopeRadio: o, forceMount: l, ...c } = t,
      u = bM(Kx, o);
    return g.jsx(Yr, {
      present: l || u.checked,
      children: g.jsx(De.span, {
        "data-state": Jx(u.checked),
        "data-disabled": u.disabled ? "" : void 0,
        ...c,
        ref: r,
      }),
    });
  });
Qx.displayName = Kx;
var xM = "RadioBubbleInput",
  Fx = y.forwardRef(
    ({ __scopeRadio: t, control: r, checked: o, bubbles: l = !0, ...c }, u) => {
      const d = y.useRef(null),
        h = Be(d, u),
        p = Kd(o),
        m = Qd(r);
      return (
        y.useEffect(() => {
          const v = d.current;
          if (!v) return;
          const x = window.HTMLInputElement.prototype,
            E = Object.getOwnPropertyDescriptor(x, "checked").set;
          if (p !== o && E) {
            const R = new Event("click", { bubbles: l });
            E.call(v, o), v.dispatchEvent(R);
          }
        }, [p, o, l]),
        g.jsx(De.input, {
          type: "radio",
          "aria-hidden": !0,
          defaultChecked: o,
          ...c,
          tabIndex: -1,
          ref: h,
          style: {
            ...c.style,
            ...m,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0,
          },
        })
      );
    }
  );
Fx.displayName = xM;
function Jx(t) {
  return t ? "checked" : "unchecked";
}
var SM = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  js = "RadioGroup",
  [wM, qM] = sr(js, [Gx, Px]),
  Wx = Gx(),
  e1 = Px(),
  [_M, EM] = wM(js),
  t1 = y.forwardRef((t, r) => {
    const {
        __scopeRadioGroup: o,
        name: l,
        defaultValue: c,
        value: u,
        required: d = !1,
        disabled: h = !1,
        orientation: p,
        dir: m,
        loop: v = !0,
        onValueChange: x,
        ..._
      } = t,
      E = Wx(o),
      R = rh(m),
      [w, C] = va({ prop: u, defaultProp: c ?? null, onChange: x, caller: js });
    return g.jsx(_M, {
      scope: o,
      name: l,
      required: d,
      disabled: h,
      value: w,
      onValueChange: C,
      children: g.jsx(pM, {
        asChild: !0,
        ...E,
        orientation: p,
        dir: R,
        loop: v,
        children: g.jsx(De.div, {
          role: "radiogroup",
          "aria-required": d,
          "aria-orientation": p,
          "data-disabled": h ? "" : void 0,
          dir: R,
          ..._,
          ref: r,
        }),
      }),
    });
  });
t1.displayName = js;
var n1 = "RadioGroupItem",
  r1 = y.forwardRef((t, r) => {
    const { __scopeRadioGroup: o, disabled: l, ...c } = t,
      u = EM(n1, o),
      d = u.disabled || l,
      h = Wx(o),
      p = e1(o),
      m = y.useRef(null),
      v = Be(r, m),
      x = u.value === c.value,
      _ = y.useRef(!1);
    return (
      y.useEffect(() => {
        const E = (w) => {
            SM.includes(w.key) && (_.current = !0);
          },
          R = () => (_.current = !1);
        return (
          document.addEventListener("keydown", E),
          document.addEventListener("keyup", R),
          () => {
            document.removeEventListener("keydown", E),
              document.removeEventListener("keyup", R);
          }
        );
      }, []),
      g.jsx(gM, {
        asChild: !0,
        ...h,
        focusable: !d,
        active: x,
        children: g.jsx(Xx, {
          disabled: d,
          required: u.required,
          checked: x,
          ...p,
          ...c,
          name: u.name,
          ref: v,
          onCheck: () => u.onValueChange(c.value),
          onKeyDown: Se((E) => {
            E.key === "Enter" && E.preventDefault();
          }),
          onFocus: Se(c.onFocus, () => {
            _.current && m.current?.click();
          }),
        }),
      })
    );
  });
r1.displayName = n1;
var CM = "RadioGroupIndicator",
  a1 = y.forwardRef((t, r) => {
    const { __scopeRadioGroup: o, ...l } = t,
      c = e1(o);
    return g.jsx(Qx, { ...c, ...l, ref: r });
  });
a1.displayName = CM;
var RM = t1,
  AM = r1,
  TM = a1;
function NM({ className: t, ...r }) {
  return g.jsx(RM, {
    "data-slot": "radio-group",
    className: lt("grid gap-3", t),
    ...r,
  });
}
function OM({ className: t, ...r }) {
  return g.jsx(AM, {
    "data-slot": "radio-group-item",
    className: lt(
      "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-lg transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      t
    ),
    ...r,
    children: g.jsx(TM, {
      "data-slot": "radio-group-indicator",
      className: "relative flex items-center justify-center",
      children: g.jsx(yA, {
        className:
          "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
      }),
    }),
  });
}
function DM({ priorityWeight: t, setPriorityWeight: r }) {
  return g.jsx("div", {
    className: "w-fit",
    children: g.jsxs("label", {
      htmlFor: "priority-weight",
      className: "flex flex-col gap-2",
      children: [
        g.jsx("span", {
          className: "text-lg font-medium",
          children: "Priority Weight Level",
        }),
        g.jsx(NM, {
          value: t,
          onValueChange: (o) => r(o),
          children: Object.entries(Pw).map(([o, l]) =>
            g.jsxs(
              "div",
              {
                className: "flex items-center gap-2",
                children: [
                  g.jsx(OM, { value: o, id: o }),
                  g.jsx("label", { htmlFor: o, children: o }),
                  g.jsx(Hx, { children: l }),
                ],
              },
              o
            )
          ),
        }),
      ],
    }),
  });
}
function jM({ maximumFailure: t, setFail: r }) {
  return g.jsxs("label", {
    htmlFor: "fail",
    className: "flex flex-col gap-2",
    children: [
      g.jsx("span", {
        className: "text-lg font-medium",
        children: "Max Failure Chance",
      }),
      g.jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          g.jsx(gn, {
            className: "w-24",
            type: "number",
            name: "fail",
            id: "fail",
            min: 0,
            value: t,
            onChange: (o) => r(o.target.valueAsNumber),
          }),
          g.jsx("span", { className: "text-muted-foreground", children: "%" }),
        ],
      }),
    ],
  });
}
function zM({ statCaps: t, setStatCaps: r }) {
  return g.jsxs("div", {
    className: "flex flex-col gap-2 w-fit",
    children: [
      g.jsx("p", { className: "text-lg font-medium", children: "Stat Caps" }),
      g.jsx("div", {
        className: "flex flex-col gap-2",
        children: Object.entries(t).map(([o, l]) =>
          g.jsxs(
            "label",
            {
              className: "flex items-center gap-4",
              children: [
                g.jsx("span", {
                  className: "inline-block w-16",
                  children: o.toUpperCase(),
                }),
                g.jsx(gn, {
                  type: "number",
                  value: l,
                  min: 0,
                  onChange: (c) => r(o, c.target.valueAsNumber),
                }),
              ],
            },
            o
          )
        ),
      }),
    ],
  });
}
function MM({ config: t, updateConfig: r }) {
  const {
    priority_stat: o,
    priority_weight: l,
    priority_weights: c,
    maximum_failure: u,
    stat_caps: d,
  } = t;
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(cA, { className: "text-primary" }), "Training"],
      }),
      g.jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
        children: [
          g.jsx(jz, {
            priorityStat: o,
            setPriorityStat: (h) => r("priority_stat", h),
          }),
          g.jsx(zz, {
            priorityWeights: c,
            setPriorityWeights: (h, p) => {
              const m = [...c];
              (m[p] = isNaN(h) ? 0 : h), r("priority_weights", m);
            },
          }),
          g.jsx(DM, {
            priorityWeight: l,
            setPriorityWeight: (h) => r("priority_weight", h),
          }),
          g.jsx(jM, {
            maximumFailure: u,
            setFail: (h) => r("maximum_failure", isNaN(h) ? 0 : h),
          }),
        ],
      }),
      g.jsx("div", {
        className: "mt-8",
        children: g.jsx(zM, {
          statCaps: d,
          setStatCaps: (h, p) =>
            r("stat_caps", { ...d, [h]: isNaN(p) ? 0 : p }),
        }),
      }),
    ],
  });
}
function kM({ windowName: t, setWindowName: r }) {
  return g.jsxs("label", {
    htmlFor: "window-name",
    className: "flex flex-col gap-2",
    children: [
      g.jsxs("div", {
        className: "flex gap-2 items-center",
        children: [
          g.jsx("span", {
            className: "text-lg font-medium",
            children: "Window Name",
          }),
          g.jsx(Hx, {
            children:
              "If you're using an emulator, set this to your emulator's window name (case-sensitive).",
          }),
        ],
      }),
      g.jsx(gn, {
        id: "window-name",
        className: "w-52",
        value: t,
        onChange: (o) => r(o.target.value),
      }),
    ],
  });
}
function LM({
  minimumMood: t,
  setMood: r,
  minimumMoodJunior: o,
  setMoodJunior: l,
}) {
  return g.jsxs("div", {
    className: "flex flex-col gap-4",
    children: [
      g.jsxs("div", {
        children: [
          g.jsx("span", {
            className: "text-lg font-medium",
            children: "Min Mood (Junior)",
          }),
          g.jsxs(ts, {
            name: "mood-junior",
            value: o,
            onValueChange: (c) => l(c),
            children: [
              g.jsx(rs, {
                className: "w-36 mt-2",
                children: g.jsx(ns, { placeholder: "Mood" }),
              }),
              g.jsx(as, {
                children: yv.map((c) =>
                  g.jsx(os, { value: c, children: c }, c)
                ),
              }),
            ],
          }),
        ],
      }),
      g.jsxs("div", {
        children: [
          g.jsx("span", {
            className: "text-lg font-medium",
            children: "Min Mood",
          }),
          g.jsxs(ts, {
            name: "mood",
            value: t,
            onValueChange: (c) => r(c),
            children: [
              g.jsx(rs, {
                className: "w-36 mt-2",
                children: g.jsx(ns, { placeholder: "Mood" }),
              }),
              g.jsx(as, {
                children: yv.map((c) =>
                  g.jsx(os, { value: c, children: c }, c)
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function dd({ name: t, value: r, setValue: o, children: l }) {
  return g.jsxs("label", {
    htmlFor: t,
    className: "flex flex-col gap-2",
    children: [
      g.jsx("span", { className: "text-lg font-medium shrink-0", children: l }),
      g.jsx(gn, {
        className: "w-24 shrink-0",
        type: "number",
        name: t,
        id: t,
        min: 0,
        value: r,
        onChange: (c) => o(Number(c.target.valueAsNumber)),
      }),
    ],
  });
}
function UM({ config: t, updateConfig: r }) {
  const {
    skip_training_energy: o,
    never_rest_energy: l,
    skip_infirmary_unless_missing_energy: c,
  } = t;
  return g.jsxs("div", {
    className: "flex flex-col gap-6",
    children: [
      g.jsx(dd, {
        name: "skip-training-energy",
        value: o,
        setValue: (u) => r("skip_training_energy", u),
        children: "Skip Training Energy",
      }),
      g.jsx(dd, {
        name: "never-rest-energy",
        value: l,
        setValue: (u) => r("never_rest_energy", u),
        children: "Never Rest Energy",
      }),
      g.jsx(dd, {
        name: "skip-infirmary-unless_missing-energy",
        value: c,
        setValue: (u) => r("skip_infirmary_unless_missing_energy", u),
        children: "Skip Infirmary",
      }),
    ],
  });
}
function BM({ sleepMultiplier: t, setSleepMultiplier: r }) {
  return g.jsxs("label", {
    htmlFor: "sleep-multiplier",
    className: "flex flex-col gap-2",
    children: [
      g.jsx("span", {
        className: "text-lg font-medium",
        children: "Sleep Time Multiplier",
      }),
      g.jsx(gn, {
        id: "sleep-multiplier",
        className: "w-24",
        step: 0.1,
        type: "number",
        value: t,
        onChange: (o) => r(o.target.valueAsNumber),
      }),
    ],
  });
}
function ZM({ config: t, updateConfig: r }) {
  const {
    window_name: o,
    minimum_mood: l,
    minimum_mood_junior_year: c,
    sleep_time_multiplier: u,
  } = t;
  return g.jsxs("div", {
    className: "bg-card p-6 rounded-xl shadow-lg border border-border/20",
    children: [
      g.jsxs("h2", {
        className: "text-3xl font-semibold mb-6 flex items-center gap-3",
        children: [g.jsx(xA, { className: "text-primary" }), "General"],
      }),
      g.jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
        children: [
          g.jsx(kM, {
            windowName: o,
            setWindowName: (d) => r("window_name", d),
          }),
          g.jsx(LM, {
            minimumMood: l,
            setMood: (d) => r("minimum_mood", d),
            minimumMoodJunior: c,
            setMoodJunior: (d) => r("minimum_mood_junior_year", d),
          }),
          g.jsx(UM, { config: t, updateConfig: r }),
          g.jsx(BM, {
            sleepMultiplier: u,
            setSleepMultiplier: (d) => r("sleep_time_multiplier", d),
          }),
        ],
      }),
    ],
  });
}
function HM() {
  const t = hd,
    {
      activeIndex: r,
      activeConfig: o,
      presets: l,
      setActiveIndex: c,
      savePreset: u,
      updatePreset: d,
    } = qw(),
    { config: h, setConfig: p, saveConfig: m } = Xw(o ?? t),
    {
      fileInputRef: v,
      openFileDialog: x,
      handleImport: _,
    } = dR({ activeIndex: r, updatePreset: d, savePreset: u });
  y.useEffect(() => {
    l[r] ? p(l[r].config ?? t) : p(t);
  }, [r, l, p]);
  const { config_name: E } = h,
    R = (w, C) => {
      p((O) => ({ ...O, [w]: C }));
    };
  return g.jsx("div", {
    className: "min-h-screen w-full bg-background text-foreground p-4 sm:p-8",
    children: g.jsxs("div", {
      className: "max-w-7xl mx-auto",
      children: [
        g.jsxs("header", {
          className:
            "p-5 flex items-center justify-between sticky top-0 bg-background z-10",
          children: [
            g.jsxs("div", {
              children: [
                g.jsx("h1", {
                  className: "text-5xl font-bold text-primary tracking-tight",
                  children: "Uma Auto Train",
                }),
                g.jsx("p", {
                  className: "text-muted-foreground mt-2 text-lg",
                  children: "Configure your auto-training settings below.",
                }),
              ],
            }),
            g.jsxs("div", {
              className: "flex flex-col items-end gap-4",
              children: [
                g.jsxs("div", {
                  className: "flex items-center gap-4",
                  children: [
                    g.jsxs("div", {
                      children: [
                        g.jsx(en, {
                          onClick: x,
                          size: "lg",
                          variant: "outline",
                          children: "Import Config",
                        }),
                        g.jsx("input", {
                          type: "file",
                          accept: ".json,application/json",
                          ref: v,
                          onChange: _,
                          className: "hidden",
                        }),
                      ],
                    }),
                    g.jsx(en, {
                      size: "lg",
                      className:
                        "font-semibold text-lg shadow-lg shadow-primary/20",
                      onClick: () => {
                        u(h), m();
                      },
                      children: "Save Configuration",
                    }),
                  ],
                }),
                g.jsxs("p", {
                  className: "text-muted-foreground",
                  children: [
                    "Press ",
                    g.jsx("span", {
                      className: "font-bold text-primary",
                      children: "F1",
                    }),
                    " to start/stop the bot.",
                  ],
                }),
              ],
            }),
          ],
        }),
        g.jsx("div", {
          className: "flex flex-wrap gap-4 mb-8",
          children: l.map((w, C) =>
            g.jsxs(
              en,
              {
                variant: C === r ? "default" : "outline",
                size: "sm",
                onClick: () => c(C),
                children: ["Preset ", C + 1],
              },
              w.name + C
            )
          ),
        }),
        g.jsx("div", {
          className: "mb-8",
          children: g.jsx(gn, {
            className:
              "w-full sm:w-72 bg-card border-2 border-primary/20 focus:border-primary/50",
            placeholder: "Preset Name",
            value: E,
            onChange: (w) => R("config_name", w.target.value),
          }),
        }),
        g.jsxs("div", {
          className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mx-2",
          children: [
            g.jsxs("div", {
              className: "lg:col-span-2 flex flex-col gap-8",
              children: [
                g.jsx(MM, { config: h, updateConfig: R }),
                g.jsx(ZM, { config: h, updateConfig: R }),
                g.jsx(YD, { config: h, updateConfig: R }),
              ],
            }),
            g.jsxs("div", {
              className: "flex flex-col gap-8",
              children: [
                g.jsx(MN, { config: h, updateConfig: R }),
                g.jsx(ON, { config: h, updateConfig: R }),
                g.jsx(RN, { config: h, updateConfig: R }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
ww.createRoot(document.getElementById("root")).render(
  g.jsx(y.StrictMode, { children: g.jsx(HM, {}) })
);
