/* eslint-disable flowtype/require-parameter-type,flowtype/require-valid-file-annotation,flowtype/require-return-type */
require('dotenv-load')();
const nextEnv = require('next-env');

const withNextEnv = nextEnv();

module.exports = withNextEnv({
  dir: './src',
  webpack(config) {
    return {
      ...config,
      node: {
        __filename: true,
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: '[name].[ext]',
              },
            },
          },
        ],
      },
    };
  },
});
