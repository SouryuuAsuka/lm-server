const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');

const getOrgRequest = require("@controllers/requests/getOrgRequest");
const getOrgRequestList = require("@controllers/requests/getOrgRequestList");
const orgConfirm = require("@controllers/requests/confirm");
const setOrgComment = require("@controllers/requests/setOrgComment");

const requestControllerCreate = require("@controllers/request.controller");

const requestRouter = (dependencies) => {
  const requestController = requestControllerCreate(dependencies);
  router.use(appInit);

  router.get('/', requestController.getRequestList);
  router.get('/:requestId', requestController.getRequest);
  router.patch('/:requestId/confirm', requestController.confirmRequest);
  router.patch('/:requestId/comment', setOrgComment);

  return router;
}

module.exports = requestRouter;

