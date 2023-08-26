const dbot = require("@axios/dbot_axios");
const validator = require('validator');

const GetCourierList = require('@use_cases/courier/GetCourierList');
const ConfirmCourier = require('@use_cases/courier/ConfirmCourier');

module.exports = (dependecies) => {
  const { courierRepository } = dependecies.DatabaseService;
  const getCourierList = async (req, res, next) => {
    try {
      if (res.locals.isAdmin) {
        const GetCourierListCommand = GetCourierList(courierRepository);
        const response = await GetCourierListCommand();
        res.json(response);
      } else {
        throw 'Unauthorized access.';
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const confirmCourier = async (req, res, next) => {
    try {
      if (req.params.tgId == undefined) {
        return res.status(401).json({ error: true, message: 'Некорректный id.' });
      } else if (res.locals.isAdmin) {
        const ConfirmCourierCommand = ConfirmCourier(courierRepository);
        const appId = await ConfirmCourierCommand(req.params.tgId);
        var msgText = "Ваша заявка на регистрацию в курьерской системе одобрена."
        await dbot.post('sendmsg', {
            key: process.env.DBOT_ACCESS_KEY,
            id: appId,
            text: msgText
        })
        res.json({});
      } else {
        throw 'Unauthorized access.';
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  return {
    getCourierList,
    confirmCourier,
  }
}