const pool = require("@database/postgresql/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');


const cancelOrgPayment = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (decoded.userRole == 5 || decoded.userRole == 6) {
                    pool.query(`
                    UPDATE org_payments
                    SET canceled = true
                    WHERE pay_id = $1 RETURNING ord_array`,
                        [req.params.orgId], (err, payRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).json({ error: 'Ошибка поиска' });
                            } else {
                                pool.query(`
                                    UPDATE org_quests
                                    SET paid=false
                                    WHERE qu_id = ANY($1)`,
                                    [payRow.rows[0].ord_array], (err, quRow) => {
                                        if (err) {
                                            console.log(err)
                                            return res.status(500).json({ error: 'Ошибка поиска' });
                                        } else {
                                            return res.status(200).json({ text: "Отменена выплата №" + req.params.orgId });
                                        }
                                    });
                            }
                        });

                } else {
                    return res.status(400).json({ "error": true, "message": 'Unauthorized access.' });
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
module.exports = cancelOrgPayment;