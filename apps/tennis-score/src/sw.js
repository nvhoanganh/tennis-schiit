if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    // workbox.setConfig({
    //   debug: true
    // });
    console.log("Workbox is loaded");
    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    /* cache images*/
    const { registerRoute } = workbox.routing;
    const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
    const { CacheableResponse } = workbox.cacheableResponse;
    // const { CacheExpiration, Plugin: CacheExpirationPlugin} = workbox.expiration;

    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets"
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
