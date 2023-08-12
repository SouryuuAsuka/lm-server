const express = require('express')
const router = express.Router()

const { uploadAvatar } = require("@middleware/multer/uploadAvatar")

router.post('/', uploadAvatar.single('picture'), newGood);
router.patch('/:productId', uploadAvatar.single('picture'), editGood);
router.patch('/:productId/active', setActive);

module.exports = router
