const babelWebpackConfig = require("@nrwl/react/plugins/babel");

module.exports = config => {
  config.module.rules.unshift(
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192
          }
        }
      ]
    },
    {
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"]
    }
  );
  return babelWebpackConfig(config);
};
