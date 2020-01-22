/* eslint-disable flowtype/require-valid-file-annotation */

/* LOGGER CONFIG */

const loggerName = 'logger';
const levels = ['all', 'log', 'dir', 'debug', 'info', 'warn', 'error', 'none'];

/* LOGGER LOGIC */

levels.reverse();

const minLevel = level => {
  const index = levels.findIndex(e => e === level);
  if (index < 0) {
    throw new Error(`Cannot find level ${level}`);
  }
  return levels
    .slice(index + 1)
    .filter(e => e !== 'all' && e !== 'none')
    .map(e => `${loggerName}.${e}`);
};

/* BABEL CONFIG */

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
  env: {
    production: {
      plugins: [
        [
          'strip-function-call',
          {
            strip: minLevel('warn'),
          },
        ],
      ],
    },
    staging: {
      plugins: [
        [
          'strip-function-call',
          {
            strip: minLevel('info'),
          },
        ],
      ],
    },
  },
};
