const pool = require("@service/db");
const fs = require('fs');

exports.getOrgList = async (req, res) => {
    try {
        if (req.cookies.accessToken != undefined){
            jwt.verify(refreshToken, process.env.REFRESH_KEY_SECRET, async function (err, decoded) {
                if (err) {
                    return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
                } else {
                    if (decoded.userRole ==  2 || decoded.userRole ==  3 || decoded.userRole == 5 || decoded.userRole == 6) {
                        dbOrgList(true)
                    } else {
                        dbOrgList(false)
                    }
                }
            })
        } else {
            dbOrgList(false)
        }
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
function dbOrgList(all) {
    var sqlVar = {};
        if(all) sqlVar.public = "{true, false}"
        else sqlVar.public = "{true}"
        if (req.query.p == undefined) sqlVar.page = '0';
        else sqlVar.page = (req.query.p - 1) * 10;
        if (req.query.c == undefined) sqlVar.city = '%';
        else sqlVar.city = req.query.c;
        if (req.query.t == undefined) sqlVar.category = '{0, 1, 2}';
        else sqlVar.category = "{"+req.query.t+"}";
        pool.query(`
            SELECT 
            org.org_id AS org_id, 
            org.name AS name, 
            org.about AS about, 
            org.category AS category, 
            org.avatar AS avatar, 
            org.city AS city, 
            p.prod_id AS prod_id,
            p.name AS prod_name,
            p.about AS prod_about,
            p.sum AS prod_sum,
            p.active AS prod_active,
            p.currency AS prod_currency,
            p.picture AS prod_picture,
            p.sold AS prod_sold
            FROM organizations AS org 
            LEFT JOIN goods AS p
            ON p.prod_id = (
                SELECT p1.prod_id FROM goods AS p1
                WHERE p1.org_id = org.org_id AND p1.active = true
                ORDER BY created DESC
                LIMIT 5)
            WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = ANY($3)
            OFFSET $4 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.public, sqlVar.page], (err, orgRow) => {
            if (err) {

                console.log(err)
                return res.status(500).json({ error: 'Ошибка поиска' });
            } else {
                var count = pool.query("SELECT COUNT(*) FROM organizations")
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
                                for (let j = 0; j < orgList.length; j++) {
                                    if (orgRow.rows[i].org_id == orgList[j].org_id){
                                        orgList[j].goods.push({
                                            id: orgRow.rows[i].prod_id,
                                            name: orgRow.rows[i].prod_name,
                                            about: orgRow.rows[i].prod_about,
                                            sum: orgRow.rows[i].prod_sum,
                                            active: orgRow.rows[i].prod_active,
                                            picture: orgRow.rows[i].prod_picture,
                                            sold: orgRow.rows[i].prod_sold
                                        })
                                        checkpoint = true;
                                    } else if(j+1 == orgList.length && !checkpoint) {
                                        orgList.push({
                                            id: orgRow.rows[i].org_id,
                                            name: orgRow.rows[i].name,
                                            about: orgRow.rows[i].about,
                                            category: orgRow.rows[i].category,
                                            city: orgRow.rows[i].city,
                                            avatar: orgRow.rows[i].avatar,
                                            goods: []
                   
                                        })
                                        orgList[j].goods.push({
                                            id: orgRow.rows[i].prod_id,
                                            name: orgRow.rows[i].prod_name,
                                            about: orgRow.rows[i].prod_about,
                                            sum: orgRow.rows[i].prod_sum,
                                            active: orgRow.rows[i].prod_active,
                                            picture: orgRow.rows[i].prod_picture,
                                            sold: orgRow.rows[i].prod_sold
                                        })
                                    }
                                    if (i + 1 == orgRow.rows.length && j+1 == orgList.length) {
                                        return res.status(200).json({ orgs: orgList, count: count });
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