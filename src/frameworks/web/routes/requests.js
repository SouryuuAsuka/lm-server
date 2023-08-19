const express = require('express')
const router = express.Router()

const { getOrgRequest } = require("@controllers/requests/getOrgRequest");
const { getOrgRequestList } = require("@controllers/requests/getOrgRequestList");
const { orgConfirm } = require("@controllers/requests/confirm");
const { setOrgComment } = require("@controllers/requests/setOrgComment");

router.get('/', getOrgRequestList);
router.get('/:requestId', getOrgRequest);
router.patch('/:requestId/confirm', orgConfirm);
router.patch('/:requestId/comment', setOrgComment);

module.exports = router
