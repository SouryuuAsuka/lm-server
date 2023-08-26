const validator = require('validator');

const CancelPayment = require('@use_cases/payment/CancelPayment');
const GetPaymentList = require('@use_cases/payment/GetPaymentList');
const CreatePayment = require('@use_cases/payment/CreatePayment');

module.exports = (dependecies) => {
  const { paymentRepository, orgRepository } = dependecies.DatabaseService;
  const cancelPayment = async (req, res, next) => {
    try {
      if (res.locals.isAdmin) {
        const CancelPaymentCommand = CancelPayment(paymentRepository);
        const response = await CancelPaymentCommand(req.params.orgId, req.params.paymentId);
        res.json(response);
      } else {
        throw "Ошибка доступа";
      }
    } catch (err) {
      next(err);
    }
  }
  const getPaymentList = async (req, res, next) => {
    try {
      const GetPaymentListCommand = GetPaymentList(paymentRepository, orgRepository);
      const response = await GetPaymentListCommand(res.locals.isAdmin, req.params.orgId, res.locals.userId, req.query.p);
      res.json({ orgs: response });
    } catch (err) {
      next(err);
    }
  }
  const createPayment = async (req, res, next) => {
    try {
      if (res.locals.isAdmin) {
        const CreatePaymentCommand = CreatePayment(paymentRepository);
        const response = await CreatePaymentCommand(req.params.orgId, res.locals.userId, req.body.quests);
        res.json({ text: "Зарегистрирована выплата в " + response + " GEL" });
      } else {
        throw "Ошибка доступа";
      }
    } catch (err) {
      next(err);
    }
  }
  return {
    cancelPayment,
    getPaymentList,
    createPayment,
  }
}