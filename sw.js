importScripts('js/cache-polyfill.js');

var CACHE_VERSION = 'app-v10';
var CACHE_FILES = [
    '/',
    'index.html',
    'introduction.html',
    'psychology.html',
    'power.html',
    'planning.html',
    'kits.html',
    'apps.html',
    'basic-medicine.html',
    'shelter.html',
    'water.html'
    'fire.html',
    'food.html'
    'plants.html',
    'poisonous-plants.html',
    'animals.html',
    'tools.html',
    'desert.html',
    'tropical.html',
    'cold.html',
    'sea.html',
    'water crossing.html',
    'find-directions.html',
    'man-made.html',
    'signaling.html',
    'hostile-areas.html',
    'camouflage.html',
    'people.html',
    'credits.html',
    'multitool.html',
    'edible.html',
    'poisonous-plants-list.html',
    'insects-and-arachnids.html',
    'snakes-and-lizards.html',
    'fishes-and-mollusks.html',
    'ropes-and-knots.html',
    'clouds.html',
    'faq.html',
    'js/app.js',
    'js/jquery.min.js',
    'css/style.css',
    'manifest.json',
    'icon.webp'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(res) {
            if (res) {
                return res;
            }
            requestBackend(event);
        })
    )
});

function requestBackend(event) {
    var url = event.request.clone();
    return fetch(url).then(function(res) {
        //if not a valid response send the error
        if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_VERSION).then(function(cache) {
            cache.put(event.request, response);
        });

        return res;
    })
}

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key, i) {
                if (key !== CACHE_VERSION) {
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});
