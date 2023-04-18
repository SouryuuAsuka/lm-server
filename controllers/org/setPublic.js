const path = require("path")
const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const validator = require('validator');
const sharp = require('sharp');

exports.editOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (req.body.orgId == undefined) {
                    return res.status(400).json({ success: false, error: "ID организации должно быть заполнено" })
                } else if (req.body.active == undefined) {
                    return res.status(400).json({ success: false, error: "Статус организации должен быть заполнено" })
                } else if (isNaN(req.body.orgId)) {
                    return res.status(400).json({ success: false, error: "ID организации заполнено некорректно" })
                } else {
                    const orgInsertString = "UPDATE organizations SET active = $1, about = $2, type = $3, avatar = $4, country = $5 WHERE owner = $6 AND org_id = $7 RETURNING org_id"
                    pool.query(orgInsertString, [req.body.name, req.body.about, req.body.type, avatar, req.body.country, decoded.userId, req.body.orgId], (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({ success: false, error: "Ошибка при редактировании организации" })
                        } else {
                            return res.status(200).json({ success: true });
                        }
                    });
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