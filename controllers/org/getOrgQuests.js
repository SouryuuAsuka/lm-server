const pool = require("@service/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');

var sqlVar = {};
/*if(all) sqlVar.public = "{true, false}"
else sqlVar.public = "{true}"*/

exports.getOrgQuests = async (req, res) => {
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
                        [req.query.id], (err, orgRow) => {
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
    if (typeof req.query.p == "undefined") sclPage = 0;
    else sclPage = (Number(req.query.p) - 1) * 10;
    if (typeof req.query.st == "undefined") sclSt = '{0, 1, 2, 3, 4, 5}';
    else sclSt = "{" + req.query.st + "}";
    pool.query(`
        SELECT 
            COUNT(*) AS count,
            qu.qu_id AS qu_id,
            qu.order_id AS order_id,
            qu.goods_array AS goods,
            qu.paid AS paid,
            qu.status_code AS status_code,
            o.created AS created,
            o.date AS date
        FROM org_quests AS qu
        JOIN orders AS o
        ON o.order_id = qu.order_id
        WHERE qu.org_id = $1 AND qu.status_code = ANY($2)
        GROUP BY qu_id, order_id, goods, paid, status_code, created, date
        OFFSET $3 LIMIT 10`, [req.query.id, sclSt, sclPage], (err, orgRow) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Ошибка поиска' });
        } else if (orgRow.rows.length == 0) {
            console.log("Организаций не найдено")
            return res.status(200).json({ orgs: [] });
        } else {
            var quests = orgRow.rows;
            var newQuests
            newQuests = quests.map((quest) => {
                quest.sum = 0;
                quest.sum += Number(quest.goods.map((good) => {
                    return Number(good.num) * Number(good.price)
                }))
                return quest
            })
            return res.status(200).json({ quests: newQuests });
        }
    });
}