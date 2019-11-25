/* eslint-disable flowtype/require-parameter-type,flowtype/require-valid-file-annotation,flowtype/require-return-type */
require('dotenv-load')();
const nextEnv = require('next-env');
const withSass = require('@zeit/next-sass');

const withNextEnv = nextEnv();

module.exports = withSass(withNextEnv({
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
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'public/assets',
              },
            },
          },
        ],
      },
    };
  },
}));
