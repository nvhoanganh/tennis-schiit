VERSION=$(git rev-parse --short HEAD)
DATEV=$(date +%Y.%m.%d)
echo Version numer: $DATEV.$VERSION
node ./node_modules/envsub/bin/envsub.js --env BuildId=$DATEV.$VERSION apps/tennis-score/src/assets/version.template.ts apps/tennis-score/src/assets/version.ts