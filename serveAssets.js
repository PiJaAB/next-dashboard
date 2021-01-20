/* eslint-disable flowtype/require-parameter-type, flowtype/require-valid-file-annotation */
// This is not a flow file.

const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = function serveAssets(server) {
  const envPath = path.join(
    __dirname,
    `assets-${process.env.NODE_ENV || 'development'}`,
  );
  let stat;
  try {
    stat = fs.statSync(envPath);
  } catch (err) {
    // pass
  }
  if (stat && stat.isDirectory()) {
    server.use(
      '/dashboard-assets',
      express.static(envPath, {
        redirect: false,
        index: false,
      }),
    );
  }
  server.use(
    '/dashboard-assets',
    express.static(path.join(__dirname, `assets`), {
      redirect: false,
      index: false,
    }),
  );
};
