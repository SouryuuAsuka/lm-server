const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.newPurpose = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                console.log("req.body.orgId "+ req.body.orgId)
                console.log(typeof req.body.orgId)
                if (validator.isEmpty(req.body.name)) {
                    return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                }
                else if (validator.isEmpty(req.body.about)) {
                    return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                }
                else if (!Number.isInteger(req.body.orgId)) {
                    return res.status(400).json({ success: false, error: "Ошибка при указании организации" })
                }
                else if (!validator.isEmpty(req.body.sum) && !validator.matches(req.body.sum, '^[1-9][0-9]*$')) {
                    console.log(typeof req.body.sum)
                    console.log(req.body.sum)
                    return res.status(400).json({ success: false, error: "Некорректная сумма сбора" })
                }
                else {
                    pool.query(`SELECT * FROM organizations WHERE org_id = $1`, [req.body.orgId], (err, user) => {
                        if (user.rows[0].owner == decoded.userId) {
                            const orgInsertString = "INSERT INTO purposes (name, about, org_id, sum, created) VALUES ($1, $2, $3, $4, $5)"
                            pool.query(orgInsertString, [req.body.name, req.body.about, req.body.orgId, req.body.sum, "NOW()"], (err, orgRow) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                                } else {
                                    return res.status(200).json({ success: true });
                                }
                            });

                        } else {
                            console.log("Недостаточно прав для создания цели")
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