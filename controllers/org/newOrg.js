const path = require("path")
const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const validator = require('validator');
const sharp = require('sharp');

var Minio = require('minio');
const minioClient = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});


exports.newOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (req.body.name == undefined) {
                    return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                }
                else if (req.body.about == undefined) {
                    return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                }
                else if (req.body.category == undefined) {
                    return res.status(400).json({ success: false, error: "Категория организации должно быть заполнено" })
                }
                else if (req.body.city == undefined) {
                    return res.status(400).json({ success: false, error: "Город организации должно быть заполнено" })
                }
                else if (req.body.preparTimeMin == undefined) {
                    return res.status(400).json({ success: false, error: "Минимальное время изготовления товаров организации должно быть заполнено" })
                }
                else if (req.body.preparTimeMax == undefined) {
                    return res.status(400).json({ success: false, error: "Максимальное время изготовления товаров организации должно быть заполнено" })
                }
                else if (validator.isEmpty(req.body.name)) {
                    return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                }
                else if (validator.isEmpty(req.body.about)) {
                    return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                }
                else if (validator.isEmpty(req.body.category)) {
                    return res.status(400).json({ success: false, error: "Тип организации должен быть указан" })
                }
                else if (validator.isEmpty(req.body.city)) {
                    return res.status(400).json({ success: false, error: "Город организации должен быть указан" })
                }
                else if (validator.isEmpty(req.body.preparTimeMin)) {
                    return res.status(400).json({ success: false, error: "Минимальное время изготовления товаров организации должен быть указано" })
                }
                else if (validator.isEmpty(req.body.preparTimeMax)) {
                    return res.status(400).json({ success: false, error: "Максимальное время изготовления товаров организации должен быть указано" })
                }
                else if (!validator.matches(req.body.category, '^[012]{1}$')) {
                    return res.status(400).json({ success: false, error: "Некорректный тип организации" })
                }
                else if (!validator.matches(req.body.preparTimeMin, '^[0-9]{1,3}$')) {
                    return res.status(400).json({ success: false, error: "Некорректо указано минимальное время изготовления товаров" })
                }
                else if (!validator.matches(req.body.preparTimeMax, '^[0-9]{1,3}$')) {
                    return res.status(400).json({ success: false, error: "Некорректо указано максимальное время изготовления товаров" })
                }
                else if (Number(req.body.preparTimeMax) < Number(req.body.preparTimeMin)) {
                    return res.status(400).json({ success: false, error: "Минимальное время доставки превышает максимальное время изготовления" })
                }
                else if (!validator.matches(req.body.city, '^[a-z]{3,4}$')) {
                    return res.status(400).json({ success: false, error: "Некорректное значение города" })
                }
                else if (validator.isEmpty(req.file.path)) {
                    return res.status(400).json({ success: false, error: "Тип организации должен быть указан" })
                }
                else {
                    pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId], (err, user) => {
                        if (user.user_role != 0) {
                            var avatar = 0;
                            if (req.file) {
                                avatar = 1;
                            }
                            var image = sharp(req.file.path); // path to the stored image
                            image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
                                path.resolve(req.file.destination, 'resized', req.file.filename)
                            )  // get image metadata for size
                                .then(function (metadata) { //TODO: Потом надо будет как-то нормально обрабатывать    изображения
                                    const orgInsertString = "INSERT INTO organizations_request (name, about, owner, category, avatar, city, created, prepar_time_min, prepar_time_max) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING org_id"
                                    pool.query(orgInsertString, [req.body.name, req.body.about, decoded.userId, req.body.category, avatar, req.body.city, "NOW()", req.body.preparTimeMin, req.body.preparTimeMax], (err, orgRow) => {
                                        if (err) {
                                            console.log(err)
                                            return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                                        } else {
                                            //console.log("orgRow" + JSON.stringify(orgRow))
                                            var metaData = {
                                                'Content-Type': 'image/jpeg',
                                            }
                                            minioClient.fPutObject(
                                                "avatars-org-request",
                                                orgRow.rows[0].org_id+ ".jpeg",
                                                path.resolve(req.file.destination, 'resized', req.file.filename),
                                                metaData,
                                                (err, etag) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                                                     } else return res.status(200).json({ success: true });
                                                } 
                                                //TODO: Добавить удаление временных файлов
                                                //TODO: Добавить огранияение на количество заявок
                                                //TODO: Добавить rollback в случае ошибки
                                            );
                                        }
                                    });

                                }).catch(err => {
                                    console.log("Ошибка сохранения файла. " + err)
                                    return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                                })
                        } else {
                            console.log("Недостаточно прав для регистрации организации")
                            return res.status(400).json({ success: false, error: "Недостаточно прав для регистрации организации" })
                        }
                    })
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