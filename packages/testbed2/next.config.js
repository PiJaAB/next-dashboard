/* eslint-disable flowtype/require-parameter-type,flowtype/require-valid-file-annotation,flowtype/require-return-type */
require('dotenv-load')();
const nextEnv = require('next-env');
const withSass = require('@zeit/next-sass');

const withNextEnv = nextEnv();

//note: please declare withTM as your last plugin (the "most nested" one).
const withTM = require('next-transpile-modules');

module.exports = withNextEnv(withTM(withSass({
  transpileModules: ['@pija-ab/next-dashboard'],
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
})));