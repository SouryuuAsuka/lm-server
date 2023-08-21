const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');
const { uploadAvatar } = require("@middleware/multer/uploadAvatar");

const orgController = require("@controllers/org/org.controller")

const getOrg = require("@controllers/orgs/getOrg");
const getOrgList = require("@controllers/orgs/getOrgList");
const newOrg = require("@controllers/orgs/newOrg");
const editOrg = require("@controllers/orgs/editOrg");
const setPublic = require("@controllers/orgs/setPublic");
const newOrgPayment = require("@controllers/orgs/pays/newOrgPayment");
const cancelOrgPayment = require("@controllers/orgs/pays/cancelOrgPayment");
const getOrgPayments = require("@controllers/orgs/pays/getOrgPayments");
const getOrgQuests = require("@controllers/orgs/getOrgQuests");

const orgsRouter = (dependencies) => {
  const controller = orgController(dependencies);

  router.use(appInit);

  router.get('', controller.getOrgList);
  router.post('/', uploadAvatar.single('avatar'), newOrg);
  router.get('/:orgId', getOrg);
  router.patch('/:orgId', uploadAvatar.single('avatar'), editOrg);
  router.patch('/:orgId/public', setPublic);
  router.get('/:orgId/pays', getOrgPayments);
  router.post('/:orgId/pays', newOrgPayment);
  router.delete('/:orgId/pays/:payId', cancelOrgPayment);
  router.get('/:orgId/quests', getOrgQuests);

  return router;
}


module.exports = orgsRouter
