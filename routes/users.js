const express = require('express')
const router = express.Router()
const { signin } = require("@controllers/signin");
const { signup } = require("@controllers/signup");
const { signout } = require("@controllers/signout");
const { getUser } = require("@controllers/getUser");
const { confirmEmail } = require("@controllers/confirmemail");
const { refreshToken } = require("@middleware/refreshToken");

router.get('/', getUser);
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/confirm-email', confirmEmail);
router.get('/token', refreshToken);
router.delete('/token', signout);

module.exports = router
