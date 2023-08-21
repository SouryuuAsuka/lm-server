const cors = require("cors");
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
    if (err) {
      req.locals.isAuth = false;
      req.locals.isAdmin = false;
      req.locals.userId = null;
    } else {
      req.locals.isAuth = true;
      req.locals.userRole = decoded.userRole;
      req.locals.userId = decoded.userId;
      if (decoded.userRole == 5 || decoded.userRole == 6){
        req.locals.isAuth = true;
      } else {
        req.locals.isAdmin = false;
      }
    }
    next();
  })
}

module.exports = [
  cors(),
  bodyParser.urlencoded({ extended: false }), // parse application/x-www-form-urlencoded
  bodyParser.json(),  // parse application/json
  cookies(),
  jwtAuth,
]