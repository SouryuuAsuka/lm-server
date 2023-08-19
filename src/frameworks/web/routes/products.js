const express = require('express')
const router = express.Router()

const { uploadAvatar } = require("@root/src/frameworks/web/middleware/multer/uploadAvatar")

const { newProduct } = require("@controllers/products/newProduct")
const { editProduct } = require("@controllers/products/editProduct")
const { setActiveProduct } = require("@controllers/products/setActiveProduct")

router.post('/', uploadAvatar.single('picture'), newProduct);
router.patch('/:productId', uploadAvatar.single('picture'), editProduct);
router.patch('/:productId/active', setActiveProduct);

module.exports = router
