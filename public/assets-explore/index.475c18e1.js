// fro getting co-ordinates

// Step 1: Get user coordinates
function getCoordintes() {
    // console.log("getCoordintes")
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
        return;

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.832bd5fa1e38bc0e9138eb22e89c6a00&lat=" +
        lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            console.log("city", city);
            $("#searchLocation").val(city);
            // console.log($("#searchItem").val())
            return;
        }
    }
}

const btn = document.querySelector(".geo-btn");
btn.addEventListener("click", function () {
    // console.log("btn clicked")
    getCoordintes();
});



const a = function () {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) l(e);
    new MutationObserver((e) => {
        for (const t of e)
            if (t.type === "childList")
                for (const r of t.addedNodes)
                    r.tagName === "LINK" && r.rel === "modulepreload" && l(r);
    }).observe(document, { childList: !0, subtree: !0 });
    function u(e) {
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
    function l(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = u(e);
        fetch(e.href, t);
    }
};
a();

const showFilterBtn = document.querySelector('.show-filter-btn');
const filterSection = document.querySelector('.filter-section');

showFilterBtn.addEventListener('click', () => {
    filterSection.classList.toggle('hidden');
})


