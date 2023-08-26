const express = require('express');
const router = express.Router();
const appInit = require('@middleware/appInit');

const cartControllerCreate = require("@controllers/cart.controller");

const cartRouter = (dependencies) => {
  const cartController = cartControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', cartController.getCart);
  router.post('/', cartController.createCart);
  router.patch('/', cartController.addProductToCart);
  return router;
}
module.exports = cartRouter;
