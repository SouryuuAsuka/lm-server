const multer = require('multer')
const path = require("path")

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'tmp')

    }
})
const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

exports.uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 2000000 // 1000000 Bytes = 1 MB
    },
}, fileFilter) 

