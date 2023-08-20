const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.ACCESS_KEY_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
}