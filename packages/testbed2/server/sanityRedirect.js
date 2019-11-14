const BASE_URL = process.env.NEXT_STATIC_BASE_URL;
const PARSED_BASE = new URL(BASE_URL);

module.exports = function sanityRedirect(req, res, next) {
  let sendRedirect = false;
  let protocol = req.headers['x-forwarded-proto'];
  let { url } = req;

  if (protocol) {
    protocol += ':';
    if (protocol !== PARSED_BASE.protocol) sendRedirect = true;
  }
  if (req.headers.host !== PARSED_BASE.host) sendRedirect = true;

  const match = url.match(/(.+)\/($|\?.*)/);

  if (match) {
    url = `${match[1]}${match[2]}`;
    sendRedirect = true;
  }

  if (sendRedirect) {
    return res.redirect(301, `${BASE_URL}${url}`);
  }
  return next();
};
