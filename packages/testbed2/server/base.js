const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
const isDev = !(isProduction || isStaging);

// Ensure that process.env.NODE_ENV is a known value.
if (isDev) process.env.NODE_ENV = 'development';

require('dotenv-load')();

const next = require('next');

const app = next({ dev: isDev });

module.exports = {
  app,
  isDev,
  isStaging,
  isProduction,
};
