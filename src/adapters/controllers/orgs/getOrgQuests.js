const pool = require("@database/postgresql/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');

const getOrgQuests = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (decoded.userRole == 5 || decoded.userRole == 6) {
                    dbOrgQuests(req, res)
                } else {
                    pool.query(`
                        SELECT owner
                        FROM organizations 
                        WHERE org_id = $1`,
                        [req.params.orgId], (err, orgRow) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).json({ error: 'Ошибка поиска' });
                            } else if (orgRow.rows.length == 0) {
                                console.log('Огранизация не найдена')
                                return res.status(500).json({ error: 'Огранизация не найдена' });
                            } else if (orgRow.rows[0].owner == decoded.userId) {
                                dbOrgQuests(req, res)
                            } else {
                                console.log('Огранизация не найдена')
                                return res.status(500).json({ error: 'Огранизация не найдена' });
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
function dbOrgQuests(req, res) {
    var sclPage;
    var sclSt;
    var sclPaid;
    if (typeof req.query.p == "undefined") sclPage = 0;
    else sclPage = (Number(req.query.p) - 1) * 20;
    if (typeof req.query.st == "undefined") sclSt = '{0, 1, 2, 3, 4, 5}';
    else sclSt = "{" + req.query.st + "}";
    if (typeof req.query.paid == "undefined") sclPaid = '{true, false}';
    else sclPaid = "{" + req.query.paid + "}";
    pool.query(`SELECT COUNT(*) AS count FROM org_quests WHERE org_id = $1 AND status_code = ANY($2)`, [req.params.orgId, sclSt],  (err, count) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Ошибка поиска' });
        } else {
            pool.query(`
                SELECT 
                    qu.qu_id AS qu_id,
                    qu.order_id AS order_id,
                    qu.goods_array AS goods,
                    qu.paid AS paid,
                    qu.commission AS commission,
                    qu.status_code AS status_code,
                    o.created AS created,
                    o.date AS date
                FROM org_quests AS qu
                JOIN orders AS o
                ON o.order_id = qu.order_id
                WHERE qu.org_id = $1 AND qu.status_code = ANY($2) AND qu.paid = ANY($3)
                GROUP BY qu.qu_id, qu.order_id, qu.goods_array, qu.paid, qu.status_code, o.created, o.date
                OFFSET $4 LIMIT 20`, [req.params.orgId, sclSt, sclPaid, sclPage], (err, orgRow) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: 'Ошибка поиска' });
                } else if (orgRow.rows.length == 0) {
                    console.log("Организаций не найдено")
                    return res.status(200).json({ quests: [], count:0 });
                } else {
                    var quests = orgRow.rows;
                    var newQuests
                    newQuests = quests.map((quest) => {
                        quest.sum = 0;
                        if (Array.isArray(quest.goods)) {
                            quest.sum += Number(quest.goods.map((good) => {
                                return Number(good.num) * Number(good.price)
                            }))
                        }
                        return quest
                    })
                    return res.status(200).json({ quests: newQuests, count: count.rows[0].count });
                }
            });
        }
    })
}

module.exports = getOrgQuests;