module.exports = {
  globDirectory: "dist/apps/tennis-score",
  maximumFileSizeToCacheInBytes: 5000000,
  globPatterns: ["**/*.{ico,html,js,css}"],
  swDest: "dist/apps/tennis-score/sw.js",
  swSrc: "apps/tennis-score/src/sw.js"
};
