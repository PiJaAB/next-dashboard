/* eslint-disable flowtype/require-valid-file-annotation */

module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [
    'babel-plugin-transform-class-properties',
    'transform-flow-strip-types',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: 2,
        helpers: true,
        regeneratior: true,
        useESModules: true,
      },
    ],
  ],
};
