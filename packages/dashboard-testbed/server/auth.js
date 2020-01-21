const basicAuth = require('express-basic-auth');

const argon2 = (() => {
  try {
    // eslint-disable-next-line global-require
    return require('argon2');
  } catch (err) {
    err.message = `Failed to import argon2, try running the command 'npm rebuild --update-binary'\nThat worked for me!\n-Linn\n${err.message}`;
    throw err;
  }
})();

const HASH =
  process.env.DEV_ARGON2_HASH ||
  '$argon2i$v=19$m=4096,t=3,p=1$dykrgWHatWg4gdVHe10rUg$sFD2j0mI+nIVB8JmM10g2qDBj+t9OFuRuz1vp4yDhL8';

module.exports = basicAuth({
  challenge: true,
  realm: `${process.env.NODE_ENV}.pija.se`,
  authorizer(username, password, cb) {
    const userMatches = basicAuth.safeCompare(username, 'admin');
    argon2.verify(HASH, password).then(
      passwordMatches => {
        // Cybersecurity people want me to use bitwise & to avoid
        // optimizations that could make us vulnerable to timing attacks
        // eslint-disable-next-line no-bitwise
        cb(null, userMatches & passwordMatches);
      },
      err => {
        cb(err, null);
      },
    );
  },
  authorizeAsync: true,
});
