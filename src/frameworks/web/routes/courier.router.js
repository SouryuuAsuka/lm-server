const express = require('express');
const router = express.Router();
const appInit = require('@middleware/appInit');

const courierControllerCreate = require("@controllers/courier.controller");

const courierRouter = (dependencies) => {
  const courierController = courierControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', courierController.getCourierList);
  router.put('/:tgId/confirm', courierController.confirmCourier);

  return router;
}

module.exports = courierRouter;
