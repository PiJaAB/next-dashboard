// Want to update process.env.NODE_ENV asap if it needs to be done..
// eslint-disable-next-line import/order
const { app } = require('./base');

const express = require('express');
const path = require('path');

const sanityRedirect = require('./sanityRedirect');

const env = process.env.NODE_ENV;
const port = parseInt(process.env.PORT, 10) || 3000;
const handleNext = app.getRequestHandler();

function error(req, res) {
  const err = new Error('File not found', 'ENOENT');
  err.statusCode = 404;
  res.statusCode = 404;
  app.renderError(err, req, res, req.path, req.query);
}

app.prepare().then(() => {
  const server = express();

  server.use(sanityRedirect);

  server.get('*', express.static(path.join(__dirname, '..', `public-${env}`)));

  server.use(handleNext);
  server.use('/_*', error);

  /* starting server */
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
