# clean the dist folder
rm -rf dist/apps/tennis-score/

# get version
BUILDID=$1
echo Build ID is $BUILDID
VERSION=$(git rev-parse --short HEAD)
DATEV=$(date +%Y.%m.%d)
echo Building Version numer: $DATEV.$VERSION.$BUILDID
node ./node_modules/envsub/bin/envsub.js --env BuildId=$DATEV.$VERSION.$BUILDID apps/tennis-score/src/assets/version.template.ts apps/tennis-score/src/assets/version.ts

# build
echo Start building the app
npm run build-prod

# update the ServiceWorker shell
echo Replace the index.html file
value=`cat dist/apps/tennis-score/index.html`
echo "$value"
node ./node_modules/envsub/bin/envsub.js --env Template="$value" sw-shell-real.template.js functions/sw-shell-real.js

# inject service worker
echo Injecting the service worker
workbox injectManifest workbox-config.js

echo Copy functions codes to dist folder
mkdir dist/apps/functions
cp functions/*.* dist/apps/functions
echo Finished building Version numer: $DATEV.$VERSION.$BUILDID
