const express = require('express')
const router = express.Router()
//const usersController = require('../controllers/users')
const { newCart } = require("@controllers/cart/newCart");
const { getCart } = require("@controllers/cart/getCart");
const { addToCart } = require("@controllers/cart/addToCart");

router.get('/', getCart);
router.post('/', newCart);
router.patch('/', addToCart);

module.exports = router
