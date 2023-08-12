const express = require('express');
const router = express.Router();

const { getProfile } = require("@controllers/getProfile");
const { getProfileOrgList } = require("@controllers/profile/getProfileOrgList");

app.get('/:username', getProfile);
app.get('/:username/orgs', getProfileOrgList);

module.exports = router
