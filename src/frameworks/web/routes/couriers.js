const express = require('express')
const router = express.Router()

const getCouriers = require("@controllers/couriers/getCouriers");
const confirmCourier = require("@controllers/couriers/confirmCourier");


router.get('/', getCouriers);
router.put('/:tgId/confirm', confirmCourier);


module.exports = router
