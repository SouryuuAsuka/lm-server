const pool = require("@service/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.getOrgList = async (req, res) => {
    try {
        dbOrgList(req, res)
        /*if (req.cookies.accessToken != undefined){
            jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
                if (err) {
                    return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
                } else {
                    if (decoded.userRole ==  2 || decoded.userRole ==  3 || decoded.userRole == 5 || decoded.userRole == 6) {
                        dbOrgList(req, res, false)
                    } else {
                        dbOrgList(req, res, false)
                    }
                }
            })
        } else {
            dbOrgList(req, res)
        }*/

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
function dbOrgList(req, res) {
    var sqlVar = {};
    /*if(all) sqlVar.public = "{true, false}"
    else sqlVar.public = "{true}"*/
    if (req.query.p == undefined) sqlVar.page = '0';
    else sqlVar.page = (req.query.p - 1) * 10;
    if (req.query.c == undefined) sqlVar.city = '%';
    else sqlVar.city = req.query.c;
    if (req.query.t == undefined) sqlVar.category = '{0, 1, 2}';
    else sqlVar.category = "{" + req.query.t + "}";
    pool.query(`
            SELECT 
            org.org_id AS org_id, 
            org.name AS name, 
            org.about AS about, 
            org.category AS category, 
            org.avatar AS avatar, 
            org.city AS city, 
            org.public AS public, 
                json_agg(
                    ROW(
                        g.good_id,
                        g.name,
                        g.about,
                        g.price,
                        g.active,
                        g.picture,
                        g.sold,
                        g.orders,
                        g.min_time,
                        g.max_time
                    )
                
                ORDER BY g.created DESC
            ) AS goods
            FROM organizations AS org 
                JOIN goods AS g
            ON g.good_id = (
                SELECT g1.good_id FROM goods AS g1
                WHERE g1.org_id = org.org_id AND g1.active = true
                ORDER BY g1.created DESC
            )
            WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = true
            GROUP BY org.org_id
            OFFSET $3 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.page], (err, orgRow) => {
        if (err) {

            console.log(err)
            return res.status(500).json({ error: 'Ошибка поиска' });
        } else {
            var orgList = [];
            if (orgRow.rows.length != 0) {
                var count = pool.query("SELECT COUNT(*) FROM organizations AS org WHERE org.city LIKE $1 AND org.category = ANY($2)", [sqlVar.city, sqlVar.category])
                fs.readFile(__dirname + "/../../service/exchange_rates.json", "utf8", (err, data) => {
                    console.log(data)
                    parseData = JSON.parse(data);
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Неверный запрос' });
                    } else {
                        if (orgRow.rows.length == 0) {
                            return res.status(200).json({ orgs: [], count: 0 });
                        } else {
                            console.log(JSON.stringify(orgRow.rows))
                            for (let i = 0; i < orgRow.rows.length; i++) {
                                orgList.push({
                                    id: orgRow.rows[i].org_id,
                                    name: orgRow.rows[i].name,
                                    about: orgRow.rows[i].about,
                                    category: orgRow.rows[i].category,
                                    city: orgRow.rows[i].city,
                                    avatar: orgRow.rows[i].avatar,
                                    goods: []
                                })
                                for (let j = 0; j < orgRow.rows[i].goods.length; j++) {
                                    orgList[i].goods.push({
                                        id: orgRow.rows[i].goods[j].good_id,
                                        name: orgRow.rows[i].goods[j].name,
                                        about: orgRow.rows[i].goods[j].about,
                                        sum: orgRow.rows[i].goods[j].sum,
                                        active: orgRow.rows[i].goods[j].active,
                                        picture: orgRow.rows[i].goods[j].picture,
                                        sold: orgRow.rows[i].goods[j].sold,
                                        min_time: orgRow.rows[i].goods[j].min_time,
                                        max_time: orgRow.rows[i].goods[j].max_time
                                    })
                                    if (i + 1 == orgRow.rows.length && j + 1 == orgRow.rows[i].goods.length) {
                                        return res.status(200).json({ orgs: orgList, count: count });
                                    }
                                }
                            }
                        }

                    }
                })
            } else {
                console.log("Организаций не найдено")
                return res.status(200).json({ orgs: [] });
            }
        }
    });

}