const pool = require("@database/postgresql/db");
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.setActive = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, error: 'Unauthorized access.' });
            } else {
                if (req.params.productId == undefined) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (req.body.active == undefined) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (!Number.isInteger(req.params.productId)) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                } else if (!validator.isBoolean(req.body.active)) {
                    res.status(400).json({ success: false, error: "Ошибка при указании id цели" })
                }
                else {
                    if(decoded.userRole == 5 || decoded.userRole == 6){
                        pool.query(`
                        SELECT * FROM organizations AS org
                        JOIN goods AS g
                        ON org.org_id = g.org_id
                        WHERE g.good_id = $1`, [req.params.productId], (err, user) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                            } else {
                                const purUpdateString = "UPDATE goods SET active = $1 WHERE good_id = $2"
                                pool.query(purUpdateString, [req.body.active, req.params.productId], (err, orgRow) => {
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
                        JOIN goods AS g
                        ON org.org_id = g.org_id
                        WHERE g.good_id = $1 AND org.owner = $2`, [req.params.productId, decoded.userId], (err, user) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                            } else {
                                const purUpdateString = "UPDATE goods SET active = $1 WHERE good_id = $2"
                                pool.query(purUpdateString, [req.body.active, req.params.productId], (err, orgRow) => {
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