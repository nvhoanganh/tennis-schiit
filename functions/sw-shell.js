const linkBot = config => {
  const { title, image, description, content } = config;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#343a40" />

  <!-- og meta -->
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">

  <meta property="og:locale" content="en_AU" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
</head>
<body>
  <div>${content}</div>
</body>
</html>
`;
};
module.exports = linkBot;
