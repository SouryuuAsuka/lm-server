const validator = require('validator');
const pool = require("@database/postgresql/db");
const tx = require("@database/postgresql/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const confirmEmail = async (req, res) => {
    try {
        var mailClientCleanKey = req.body.k;
        var mailClientToken = req.body.t;
        if (!validator.matches(mailClientToken, '^[a-zA-Z0-9]*$')) {
            res.status(400).json({ error: "Некорректные ключ валидации" })
        } else if (!validator.matches(mailClientCleanKey, '^[a-zA-Z0-9]*$')) {
            res.status(400).json({ error: "Некорректные ключ валидации" })
        } else {
            const mailToken = await pool.query(`SELECT * FROM mail_confirm_tokens WHERE mail_token= $1;`, [mailClientToken]); //Checking if user already exists

            try{
                var mailClientKey = await bcrypt.hash(mailClientCleanKey, process.env.LOCAL_MAIL_KEY_SALT);
            } catch{
                return res.status(400).json({
                    error: "Код 101. Ошибка сервера",
                });
            }
            if (mailToken.rows.length == 0) {
                return res.status(400).json({
                    error: "Код 102. Ключ валидации не найден",
                });
            } else if (mailToken.rows[0].mail_token != mailClientToken) {
                return res.status(400).json({
                    error: "Код 103. Данные валидации не верны",
                });
            } else if (mailToken.rows[0].mail_key != mailClientKey) {
                return res.status(400).json({
                    error: "Код 104. Данные валидации не верны",
                });
            } else {
                var user = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [mailToken.rows[0].user_id]);
                var userId = user.rows[0].user_id;
                var email = user.rows[0].email;
                const accessToken =  jwt.sign( //Signing a jwt tsoken
                    {
                        userId: userId,
                        email: email
                    },
                    process.env.ACCESS_KEY_SECRET, 
                    {
                        expiresIn: '5m'
                    }
                );
                const refreshToken = jwt.sign( //Signing a jwt tsoken
                    {
                        userId: userId,
                    },
                    process.env.REFRESH_KEY_SECRET,
                    {
                        expiresIn: '30d'
                    }
                );
                //const refreshToken = crypto.randomBytes(32).toString('hex');
                session = {userIp: req.ip, refreshToken: refreshToken, created: new Date()}
                
                await tx( res, "Ошибка подключения к базе данных",
                    async (client)     =>{
                        await client.query(`UPDATE users SET user_role = 1 WHERE user_id = $1 RETURNING user_id, username;`, [ mailToken.rows[0].user_id,]);
                        await client.query(`INSERT INTO refresh_tokens (user_id, user_ip, created, token) VALUES ($1, $2, $3, $4)`, [ mailToken.rows[0].user_id, session.userIp, session.created, session.refreshToken ]);
                        await client.query(`DELETE FROM mail_confirm_tokens WHERE user_id = $1;`, [ mailToken.rows[0].user_id]);
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                        })
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                        })
                        var profileLink;
                        if (user.rows[0].username != ''){
                            profileLink = user.rows[0].username;
                        } else {
                            profileLink = "id" + user.rows[0].user_id
                        }
                        return res.json({profile: profileLink})
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = confirmEmail;