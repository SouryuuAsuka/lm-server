const express = require('express');
const router = express.Router();
const appInit = require('@middleware/appInit');

const getCouriers = require("@controllers/couriers/getCouriers");
const confirmCourier = require("@controllers/couriers/confirmCourier");

router.use(appInit);

router.get('/', getCouriers);
router.put('/:tgId/confirm', confirmCourier);


module.exports = router
