
const CACHE_NAME = "padyak-all-v3";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/css/bootstrap.min.css",
    "/css/style.css",
    "/js/app.js",
    "/logo/padyak192.png",
    "/logo/padyak512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await Promise.all(
                FILES_TO_CACHE.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (error) {
                        console.warn("Failed to cache:", url, error);
                    }
                })
            );
        })
    );

    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(
                names
                    .filter((name) => name.startsWith("padyak-all-") && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET") return;
    if (url.origin !== self.location.origin) return;

    // Network-first para sa pages at Vite resources.
    // Hindi nagka-cache ng response dito.
    event.respondWith(
        fetch(request).catch(async () => {
            const cached = await caches.match(request);

            if (cached) return cached;

            if (request.mode === "navigate") {
                const fallback = await caches.match("/index.html");

                if (fallback) return fallback;
            }

            return new Response("Offline: resource unavailable.", {
                status: 503,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                }
            });
        })
    );
});
