const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.setActive = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, error: 'Unauthorized access.' });
            } else {
                if (req.body.purId == undefined) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (req.body.active == undefined) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (!Number.isInteger(req.body.purId)) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (!validator.isBoolean(req.body.active)) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                }
                else {
                    if(decoded.userRole == 5 || decoded.userRole == 6){
                        pool.query(`
                        SELECT * FROM organizations AS org
                        JOIN purposes AS p 
                        ON org.org_id = p.org_id
                        WHERE p.pur_id = $1`, [req.body.purId], (err, user) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                            } else {
                                const purUpdateString = "UPDATE purposes SET active = $1 WHERE pur_id = $2"
                                pool.query(purUpdateString, [req.body.active, req.body.purId], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({ success: false, error: "Ошибка при создании организации" })
                                    } else {
                                        return res.status(200).json({ success: true });
                                    }
                                });
                            }
                        })
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
                                const purUpdateString = "UPDATE purposes SET active = $1 WHERE pur_id = $2"
                                pool.query(purUpdateString, [req.body.active, req.body.purId], (err, orgRow) => {
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