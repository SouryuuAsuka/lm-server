const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');
const { uploadAvatar } = require("@middleware/multer/uploadAvatar");

const productControllerCreate = require("@controllers/product.controller");

const productRouter = (dependencies) => {
  const productController = productControllerCreate(dependencies);

  router.use(appInit);

  router.post('/', uploadAvatar.single('picture'), productController.createProduct);
  router.patch('/:productId', uploadAvatar.single('picture'), productController.editProduct);
  router.patch('/:productId/active', productController.setActiveProduct);

  return router;
}

module.exports = productRouter;
