const validator = require('validator');

const EditProduct = require('@use_cases/product/EditProduct');
const CreateProduct = require('@use_cases/product/CreateProduct');
const SetActiveProduct = require('@use_cases/product/SetActiveProduct');

module.exports = (dependecies) => {
  const { productRepository, orgRepository } = dependecies.DatabaseService;
  const { avatarRepository } = dependecies.AwsService;
  const editProduct = async (req, res, next) => {
    try {
      if (req.body.name == undefined) {
        return res.status(400).json({ success: false, error: "Название товара должно быть заполнено" })
      } else if (req.body.about == undefined) {
        return res.status(400).json({ success: false, error: "Описание товара должно быть заполнено" })
      } else if (req.params.productId == undefined) {
        return res.status(400).json({ success: false, error: "ID товара должно быть заполнено" })
      } else if (req.body.price == undefined) {
        return res.status(400).json({ success: false, error: "Цена товара должно быть заполнено" })
      } else if (req.body.preparationTime == undefined) {
        return res.status(400).json({ success: false, error: "Минимальное время доставки товара должно быть заполнено" })
      } else if (isNaN(req.params.productId)) {
        return res.status(400).json({ success: false, error: "Ошибка при указании ID товара" })
      } else if (isNaN(req.body.preparationTime)) {
        return res.status(400).json({ success: false, error: "Минимальное время изготовления товара должно быть заполнено" })
      } else if (isNaN(req.body.price)) {
        return res.status(400).json({ success: false, error: "Ошибка при указании цены товара" })
      } else if (req.body.preparationTime > 7) {
        return res.status(400).json({ success: false, error: "Время изготовление превышает неделю" })
      } else {
        let product = req.body;
        product.productId = req.params.productId;
        const EditProductCommand = EditProduct(productRepository, avatarRepository);
        await EditProductCommand(res.locals.isAdmin, res.locals.userId, product, req.file);
        res.json({ success: true });
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const createProduct = async (req, res, next) => {
    try {
      if (req.body.name == undefined) {
        return res.status(400).json({ success: false, error: "Название товара должно быть отправлено" })
      } else if (req.body.about == undefined) {
        return res.status(400).json({ success: false, error: "Описание товара должно быть отправлено" })
      } else if (req.body.price == undefined) {
        return res.status(400).json({ success: false, error: "Цена товара должна быть отправлена" })
      } else if (req.body.preparationTime == undefined) {
        return res.status(400).json({ success: false, error: "Время изготовления товара должно быть отправлена" })
      } else if (req.body.orgId == undefined) {
        return res.status(400).json({ success: false, error: "ID организации должно быть отправлено" })
      } else if (req.body.lang == undefined) {
        return res.status(400).json({ success: false, error: "Язык описания должен быть отправлен" })
      } else if (validator.isEmpty(req.body.name)) {
        return res.status(400).json({ success: false, error: "Название товара должно быть заполнено" })
      } else if (validator.isEmpty(req.body.about)) {
        return res.status(400).json({ success: false, error: "Описание товара должно быть заполнено" })
      } else if (isNaN(req.body.price)) {
        return res.status(400).json({ success: false, error: "Цена товара должна быть заполнена" })
      } else if (isNaN(req.body.preparationTime)) {
        return res.status(400).json({ success: false, error: "Время изготовления товара должно быть заполнено" })
      } else if (isNaN(req.body.orgId)) {
        return res.status(400).json({ success: false, error: "Ошибка при указании организации" })
      } else if (req.body.preparationTime > 7) {
        return res.status(400).json({ success: false, error: "Время изготовление превышает неделю" })
      } else if (!validator.matches(req.body.lang, '^[a-z]{2}$')) {
        return res.status(400).json({ success: false, error: "Некорректно указан язык описания" })
      } else {
        const CreateProductCommand = CreateProduct(productRepository, orgRepository, avatarRepository);
        await CreateProductCommand(res.locals.isAdmin, res.locals.userId, req.body, req.file);
        res.json({ success: true });
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const setActiveProduct = async (req, res, next) => {
    try {
      if (req.params.productId == undefined) {
        res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
      } else if (req.body.active == undefined) {
        res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
      } else if (!Number.isInteger(req.params.productId)) {
        res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
      } else if (!validator.isBoolean(req.body.active)) {
        res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
      } else {
        const SetActiveProductCommand = SetActiveProduct(productRepository, avatarRepository);
        await SetActiveProductCommand(res.locals.isAdmin, res.locals.userId, req.params.productId, req.body.active);
        res.json({ success: true });
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  return {
    editProduct,
    createProduct,
    setActiveProduct,
  }
}