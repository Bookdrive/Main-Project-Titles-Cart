const u = function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) i(e);
    new MutationObserver((e) => {
        for (const o of e)
            if (o.type === "childList")
                for (const n of o.addedNodes)
                    n.tagName === "LINK" && n.rel === "modulepreload" && i(n);
    }).observe(document, { childList: !0, subtree: !0 });
    function l(e) {
        const o = {};
        return (
            e.integrity && (o.integrity = e.integrity),
            e.referrerpolicy && (o.referrerPolicy = e.referrerpolicy),
            e.crossorigin === "use-credentials"
                ? (o.credentials = "include")
                : e.crossorigin === "anonymous"
                    ? (o.credentials = "omit")
                    : (o.credentials = "same-origin"),
            o
        );
    }
    function i(e) {
        if (e.ep) return;
        e.ep = !0;
        const o = l(e);
        fetch(e.href, o);
    }
};
u();
const s = document.querySelectorAll(".star");
let c = 0;

for (let r = 0; r < s.length; r++)
    (s[r].starNumber = r + 1),
        ["mouseover", "mouseout", "click"].forEach(function (t) {
            s[r].addEventListener(t, a);
        });
function a(r) {
    let t = r.type,
        l = this.starNumber;
    s.forEach((i, e) => {
        t === "click" && ((c = l), f(c)),
            t === "mouseover" &&
            (e < l
                ? i.classList.add("text-yellow-300")
                : i.classList.remove("text-yellow-300")),
            t === "mouseout" && i.classList.remove("text-yellow-300");
    });
}
function f(r) {
    for (let t = 0; t < 5; t++)
        r > t
            ? s[t].classList.add("text-yellow-400")
            : s[t].classList.remove("text-yellow-400");
}

