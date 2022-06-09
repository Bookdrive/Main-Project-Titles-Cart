var M = (r, s) => () => (s || r((s = { exports: {} }).exports, s), s.exports);
var A = M((k, w) => {
    const E = function () {
        const s = document.createElement("link").relList;
        if (s && s.supports && s.supports("modulepreload")) return;
        for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
            o(e);
        new MutationObserver((e) => {
            for (const t of e)
                if (t.type === "childList")
                    for (const i of t.addedNodes)
                        i.tagName === "LINK" && i.rel === "modulepreload" && o(i);
        }).observe(document, { childList: !0, subtree: !0 });
        function l(e) {
            const t = {};
            return (
                e.integrity && (t.integrity = e.integrity),
                e.referrerpolicy && (t.referrerPolicy = e.referrerpolicy),
                e.crossorigin === "use-credentials"
                    ? (t.credentials = "include")
                    : e.crossorigin === "anonymous"
                        ? (t.credentials = "omit")
                        : (t.credentials = "same-origin"),
                t
            );
        }
        function o(e) {
            if (e.ep) return;
            e.ep = !0;
            const t = l(e);
            fetch(e.href, t);
        }
    };
    E();
    (function (r) {
        typeof define == "function" && define.amd
            ? define(r)
            : typeof k == "object"
                ? (w.exports = r())
                : r();
    })(function () {
        var r = typeof window != "undefined" ? window : this,
            s = (r.Glider = function (o, e) {
                var t = this;
                if (o._glider) return o._glider;
                if (
                    ((t.ele = o),
                        t.ele.classList.add("glider"),
                        ((t.ele._glider = t).opt = Object.assign(
                            {},
                            {
                                slidesToScroll: 1,
                                slidesToShow: 1,
                                resizeLock: !0,
                                duration: 0.5,
                                easing: function (i, a, c, n, d) {
                                    return n * (a /= d) * a + c;
                                },
                            },
                            e
                        )),
                        (t.animate_id = t.page = t.slide = 0),
                        (t.arrows = {}),
                        (t._opt = t.opt),
                        t.opt.skipTrack)
                )
                    t.track = t.ele.children[0];
                else
                    for (
                        t.track = document.createElement("div"), t.ele.appendChild(t.track);
                        t.ele.children.length !== 1;

                    )
                        t.track.appendChild(t.ele.children[0]);
                t.track.classList.add("glider-track"),
                    t.init(),
                    (t.resize = t.init.bind(t, !0)),
                    t.event(t.ele, "add", { scroll: t.updateControls.bind(t) }),
                    t.event(r, "add", { resize: t.resize });
            }),
            l = s.prototype;
        return (
            (l.init = function (o, e) {
                var t = this,
                    i = 0,
                    a = 0;
                (t.slides = t.track.children),
                    [].forEach.call(t.slides, function (d, h) {
                        d.classList.add("glider-slide"), d.setAttribute("data-gslide", h);
                    }),
                    (t.containerWidth = t.ele.clientWidth);
                var c = t.settingsBreakpoint();
                if (
                    (e || (e = c),
                        t.opt.slidesToShow === "auto" || t.opt._autoSlide !== void 0)
                ) {
                    var n = t.containerWidth / t.opt.itemWidth;
                    t.opt._autoSlide = t.opt.slidesToShow = t.opt.exactWidth
                        ? n
                        : Math.max(1, Math.floor(n));
                }
                t.opt.slidesToScroll === "auto" &&
                    (t.opt.slidesToScroll = Math.floor(t.opt.slidesToShow)),
                    (t.itemWidth = t.opt.exactWidth
                        ? t.opt.itemWidth
                        : t.containerWidth / t.opt.slidesToShow),
                    [].forEach.call(t.slides, function (d) {
                        (d.style.height = "auto"),
                            (d.style.width = t.itemWidth + "px"),
                            (i += t.itemWidth),
                            (a = Math.max(d.offsetHeight, a));
                    }),
                    (t.track.style.width = i + "px"),
                    (t.trackWidth = i),
                    (t.isDrag = !1),
                    (t.preventClick = !1),
                    t.opt.resizeLock && t.scrollTo(t.slide * t.itemWidth, 0),
                    (c || e) && (t.bindArrows(), t.buildDots(), t.bindDrag()),
                    t.updateControls(),
                    t.emit(o ? "refresh" : "loaded");
            }),
            (l.bindDrag = function () {
                var o = this;
                o.mouse = o.mouse || o.handleMouse.bind(o);
                var e = function () {
                    (o.mouseDown = void 0),
                        o.ele.classList.remove("drag"),
                        o.isDrag && (o.preventClick = !0),
                        (o.isDrag = !1);
                },
                    t = {
                        mouseup: e,
                        mouseleave: e,
                        mousedown: function (i) {
                            i.preventDefault(),
                                i.stopPropagation(),
                                (o.mouseDown = i.clientX),
                                o.ele.classList.add("drag");
                        },
                        mousemove: o.mouse,
                        click: function (i) {
                            o.preventClick && (i.preventDefault(), i.stopPropagation()),
                                (o.preventClick = !1);
                        },
                    };
                o.ele.classList.toggle("draggable", o.opt.draggable === !0),
                    o.event(o.ele, "remove", t),
                    o.opt.draggable && o.event(o.ele, "add", t);
            }),
            (l.buildDots = function () {
                var o = this;
                if (o.opt.dots) {
                    if (
                        (typeof o.opt.dots == "string"
                            ? (o.dots = document.querySelector(o.opt.dots))
                            : (o.dots = o.opt.dots),
                            o.dots)
                    ) {
                        (o.dots.innerHTML = ""), o.dots.classList.add("glider-dots");
                        for (
                            var e = 0;
                            e < Math.ceil(o.slides.length / o.opt.slidesToShow);
                            ++e
                        ) {
                            var t = document.createElement("button");
                            (t.dataset.index = e),
                                t.setAttribute("aria-label", "Page " + (e + 1)),
                                t.setAttribute("role", "tab"),
                                (t.className = "glider-dot " + (e ? "" : "active")),
                                o.event(t, "add", { click: o.scrollItem.bind(o, e, !0) }),
                                o.dots.appendChild(t);
                        }
                    }
                } else o.dots && (o.dots.innerHTML = "");
            }),
            (l.bindArrows = function () {
                var o = this;
                o.opt.arrows
                    ? ["prev", "next"].forEach(function (e) {
                        var t = o.opt.arrows[e];
                        t &&
                            (typeof t == "string" && (t = document.querySelector(t)),
                                t &&
                                ((t._func = t._func || o.scrollItem.bind(o, e)),
                                    o.event(t, "remove", { click: t._func }),
                                    o.event(t, "add", { click: t._func }),
                                    (o.arrows[e] = t)));
                    })
                    : Object.keys(o.arrows).forEach(function (e) {
                        var t = o.arrows[e];
                        o.event(t, "remove", { click: t._func });
                    });
            }),
            (l.updateControls = function (o) {
                var e = this;
                o && !e.opt.scrollPropagate && o.stopPropagation();
                var t = e.containerWidth >= e.trackWidth;
                e.opt.rewind ||
                    (e.arrows.prev &&
                        (e.arrows.prev.classList.toggle(
                            "disabled",
                            e.ele.scrollLeft <= 0 || t
                        ),
                            e.arrows.prev.setAttribute(
                                "aria-disabled",
                                e.arrows.prev.classList.contains("disabled")
                            )),
                        e.arrows.next &&
                        (e.arrows.next.classList.toggle(
                            "disabled",
                            Math.ceil(e.ele.scrollLeft + e.containerWidth) >=
                            Math.floor(e.trackWidth) || t
                        ),
                            e.arrows.next.setAttribute(
                                "aria-disabled",
                                e.arrows.next.classList.contains("disabled")
                            ))),
                    (e.slide = Math.round(e.ele.scrollLeft / e.itemWidth)),
                    (e.page = Math.round(e.ele.scrollLeft / e.containerWidth));
                var i = e.slide + Math.floor(Math.floor(e.opt.slidesToShow) / 2),
                    a = Math.floor(e.opt.slidesToShow) % 2 ? 0 : i + 1;
                Math.floor(e.opt.slidesToShow) === 1 && (a = 0),
                    e.ele.scrollLeft + e.containerWidth >= Math.floor(e.trackWidth) &&
                    (e.page = e.dots ? e.dots.children.length - 1 : 0),
                    [].forEach.call(e.slides, function (c, n) {
                        var d = c.classList,
                            h = d.contains("visible"),
                            y = e.ele.scrollLeft,
                            S = e.ele.scrollLeft + e.containerWidth,
                            g = e.itemWidth * n,
                            W = g + e.itemWidth;
                        [].forEach.call(d, function (v) {
                            /^left|right/.test(v) && d.remove(v);
                        }),
                            d.toggle("active", e.slide === n),
                            i === n || (a && a === n)
                                ? d.add("center")
                                : (d.remove("center"),
                                    d.add(
                                        [
                                            n < i ? "left" : "right",
                                            Math.abs(n - (n < i ? i : a || i)),
                                        ].join("-")
                                    ));
                        var f =
                            Math.ceil(g) >= Math.floor(y) && Math.floor(W) <= Math.ceil(S);
                        d.toggle("visible", f),
                            f !== h &&
                            e.emit("slide-" + (f ? "visible" : "hidden"), { slide: n });
                    }),
                    e.dots &&
                    [].forEach.call(e.dots.children, function (c, n) {
                        c.classList.toggle("active", e.page === n);
                    }),
                    o &&
                    e.opt.scrollLock &&
                    (clearTimeout(e.scrollLock),
                        (e.scrollLock = setTimeout(function () {
                            clearTimeout(e.scrollLock),
                                0.02 < Math.abs(e.ele.scrollLeft / e.itemWidth - e.slide) &&
                                (e.mouseDown ||
                                    (e.trackWidth > e.containerWidth + e.ele.scrollLeft &&
                                        e.scrollItem(e.getCurrentSlide())));
                        }, e.opt.scrollLockDelay || 250)));
            }),
            (l.getCurrentSlide = function () {
                var o = this;
                return o.round(o.ele.scrollLeft / o.itemWidth);
            }),
            (l.scrollItem = function (o, e, t) {
                t && t.preventDefault();
                var i = this,
                    a = o;
                if ((++i.animate_id, e === !0))
                    (o *= i.containerWidth),
                        (o = Math.round(o / i.itemWidth) * i.itemWidth);
                else {
                    if (typeof o == "string") {
                        var c = o === "prev";
                        if (
                            ((o =
                                i.opt.slidesToScroll % 1 || i.opt.slidesToShow % 1
                                    ? i.getCurrentSlide()
                                    : i.slide),
                                c ? (o -= i.opt.slidesToScroll) : (o += i.opt.slidesToScroll),
                                i.opt.rewind)
                        ) {
                            var n = i.ele.scrollLeft;
                            o =
                                c && !n
                                    ? i.slides.length
                                    : !c && n + i.containerWidth >= Math.floor(i.trackWidth)
                                        ? 0
                                        : o;
                        }
                    }
                    (o = Math.max(Math.min(o, i.slides.length), 0)),
                        (i.slide = o),
                        (o = i.itemWidth * o);
                }
                return (
                    i.scrollTo(
                        o,
                        i.opt.duration * Math.abs(i.ele.scrollLeft - o),
                        function () {
                            i.updateControls(),
                                i.emit("animated", {
                                    value: a,
                                    type: typeof a == "string" ? "arrow" : e ? "dot" : "slide",
                                });
                        }
                    ),
                    !1
                );
            }),
            (l.settingsBreakpoint = function () {
                var o = this,
                    e = o._opt.responsive;
                if (e) {
                    e.sort(function (c, n) {
                        return n.breakpoint - c.breakpoint;
                    });
                    for (var t = 0; t < e.length; ++t) {
                        var i = e[t];
                        if (r.innerWidth >= i.breakpoint)
                            return (
                                o.breakpoint !== i.breakpoint &&
                                ((o.opt = Object.assign({}, o._opt, i.settings)),
                                    (o.breakpoint = i.breakpoint),
                                    !0)
                            );
                    }
                }
                var a = o.breakpoint !== 0;
                return (o.opt = Object.assign({}, o._opt)), (o.breakpoint = 0), a;
            }),
            (l.scrollTo = function (o, e, t) {
                var i = this,
                    a = new Date().getTime(),
                    c = i.animate_id,
                    n = function () {
                        var d = new Date().getTime() - a;
                        (i.ele.scrollLeft =
                            i.ele.scrollLeft +
                            (o - i.ele.scrollLeft) * i.opt.easing(0, d, 0, 1, e)),
                            d < e && c === i.animate_id
                                ? r.requestAnimationFrame(n)
                                : ((i.ele.scrollLeft = o), t && t.call(i));
                    };
                r.requestAnimationFrame(n);
            }),
            (l.removeItem = function (o) {
                var e = this;
                e.slides.length &&
                    (e.track.removeChild(e.slides[o]), e.refresh(!0), e.emit("remove"));
            }),
            (l.addItem = function (o) {
                this.track.appendChild(o), this.refresh(!0), this.emit("add");
            }),
            (l.handleMouse = function (o) {
                var e = this;
                e.mouseDown &&
                    ((e.isDrag = !0),
                        (e.ele.scrollLeft +=
                            (e.mouseDown - o.clientX) * (e.opt.dragVelocity || 3.3)),
                        (e.mouseDown = o.clientX));
            }),
            (l.round = function (o) {
                var e = 1 / (this.opt.slidesToScroll % 1 || 1);
                return Math.round(o * e) / e;
            }),
            (l.refresh = function (o) {
                this.init(!0, o);
            }),
            (l.setOption = function (o, e) {
                var t = this;
                t.breakpoint && !e
                    ? t._opt.responsive.forEach(function (i) {
                        i.breakpoint === t.breakpoint &&
                            (i.settings = Object.assign({}, i.settings, o));
                    })
                    : (t._opt = Object.assign({}, t._opt, o)),
                    (t.breakpoint = 0),
                    t.settingsBreakpoint();
            }),
            (l.destroy = function () {
                var o = this,
                    e = o.ele.cloneNode(!0),
                    t = function (i) {
                        i.removeAttribute("style"),
                            [].forEach.call(i.classList, function (a) {
                                /^glider/.test(a) && i.classList.remove(a);
                            });
                    };
                (e.children[0].outerHTML = e.children[0].innerHTML),
                    t(e),
                    [].forEach.call(e.getElementsByTagName("*"), t),
                    o.ele.parentNode.replaceChild(e, o.ele),
                    o.event(r, "remove", { resize: o.resize }),
                    o.emit("destroy");
            }),
            (l.emit = function (o, e) {
                var t = new r.CustomEvent("glider-" + o, {
                    bubbles: !this.opt.eventPropagate,
                    detail: e,
                });
                this.ele.dispatchEvent(t);
            }),
            (l.event = function (o, e, t) {
                var i = o[e + "EventListener"].bind(o);
                Object.keys(t).forEach(function (c) {
                    i(c, t[c]);
                }),
                    document.querySelectorAll(".card").forEach((c) => {
                        c.removeAttribute("style");
                    });
            }),
            s
        );
    });
    const u = document.querySelectorAll(".star");
    let b = 0;
    for (let r = 0; r < u.length; r++)
        (u[r].starNumber = r + 1),
            ["mouseover", "mouseout", "click"].forEach(function (s) {
                u[r].addEventListener(s, _);
            });
    function _(r) {
        let s = r.type,
            l = this.starNumber;
        u.forEach((o, e) => {
            s === "click" && ((b = l), x(b)),
                s === "mouseover" &&
                (e < l
                    ? o.classList.add("text-yellow-300")
                    : o.classList.remove("text-yellow-300")),
                s === "mouseout" && o.classList.remove("text-yellow-300");
        });
    }
    function x(r) {
        for (let s = 0; s < 5; s++)
            r > s
                ? u[s].classList.add("text-yellow-400")
                : u[s].classList.remove("text-yellow-400");
    }
    const m = document.querySelectorAll(".side-image"),
        L = document.querySelector(".main-image");
    m.forEach((r) => {
        r.addEventListener("click", (s) => {
            D(),
                r.firstElementChild.classList.add("highlight-selected"),
                L.firstElementChild.setAttribute(
                    "src",
                    r.firstElementChild.firstElementChild.getAttribute("src")
                );
        });
    });
    function D() {
        m.forEach((r) => {
            r.firstElementChild.classList.contains("highlight-selected") &&
                r.firstElementChild.classList.remove("highlight-selected");
        });
    }
    new Glider(document.querySelector(".glider"), {
        arrows: {
            prev: document.querySelector(".left-slide"),
            next: document.querySelector(".right-slide"),
        },
        draggable: !0,
        dragVelocity: 1,
    });
});
export default A();
