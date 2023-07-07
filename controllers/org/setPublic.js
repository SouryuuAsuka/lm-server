const path = require("path")
const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const validator = require('validator');
const sharp = require('sharp');

exports.setPublic = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (req.body.orgId == undefined) {
                    return res.status(400).json({ success: false, error: "ID организации должно быть заполнено" })
                } else if (req.body.public == undefined) {
                    return res.status(400).json({ success: false, error: "Статус организации должен быть заполнено" })
                } else if (isNaN(req.body.orgId)) {
                    return res.status(400).json({ success: false, error: "ID организации заполнено некорректно" })
                } else {
                    if (decoded.userRole == 5 || decoded.userRole == 6) {
                        const orgInsertString = "UPDATE organizations SET public = $1 WHERE org_id = $2"
                        pool.query(orgInsertString, [req.body.public, req.body.orgId], (err, orgRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Ошибка при редактировании организации" })
                            } else {
                                return res.status(200).json({ success: true });
                            }
                        });
                    } else {
                        console.log(JSON.stringify(req.body))
                        const orgInsertString = "UPDATE organizations SET public = $1 WHERE owner = $2 AND org_id = $3"
                        pool.query(orgInsertString, [req.body.public, decoded.userId, req.body.orgId], (err, orgRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Ошибка при редактировании организации" })
                            } else {
                                return res.status(200).json({ success: true });
                            }
                        });
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