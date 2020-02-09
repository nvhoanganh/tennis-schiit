VERSION=$(git rev-parse --short HEAD)
echo Version numer: $VERSION
node ./node_modules/envsub/bin/envsub.js --env BuildId=$VERSION apps/tennis-score/src/assets/version.template.ts apps/tennis-score/src/assets/version.ts