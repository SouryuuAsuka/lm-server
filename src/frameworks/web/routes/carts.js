const express = require('express');
const router = express.Router();
const appInit = require('@middleware/appInit');

const newCart = require("@controllers/carts/newCart");
const getCart = require("@controllers/carts/getCart");
const addToCart = require("@controllers/carts/addToCart");

router.use(appInit);

router.get('/', getCart);
router.post('/', newCart);
router.patch('/', addToCart);

module.exports = router
