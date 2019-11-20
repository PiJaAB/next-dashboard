/* eslint-disable flowtype/require-valid-file-annotation */

module.exports = {
  presets: [
    "next/babel"
  ],
  plugins: [
    "babel-plugin-transform-class-properties",
    "transform-flow-strip-types",
    ["module-resolver", {
      alias: {
        src: "./src"
      }
    }]
  ]
}