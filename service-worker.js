const CACHE_NAME = "firstpwa-v5";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/article.html",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/contact.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "/js/idb.js",
    "/icon.png",
    "/images/background-1.png"
];

// Instalasi Service Worker (2)
self.addEventListener("install", function(event){
    console.log("ServiceWroker: Menginstall..");

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log("ServiceWorker: Membuka cache..")
            return cache.addAll(urlsToCache);
        })
    );
});

//event fetch
self.addEventListener("fetch", function(event){
    var base_url = "https://readerapi.codepolitan.com/";
    
    // Method indexOf akan mengembalikan nilai -1 jika base_url tidak ada di request saat ini dan akan bernilai lebih dari -1 jika url yang diminta mengandung isi base_url.
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response){
                return response || fetch(event.request);
            })
        )
    }
    
});

// Aktivasi Service Worker (3)
self.addEventListener("activate", function(event){
    console.log('Aktivasi service worker baru');

    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheName != CACHE_NAME && cacheName.startsWith("firstpwa")){
                        console.log("ServiceWorker: cache "+ cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});