const express = require('express')
const router = express.Router()
const { getOrg } = require("@controllers/org/getOrg");
const { getOrgList } = require("@controllers/org/getOrgList");
const { newOrg } = require("@controllers/org/newOrg");
const { editOrg } = require("@controllers/org/editOrg");
const { setPublic } = require("@controllers/org/setPublic");
const { newOrgPayment } = require("@controllers/org/pays/newOrgPayment");
const { cancelOrgPayment } = require("@controllers/org/pays/cancelOrgPayment");
const { getOrgPayments } = require("@controllers/org/pays/getOrgPayments");
const { getOrgQuests } = require("@controllers/org/getOrgQuests");

const { uploadAvatar } = require("@middleware/multer/uploadAvatar")

router.get('/', getOrgList);
router.post('/', uploadAvatar.single('avatar'), newOrg);
router.get('/:orgId', getOrg);
router.patch('/:orgId', uploadAvatar.single('avatar'), editOrg);
router.patch('/:orgId/public', setPublic);
router.get('/:orgId/pays', getOrgPayments);
router.post('/:orgId/pays', newOrgPayment);
router.delete('/:orgId/pays/:payId', cancelOrgPayment);
router.get('/:orgId/quests', getOrgQuests);

module.exports = router
