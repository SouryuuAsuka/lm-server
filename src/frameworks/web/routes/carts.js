const express = require('express')
const router = express.Router()
//const usersController = require('../controllers/users')
const { newCart } = require("@controllers/carts/newCart");
const { getCart } = require("@controllers/carts/getCart");
const { addToCart } = require("@controllers/carts/addToCart");

router.get('/', getCart);
router.post('/', newCart);
router.patch('/', addToCart);

module.exports = router
