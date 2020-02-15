const babelWebpackConfig = require("@nrwl/react/plugins/babel");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = config => {
  config.plugins = [
    ...config.plugins,
    new BundleAnalyzerPlugin()
  ];
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
