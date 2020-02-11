value=$(<dist/apps/tennis-score/index.html)
echo "$value"
node ./node_modules/envsub/bin/envsub.js --env Template="$value" sw-shell-real.template.js functions/sw-shell-real.js
rm -rf dist/apps/tennis-score/index.html
