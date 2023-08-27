const cors = require("cors");
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  console.log(JSON.stringify(req.cookies));
  if (req.cookies.accessToken && !(req.url.includes('/token') && req.method === 'GET')) {
    jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({});
      } else {
        res.locals.isAuth = true;
        res.locals.userRole = decoded.userRole;
        res.locals.userId = decoded.userId;
        if (decoded.userRole == 5 || decoded.userRole == 6) {
          res.locals.isAuth = true;
        } else {
          res.locals.isAdmin = false;
        }
        next();
      }
    })
  } else {
    res.locals.isAuth = false;
    res.locals.isAdmin = false;
    res.locals.userId = null;
    next();
  }
}

module.exports = [
  cors({ credentials: true, origin: true }),
  bodyParser.urlencoded({ extended: false }), // parse application/x-www-form-urlencoded
  bodyParser.json(),  // parse application/json
  cookies(),
  jwtAuth,
]