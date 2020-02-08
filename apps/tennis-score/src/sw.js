if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    // workbox.setConfig({
    //   debug: true
    // });
    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    const { registerRoute } = workbox.routing;
    const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
    const { CacheableResponse } = workbox.cacheableResponse;
    const { CacheExpiration, Plugin: ExpirationPlugin } = workbox.expiration;

    /* cache images*/
    registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new CacheableResponse({
            statuses: [0, 200]
          })
        ]
      })
    );

    // cache google map
    registerRoute(
      /^https:\/\/maps\.googleapis\.com\/maps-api-v3/,
      new StaleWhileRevalidate({
        cacheName: "google-map-api",
        plugins: [
          new CacheableResponse({
            statuses: [0, 200]
          })
        ]
      })
    );

    // Cache images in the firebase storage
    registerRoute(
      /.*firebasestorage\.googleapis\.com.*.(?:png|gif|jpg|jpeg)/,
      new StaleWhileRevalidate({
        cacheName: "firebase-image-cache",
        plugins: [
          new CacheableResponse({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 30
          })
        ]
      })
    );
  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}

self.addEventListener("message", function(event) {
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
