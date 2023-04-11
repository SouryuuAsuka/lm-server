const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.editGood = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, error: 'Unauthorized access.' });
            } else {
                console.log("req.body.purId " + req.body.purId)
                console.log(typeof req.body.purId)
                if (validator.isEmpty(req.body.name)) {
                    res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
                }
                else if (validator.isEmpty(req.body.about)) {
                    res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
                }
                else if (!Number.isInteger(req.body.purId)) {
                    res.status(400).json({ success: false, error: "Ошибка при указании организации" })
                }
                else if (!validator.isEmpty(req.body.sum) && !validator.matches(req.body.sum, '^[1-9][0-9]*$')) {
                    console.log(typeof req.body.sum)
                    console.log(req.body.sum)
                    res.status(400).json({ success: false, error: "Некорректная сумма сбора" })
                }
                else {
                    if (decoded.userRole == 5 || decoded.userRole == 6) {
                        const orgInsertString = "UPDATE purposes SET name = $1, about = $2, sum = $3 WHERE pur_id = $4"
                        pool.query(orgInsertString, [req.body.name, req.body.about, req.body.sum, req.body.purId], (err, orgRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                            } else {
                                return res.status(200).json({ success: true });
                            }
                        });
                    } else {
                        pool.query(`
                        SELECT * FROM organizations AS org
                        JOIN purposes AS p 
                        ON org.org_id = p.org_id
                        WHERE p.pur_id = $1 AND org.owner = $2`, [req.body.purId, decoded.userId], (err, user) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                            } else {
                                const orgInsertString = "UPDATE purposes SET name = $1, about = $2, sum = $3 WHERE pur_id = $4"
                                pool.query(orgInsertString, [req.body.name, req.body.about, req.body.sum, req.body.purId], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                                    } else {
                                        return res.status(200).json({ success: true });
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