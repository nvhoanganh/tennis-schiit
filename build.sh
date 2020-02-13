# clean the dist folder
rm -rf dist/apps/tennis-score/

# get version
VERSION=$(git rev-parse --short HEAD)
DATEV=$(date +%Y.%m.%d)
echo Building Version numer: $DATEV.$VERSION
node ./node_modules/envsub/bin/envsub.js --env BuildId=$DATEV.$VERSION apps/tennis-score/src/assets/version.template.ts apps/tennis-score/src/assets/version.ts

# build
echo Start building the app
npm run build-prod

# update the ServiceWorker shell
echo Replace the index.html file
value=$(<dist/apps/tennis-score/index.html)
echo "$value"
node ./node_modules/envsub/bin/envsub.js --env Template="$value" sw-shell-real.template.js functions/sw-shell-real.js

# inject service worker
echo Injecting the service worker
workbox injectManifest workbox-config.js

echo Finished building Version numer: $DATEV.$VERSION
