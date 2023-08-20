const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');

const getProfile = require("@controllers/profiles/getProfile");
const getProfileOrgList = require("@controllers/profiles/getProfileOrgList");

router.use(appInit);

router.get('/:username', getProfile);
router.get('/:username/orgs', getProfileOrgList);

module.exports = router
