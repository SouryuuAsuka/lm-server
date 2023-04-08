const pool = require("@service/db");
const fs = require('fs');

exports.getProfileOrgList = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                if (decoded.userRole == 2 || decoded.userRole == 3 || decoded.userRole == 5 || decoded.userRole == 6) {
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
                        OFFSET $4 LIMIT 10`, [sqlVar.city, sqlVar.category, req.query.username, sqlVar.page], (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else {
                            var count = pool.query("SELECT COUNT(*) FROM organizations WHERE org.city LIKE $1 AND org.category = ANY($2) AND u.username = $3", [sqlVar.city, sqlVar.category, req.query.username])
                            if (orgRow.rows[0] != undefined) {
                                return res.status(200).json({ orgs: orgRow.rows, count: count });
                            } else {
                                console.log("Организаций не найдено")
                                return res.status(200).json({ orgs: [] });
                            }
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