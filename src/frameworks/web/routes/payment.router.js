const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');

const paymentControllerCreate = require("@controllers/payment.controller");

const paymentRouter = (dependencies) => {
  const paymentController = paymentControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', paymentController.getPaymentList);
  router.post('/', paymentController.createPayment);
  router.delete('/:payId', paymentController.cancelPayment);

  return router;
}


module.exports = paymentRouter;
