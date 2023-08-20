const pool = require("@database/postgresql/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');

const getOrgList = async (req, res) => {
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
            org.org_id AS id, 
            org.name AS name, 
            org.about AS about, 
            org.category AS category, 
            org.avatar AS avatar, 
            org.city AS city, 
            org.public AS public, 
            (SELECT 
                json_agg( 
                    json_build_object(
                        'id', g.good_id, 
                        'name', g.name, 
                        'about',  g.about, 
                        'price',  g.price, 
                        'active', g.active, 
                        'picture', g.picture, 
                        'sold', g.sold, 
                        'created', g.created, 
                        'orders', g.orders, 
                        'cat_id', g.cat_id, 
                        'preparation_time', g.preparation_time
                    )
                )  
                FROM goods AS g 
                WHERE g.org_id = org.org_id
                GROUP BY g.org_id
            ) AS goods
            FROM organizations AS org 
            WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = true
            GROUP BY org.org_id
            OFFSET $3 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.page], (err, orgRow) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Ошибка поиска' });
        } else {
            if (orgRow.rows.length != 0) {
                var count = pool.query("SELECT COUNT(*) FROM organizations AS org WHERE org.city LIKE $1 AND org.category = ANY($2)", [sqlVar.city, sqlVar.category])
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Неверный запрос' });
                } else {
                    if (orgRow.rows.length == 0) {
                        return res.status(200).json({ orgs: [], count: 0 });
                    } else {
                        return res.status(200).json({ orgs: orgRow.rows, count: count });
                    }
                }
            } else {
                console.log("Организаций не найдено")
                return res.status(200).json({ orgs: [] });
            }
        }
    });
}

module.exports = getOrgList;