const pool = require("@database/postgresql/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');


const newOrgPayment = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (decoded.userRole == 5 || decoded.userRole == 6) {
                    pool.query(`
                        UPDATE org_quests
                        SET paid=true
                        WHERE qu_id = ANY($1) AND paid=false AND status_code=5 RETURNING goods_array, commission`, 
                        [req.body.quests], (err, quRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else {
                            var sum = 0
                            quRow.rows.map((quest) => {
                                var quSum = 0
                                quest.goods_array.map((good) => {
                                    quSum += Number(good.price)*Number(good.num)
                                })
                                sum += Math.floor((quSum * (1 - (Number(quest.commission) / 100)))*100)/100
                            })
                            pool.query(`
                                INSERT INTO org_payments
                                (org_id, created, payer_id, ord_array, usd_sum)
                                VALUES ($1, $2, $3, $4, $5)`,
                                [req.body.orgId, "NOW()", decoded.userId, req.body.quests, sum.toFixed(1)], (err, orgRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(500).json({ error: 'Ошибка поиска' });
                                    } else {
                                        return res.status(200).json({text: "Зарегистрирована выплата в "+sum+" GEL"});
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

module.exports = newOrgPayment;