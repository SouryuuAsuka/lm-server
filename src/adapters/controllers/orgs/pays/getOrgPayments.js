const pool = require("@database/postgresql/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');


const getOrgPayments = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                var page;
                if (typeof req.query.p == "undefined") page = '0';
                else page = (req.query.p - 1) * 10;
                if (decoded.userRole == 5 || decoded.userRole == 6) {
                    pool.query(`
                        SELECT 
                            COUNT(*) AS count,
                            u.username AS payername,
                            p.pay_id AS pay_id,
                            p.usd_sum AS usd_sum,
                            p.canceled AS canceled,
                            p.created AS created
                        FROM org_payments AS p
                        LEFT JOIN users AS u                            
                        ON p.payer_id = u.user_id
                        WHERE p.org_id = $1
                        GROUP BY p.pay_id, u.user_id
                        OFFSET $2 LIMIT 10`, [req.params.orgId, page], (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else if( orgRow.rows.length == 0){
                            console.log("Организаций не найдено")
                            return res.status(200).json({ orgs: [] });
                        } else {
                            return res.status(200).json({ orgs: orgRow.rows });
                        }
                    });
                } else {
                    pool.query(`
                    SELECT owner
                    FROM organizations 
                    WHERE org_id = $1`, [req.params.orgId], (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else {
                            if (orgRow.rows[0].owner == decoded.userId){
                                pool.query(`
                                SELECT 
                                    COUNT(*) AS count,
                                    p.pay_id AS pay_id,
                                    p.usd_sum AS usd_sum,
                                    p.canceled AS canceled,
                                    p.created AS created
                                FROM org_payments AS p
                                WHERE p.org_id = $1
                                GROUP BY p.pay_id
                                OFFSET $2 LIMIT 10`, [req.params.orgId, page], (err, orgRow) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({ error: 'Ошибка поиска' });
                                } else if( orgRow.rows.length == 0){
                                    console.log("Организаций не найдено")
                                    return res.status(200).json({ orgs: [] });
                                } else {
                                    return res.status(200).json({ orgs: orgRow.rows });
                                }
                            });
                            } else {
                                return res.status(400).json({ success: false, error: "Недостаточно доступа для запроса" })
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

module.exports = getOrgPayments;