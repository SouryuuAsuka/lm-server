const cors = require("cors");
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  console.log(JSON.stringify(req.cookies));
  jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
    if (err) {
      res.locals.isAuth = false;
      res.locals.isAdmin = false;
      res.locals.userId = null;
    } else {
      res.locals.isAuth = true;
      res.locals.userRole = decoded.userRole;
      res.locals.userId = decoded.userId;
      if (decoded.userRole == 5 || decoded.userRole == 6){
        res.locals.isAuth = true;
      } else {
        res.locals.isAdmin = false;
      }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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