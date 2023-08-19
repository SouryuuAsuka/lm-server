const pool = require("@database/postgresql/db");
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                const userRow = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId]);
                if (userRow.rows[0] != undefined) {
                    const user = {
                        id: userRow.rows[0].user_id,
                        username: userRow.rows[0].username,
                        email: userRow.rows[0].email,
                        firstname: userRow.rows[0].firstname,
                        surname: userRow.rows[0].surname,
                        userRole: userRow.rows[0].user_role,
                        regtime: userRow.rows[0].regtime,
                        techTelegram: userRow.rows[0].tech_telegram,
                        telegram: userRow.rows[0].telegram,
                        avatar: userRow.rows[0].avatar,
                        tgCode: null,
                        tgUsername: null
                    }
                    if (!userRow.rows[0].tech_telegram) {
                        var salt = userRow.rows[0].pass_salt;
                        user.tgCode = salt.substring(salt.length - 6)
                        return res.status(200).json({ user: user });
                    } else {
                        const tgUserRow = await pool.query(`SELECT * FROM tg_tech_users WHERE user_id = $1`, [userRow.rows[0].user_id]);
                        if (tgUserRow.rows[0] != undefined) {
                            user.tgUsername = tgUserRow.rows[0].username;
                            return res.status(200).json({ user: user });
                        } else {
                            return res.status(500).json({ error: true, message: 'Ошибка при поиске пользователя' });
                        }
                    }
                } else {
                    return res.status(401).json({ error: true, message: 'Unauthorized access.' });

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

module.exports = getUser;