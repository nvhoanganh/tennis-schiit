if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    console.log("Workbox is loaded");
    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    /* cache images*/
    const { registerRoute } = workbox.routing;
    const { CacheFirst } = workbox.strategies;
    const { CacheableResponsePlugin } = workbox.CacheableResponse;

    registerRoute(
      new RegExp(".(?:png|gif|jpg|jpeg)?alt=media$"),
      new CacheFirst({
        cacheName: "image-cache",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      })
    );
  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}
