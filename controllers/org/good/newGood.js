const path = require("path")
const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const validator = require('validator');
const minioClient = require("@service/minio");
const sharp = require('sharp');

exports.newGood = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                console.log(JSON.stringify(req.body));
                if (req.body.name == undefined) {
                    return res.status(400).json({ success: false, error: "Название товара должно быть отправлено" })
                } else if (req.body.about == undefined) {
                    return res.status(400).json({ success: false, error: "Описание товара должно быть отправлено" })
                } else if (req.body.price == undefined) {
                    return res.status(400).json({ success: false, error: "Цена товара должна быть отправлена" })
                } else if (req.body.minTime == undefined) {
                    return res.status(400).json({ success: false, error: "Минимальное время изготовления товара должно быть отправлена" })
                } else if (req.body.maxTime == undefined) {
                    return res.status(400).json({ success: false, error: "Максимальное время изготовления товара должно быть отправлена" })
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
                } else if (isNaN(req.body.minTime)) {
                    return res.status(400).json({ success: false, error: "Минимальное время изготовления товара должно быть заполнено" })
                } else if (isNaN(req.body.maxTime)) {
                    return res.status(400).json({ success: false, error: "Максимальное время изготовления товара должно быть заполнено" })
                } else if (isNaN(req.body.orgId)) {
                    return res.status(400).json({ success: false, error: "Ошибка при указании организации" })
                } else if (req.body.minTime > req.body.maxTime) {
                    return res.status(400).json({ success: false, error: "Минимальное время изготовление превышает максимальное время" })
                } else if (req.body.maxTime > 7) {
                    return res.status(400).json({ success: false, error: "Максимальное время изготовление превышает неделю" })
                } else if (!validator.matches(req.body.lang, '^[a-z]{3}$')) {
                    return res.status(400).json({ success: false, error: "Некорректно указан язык описания" })
                } else {
                    pool.query(`SELECT * FROM organizations WHERE org_id = $1`, [req.body.orgId], (err, user) => {
                        if (user.rows[0].owner == decoded.userId) {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                            } else {
                                const orgInsertString = "INSERT INTO goods (name, about, org_id, price, min_time, max_time, created) VALUES ($1, $2, $3, $4, $5, $6, $7)"
                                pool.query(orgInsertString, [[{lang: req.body.lang, text: req.body.name}], [{lang: req.body.lang, text: req.body.about}], req.body.orgId, req.body.price, req.body.minTime*24, req.body.maxTime*24, "NOW()"], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                                    } else {
                                        var image = sharp(req.file.path); // path to the stored image
                                        image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
                                            path.resolve(req.file.destination, 'resized', req.file.filename)
                                        )  // get image metadata for size
                                            .then(function (metadata) { //TODO: Потом надо будет как-то нормально обрабатывать    изображения
                                                //console.log("orgRow" + JSON.stringify(orgRow))
                                                var metaData = {
                                                    'Content-Type': 'image/jpeg',
                                                }
                                                minioClient.fPutObject(
                                                    "goods",
                                                    req.body.orgId + ".jpeg",
                                                    path.resolve(req.file.destination, 'resized', req.file.filename),
                                                    metaData,
                                                    (err, etag) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                                                        } else return res.status(200).json({ success: true });
                                                    }
                                                );
                                            }).catch(err => {
                                                console.log("Ошибка сохранения файла. " + err)
                                                return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                                            })
                                    }
                                });
                            }
                        } else {
                            console.log("Недостаточно прав для создания карточки товара")
                            return res.status(400).json({ success: false, error: "Недостаточно прав для регистрации организации" })
                        }
                    })
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}