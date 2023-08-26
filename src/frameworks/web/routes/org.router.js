const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');
const { uploadAvatar } = require("@middleware/multer/uploadAvatar");

const orgControllerCreate = require("@controllers/org.controller");
const paymentControllerCreate = require("@controllers/payment.controller");

const orgRouter = (dependencies) => {
  const orgController = orgControllerCreate(dependencies);
  const paymentController = paymentControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', orgController.getOrgList);
  router.post('/', uploadAvatar.single('avatar'), orgController.createOrg);
  router.get('/:orgId', orgController.getOrgById);
  router.patch('/:orgId', uploadAvatar.single('avatar'), orgController.editOrg);
  router.patch('/:orgId/public', orgController.setPublic);
  router.get('/:orgId/pays', paymentController.getPaymentList);
  router.post('/:orgId/pays', paymentController.createPayment);
  router.delete('/:orgId/pays/:payId', paymentController.cancelPayment);
  router.get('/:orgId/quests', orgController.getOrgQuestList);

  return router;
}


module.exports = orgRouter
