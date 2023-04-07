const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const { getOrgFromDB } = require('@service/getOrgFromDB');

exports.getOrgRequest = async (req, res) => {
    try {
        console.log("access_toket -  " + req.cookies.accessToken);
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized access.' });
            } else {
                userRow = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId]);
                if (req.query.id == undefined) {
                    return res.status(500).json({ error: 'Получен пустой запрос' });
                } else if (userRow.rows[0].user_role != 5 && userRow.rows[0].user_role != 6) {
                    return res.status(500).json({ error: 'Недостаточно прав' });
                } else {
                    pool.query(`
                    SELECT 
                    o.org_id AS org_id,
                    o.name AS name, 
                    o.about AS about, 
                    o.avatar AS avatar, 
                    o.category AS category, 
                    o.city AS city, 
                    u.email AS email, 
                    u.firstname AS firstname, 
                    u.surname AS surname, 
                    u.telegram AS telegram,
                    t.username AS telegramUsername
                    FROM organizations_request AS o
                    LEFT JOIN users AS u
                    ON o.owner = u.user_id  
                    LEFT JOIN tg_users AS t
                    ON u.user_id = t.user_id
                    WHERE o.org_id = $1`, [req.query.id], async (err, orgRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                        } else {
                            var owner = false;
                            jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
                                if (!err) {
                                    owner = decoded.userId;
                                }
                            })
                            if (orgRow.rows[0] != undefined) {
                                const org = {
                                    orgId: orgRow.rows[0].org_id,
                                    name: orgRow.rows[0].name,
                                    about: orgRow.rows[0].about,
                                    avatar: orgRow.rows[0].avatar,
                                    category: orgRow.rows[0].category,
                                    city: orgRow.rows[0].city,
                                    email: orgRow.rows[0].email,
                                    firstname: orgRow.rows[0].firstname,
                                    surname: orgRow.rows[0].surname,
                                    telegramUsername: orgRow.rows[0].telegramUsername
                                }
                                if (orgRow.rows[0].owner == owner) {
                                    fs.readFile(__dirname + "/crypto_rates.json", async (err, data) => {
                                        var parseData = JSON.parse(data);
                                        if (err) {
                                            console.log(err);
                                            console.log(data);
                                            return res.status(500).json({ error: 'Неверный запрос' });
                                        } else {
                                            return res.status(200).json({ org: org });
                                        }
                                    })
                                } else {
                                    return res.status(200).json({ org: org });
                                }
                            } else {
                                return res.status(500).json({ "error": true, "message": 'Ошибка запроса' });
                            }
                        }
                    });
                }
            }
            //TODO: Дописать дополнительный get по id
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
async function getUserFromDb(req, res, tableName) {

}