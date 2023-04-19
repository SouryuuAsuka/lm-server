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


exports.editOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                console.log(JSON.stringify(req.body));

                if (req.body.name == undefined) {
                    return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                } else if (req.body.about == undefined) {
                    return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                } else if (req.body.category == undefined) {
                    return res.status(400).json({ success: false, error: "Категория организации должно быть заполнено" })
                } else if (req.body.city == undefined) {
                    return res.status(400).json({ success: false, error: "Город организации должно быть заполнено" })
                } else if (!Array.isArray(req.body.name)) {
                    return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                } else if (!Array.isArray(req.body.about)) {
                    return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                } else if (validator.isEmpty(req.body.category)) {
                    return res.status(400).json({ success: false, error: "Тип организации должен быть указан" })
                } else if (validator.isEmpty(req.body.city)) {
                    return res.status(400).json({ success: false, error: "Страна должна быть указана" })
                } else if (!validator.matches(req.body.category, '^[012]{1,2}$')) {
                    return res.status(400).json({ success: false, error: "Некорректный тип организации" })
                } else if (!validator.matches(req.body.city, '^[a-z]{3,4}$')) {
                    return res.status(400).json({ success: false, error: "Некорректное значение страны" })
                } else {
                    pool.query(`
                    SELECT org.org_id, org.avatar
                    FROM users AS u 
                    JOIN organizations AS org 
                    ON u.user_id = org.owner
                    WHERE u.user_id = $1 AND org.org_id = $2`, [decoded.userId, req.body.orgId], (err, orgRow1) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({ success: false, error: "Ошибка при редактировании организации" })
                        } else {
                            if (orgRow1.rows[0] != undefined) {
                                var avatar;
                                console.log("req.file "+ JSON.stringify(req.file));
                                if (req.file) {
                                    avatar = orgRow1.rows[0].avatar+1;
                                } else {
                                    avatar = orgRow1.rows[0].avatar;
                                }
                                const orgInsertString = "UPDATE organizations SET name = $1, about = $2, type = $3, avatar = $4, country = $5 WHERE owner = $6 AND org_id = $7 RETURNING org_id"
                                pool.query(orgInsertString, [req.body.name, req.body.about, req.body.type, avatar, req.body.country, decoded.userId, req.body.orgId], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({ success: false, error: "Ошибка при редактировании организации" })
                                    } else {
                                        if (req.file) {
                                            var image = sharp(req.file.path); // path to the stored image
                                            image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
                                                path.resolve(req.file.destination, 'resized', req.file.filename)
                                            ).then(function () {
                                                var metaData = {
                                                    'Content-Type': 'image/jpeg',
                                                }
                                                minioClient.fPutObject(
                                                    "avatars-org",
                                                    orgRow.rows[0].org_id + ".jpeg",
                                                    path.resolve(req.file.destination, 'resized', req.file.filename),
                                                    metaData,
                                                    (err, etag) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                                                        } else return res.status(200).json({ success: true });
                                                    }
                                                    // TODO: Добавить удаление временных файлов
                                                    //TODO: Добавить огранияение на количество заявок
                                                    //TODO: Добавить rollback в случае ошибки
                                                );
                                            })
                                        } else {
                                            return res.status(200).json({ success: true });
                                        }
                                    }
                                });
                            } else {
                                console.log("Недостаточно прав для регистрации организации")
                                return res.status(400).json({ success: false, error: "Недостаточно прав для регистрации организации" })
                            }
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