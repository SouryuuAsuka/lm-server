const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');
const auth = require("@middleware/auth");

const signin = require("@controllers/users/signin");
const signup = require("@controllers/users/signup");
const signout = require("@controllers/users/signout");
const getUser = require("@controllers/users/getUser");
const confirmEmail = require("@controllers/users/confirmEmail");
const refreshToken = require("@controllers/users/refreshToken");

router.use(appInit);

router.get('', getUser);
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/confirm-email', confirmEmail);
router.get('/token', refreshToken);
router.delete('/token', auth, signout);

module.exports = router;
