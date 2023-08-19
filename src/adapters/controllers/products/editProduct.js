const pool = require("@common/minio");
const jwt = require('jsonwebtoken');
const validator = require('validator');

const editGood = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, error: 'Unauthorized access.' });
            } else {
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
                    if (decoded.userRole == 5 || decoded.userRole == 6) {
                        const orgInsertString = "UPDATE goods SET name = $1, about = $2, price = $3, preparation_time = $4 WHERE good_id = $5"
                        pool.query(orgInsertString, [req.body.name, req.body.about, Number(req.body.price).toFixed(2), (24*req.body.preparationTime), req.params.productId], (err, orgRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Ошибка при создании товара" })
                            } else {
                                if (req.file) {
                                    savePicture(req, res, orgRow);
                                } else {
                                    return res.status(200).json({ success: true });
                                }                            
                            }
                        });
                    } else {
                        pool.query(`
                        SELECT * FROM organizations AS org
                        JOIN goods AS g 
                        ON org.org_id = g.org_id
                        WHERE g.good_id = $1 AND org.owner = $2`, [req.params.productId, decoded.userId], (err, user) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                            } else {
                                const orgInsertString = "UPDATE goods SET name = $1, about = $2, price = $3, preparation_time = $4 WHERE good_id = $5 AND org_id = $6"
                                pool.query(orgInsertString, [req.body.name, req.body.about, Number(req.body.price).toFixed(2), (24*req.body.preparationTime), req.params.productId, user.rows[0].org_id], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({ success: false, error: "Ошибка при создании товара" })
                                    } else {
                                        if (req.file) {
                                            savePicture(req, res, orgRow);
                                        } else {
                                            return res.status(200).json({ success: true });
                                        }
                                    }
                                });
                            }
                        })
                    }

                }
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
function savePicture(req, res, orgRow) {
    var image = sharp(req.file.path); // path to the stored image
    image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
        path.resolve(req.file.destination, 'resized', req.file.filename)
    ).then(function () {
        var metaData = {
            'Content-Type': 'image/jpeg',
        }
        minioClient.fPutObject(
            "picture",
            orgRow.rows[0].good_id + ".jpeg",
            path.resolve(req.file.destination, 'resized', req.file.filename),
            metaData,
            (err, etag) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                } else return res.status(200).json({ success: true });
            }
        );
    })
}

module.exports = editGood;