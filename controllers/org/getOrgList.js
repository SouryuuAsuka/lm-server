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
            g.good_id AS good_id,
            g.name AS good_name,
            g.about AS good_about,
            g.price AS good_price,
            g.active AS good_active,
            g.picture AS good_picture,
            g.sold AS good_sold,
            g.orders AS good_orders,
            g.min_time AS good_min_time,
            g.max_time AS good_max_time
            FROM organizations AS org 
            LEFT JOIN goods AS g
            ON g.good_id = (
                SELECT g1.good_id FROM goods AS g1
                WHERE g1.org_id = org.org_id AND g1.active = true
                ORDER BY created DESC
                LIMIT 5)
            WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = true
            OFFSET $3 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.page], (err, orgRow) => {
        if (err) {

            console.log(err)
            return res.status(500).json({ error: 'Ошибка поиска' });
        } else {
            var count = pool.query("SELECT COUNT(*) FROM organizations  WHERE org.city LIKE $1 AND org.category = ANY($2)")
            var orgList = [];
            if (orgRow.rows[0] != undefined) {
                fs.readFile(__dirname + "/../../service/exchange_rates.json", "utf8", (err, data) => {
                    console.log(data)
                    parseData = JSON.parse(data);
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Неверный запрос' });
                    } else {
                        for (let i = 0; i < orgRow.rows.length; i++) {
                            var checkpoint = false;
                            if (orgList.length == 0) {
                                orgList.push({
                                    id: orgRow.rows[i].org_id,
                                    name: orgRow.rows[i].name,
                                    about: orgRow.rows[i].about,
                                    category: orgRow.rows[i].category,
                                    city: orgRow.rows[i].city,
                                    avatar: orgRow.rows[i].avatar
                                })
                                if (orgRow.rows[i].good_id != null) {
                                    orgList[j].goods.push({
                                        id: orgRow.rows[i].good_id,
                                        name: orgRow.rows[i].good_name,
                                        about: orgRow.rows[i].good_about,
                                        sum: orgRow.rows[i].good_sum,
                                        active: orgRow.rows[i].good_active,
                                        picture: orgRow.rows[i].good_picture,
                                        sold: orgRow.rows[i].good_sold
                                    })
                                }
                                if (orgRow.rows[i].length == 1) {
                                    return res.status(200).json({ orgs: orgList, count: count });
                                }
                            } else {
                                for (let j = 0; j < orgList.length; j++) {
                                    if (orgRow.rows[i].org_id == orgList[j].org_id) {
                                        orgList[j].goods.push({
                                            id: orgRow.rows[i].good_id,
                                            name: orgRow.rows[i].good_name,
                                            about: orgRow.rows[i].good_about,
                                            sum: orgRow.rows[i].good_sum,
                                            active: orgRow.rows[i].good_active,
                                            picture: orgRow.rows[i].good_picture,
                                            sold: orgRow.rows[i].good_sold
                                        })
                                        checkpoint = true;
                                    } else if (j + 1 == orgList.length && !checkpoint) {
                                        orgList.push({
                                            id: orgRow.rows[i].org_id,
                                            name: orgRow.rows[i].name,
                                            about: orgRow.rows[i].about,
                                            category: orgRow.rows[i].category,
                                            city: orgRow.rows[i].city,
                                            avatar: orgRow.rows[i].avatar,
                                            goods: []

                                        })
                                        if (orgRow.rows[i].good_id != null) {
                                            orgList[j].goods.push({
                                                id: orgRow.rows[i].good_id,
                                                name: orgRow.rows[i].good_name,
                                                about: orgRow.rows[i].good_about,
                                                sum: orgRow.rows[i].good_sum,
                                                active: orgRow.rows[i].good_active,
                                                picture: orgRow.rows[i].good_picture,
                                                public: orgRow.rows[i].public,
                                                sold: orgRow.rows[i].good_sold
                                            })
                                        }
                                    }
                                    if (i + 1 == orgRow.rows.length && j + 1 == orgList.length) {
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