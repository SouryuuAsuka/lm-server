const cors = require("cors");
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");

module.exports = [
  cors(),
  bodyParser.urlencoded({ extended: false }), // parse application/x-www-form-urlencoded
  bodyParser.json(),  // parse application/json
  cookies()
]