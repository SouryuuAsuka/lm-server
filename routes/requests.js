const express = require('express')
const router = express.Router()

const { getOrgRequest } = require("@controllers/moderation/org/getOrgRequest");
const { getOrgRequestList } = require("@controllers/moderation/org/getOrgRequestList");
const { orgConfirm } = require("@controllers/moderation/org/confirm");
const { setOrgComment } = require("@controllers/moderation/org/setOrgComment");

router.get('/requests', getOrgRequestList);
router.get('/requests/:reqId', getOrgRequest);
router.patch('/requests/:requestId/confirm', orgConfirm);
router.patch('/requests/:requestId/comment', setOrgComment);

module.exports = router
