const pool = require("@service/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.getProfileOrgList = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (decoded.userRole == 2 || decoded.userRole == 3 || decoded.userRole == 5 || decoded.userRole == 6) {
                    var sqlVar = {};
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
                        org.public AS public, 
                        org.city AS city
                        FROM organizations AS org 
                        LEFT JOIN users AS u
                        ON org.owner = u.user_id
                        WHERE org.city LIKE $1 AND org.category = ANY($2) AND u.username = $3
                        OFFSET $4 LIMIT 10`, [sqlVar.city, sqlVar.category, req.params.username, sqlVar.page], (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else {
                            pool.query(`
                                SELECT COUNT(*)  
                                FROM organizations AS org 
                                LEFT JOIN users AS u
                                ON org.owner = u.user_id
                                WHERE org.city LIKE $1 AND org.category = ANY($2) AND u.username = $3`, [sqlVar.city, sqlVar.category, req.params.username], (err, orgCount) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({ error: 'Ошибка поиска' });
                                } else if (orgRow.rows.length == 0){
                                        console.log("Организаций не найдено")
                                        return res.status(200).json({ orgs: [], count: 0 });
                                } else {
                                    var orgList =[];
                                    for (let i = 0; i < orgRow.rows.length; i++) {
                                        orgList.push({
                                            id: orgRow.rows[i].org_id,
                                            name: orgRow.rows[i].name,
                                            about: orgRow.rows[i].about,
                                            category: orgRow.rows[i].category,
                                            city: orgRow.rows[i].city,
                                            avatar: orgRow.rows[i].avatar
                                        })
                                        if (i + 1 == orgRow.rows.length) {
                                            return res.status(200).json({ orgs: orgList });
                                        }
                                    }
                                }
                            })
                        }
                    });
                } else {
                    dbOrgList(req, res, false)
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