// This is the "Offline copy of assets" service worker

// The cache name suffix is replaced with a timestamp on every build (see vite.config.js)
const CACHE = "pwabuilder-offline-1790124591316";

importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js");

self.skipWaiting();
workbox.core.clientsClaim();

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
    );
});

workbox.routing.registerRoute(
    new RegExp("/*"),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE,
    }),
);
