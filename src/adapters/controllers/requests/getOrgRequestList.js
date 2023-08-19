const pool = require("@database/postgresql/db");
const jwt = require('jsonwebtoken');


const getOrgRequestList = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                const userRow = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId]);
                if (userRow.rows[0] != undefined) {
                    if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                        if (req.query.p == undefined) {
                            return res.status(500).json({ error: true, message: 'Пустой запрос' });
                        } else {
                            var page = (req.query.p - 1) * 10;
                            const orgRow = await pool.query(`SELECT * FROM organizations_request OFFSET $1 LIMIT 10`, [page]);
                            var orgList = [];
                            if (orgRow.rows[0] != undefined) {
                                for (let i = 0; i < orgRow.rows.length; i++) {
                                    orgList[i] = {
                                        id: orgRow.rows[i].org_id,
                                        name: orgRow.rows[i].name,
                                        about: orgRow.rows[i].about,
                                        category: orgRow.rows[i].category,
                                        created: orgRow.rows[i].created,
                                        city: orgRow.rows[i].city,
                                        avatar: orgRow.rows[i].avatar
                                    }
                                    if (i + 1 == orgRow.rows.length) {
                                        return res.status(200).json({ orgs: orgList });
                                    }
                                }
                            } else {
                                return res.status(200).json({ orgs: [] });
                            }
                        }
                    } else {
                        return res.status(500).json({
                            error: "Ошибка при обработке запроса", //Database connection error
                        });
                    }
                } else {
                    return res.status(500).json({
                        error: "Ошибка при обработке запроса",
                    });
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = getOrgRequestList;