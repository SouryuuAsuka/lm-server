const validator = require('validator');
const pool = require("@service/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.signin = async (req, res) => {
    try {
        const login = req.body.login;
        console.log("login " + login)
        var user;
        if (validator.isEmail(login)) {
            user = await pool.query(`SELECT * FROM users WHERE email = $1`, [login])
        } else if (validator.matches(login, '^[a-zA-Z0-9_.-]*$')) {
            user = await pool.query(`SELECT * FROM users WHERE username = $1`, [login])
        } else {
            return res.json({ error: true, resText: "Пользователь не найден" })
        }
        bcrypt.hash(req.body.password, user.rows[0].pass_salt, (err, hash) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Код: 101. Ошибка сервера",
                });
            } else {
                bcrypt.hash(hash, process.env.LOCAL_PASS_SALT, async (err2, hash2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).json({
                            error: "Код: 101. Ошибка сервера",
                        });
                    } else {
                        if (hash2 == user.rows[0].password) {
                            var userId = user.rows[0].user_id;
                            var email = user.rows[0].email;
                            var tokenHash = crypto.randomBytes(8).toString('hex');
                            var tokenDate = new Date();
                            const accessToken = jwt.sign( //Signing a jwt tsoken
                                {
                                    userId: userId,
                                    email: email,
                                    userRole: user.rows[0].user_role

                                },
                                process.env.ACCESS_KEY_SECRET,
                                {
                                    expiresIn: '5m'
                                }
                            );
                            const refreshToken = jwt.sign( //Signing a jwt tsoken
                                {
                                    userId: userId,
                                    date: tokenDate,
                                    hash: tokenHash
                                },
                                process.env.REFRESH_KEY_SECRET,
                                {
                                    expiresIn: '30d'
                                }
                            );
                            await pool.query(`INSERT INTO refresh_tokens (user_id, user_ip, created, token) VALUES ($1, $2, $3, $4)`, [userId, req.ip, tokenDate, tokenHash]);

                            res.cookie('accessToken', accessToken, {
                                domain: 'lampymarket.com',
                                httpOnly: true,
                            })
                            res.cookie('refreshToken', refreshToken, {
                                domain: 'lampymarket.com',
                                httpOnly: true,
                            })
                            var profileLink;
                            if (user.rows[0].username != '') {
                                profileLink = user.rows[0].username;
                            } else {
                                profileLink = "id" + user.rows[0].user_id
                            }
                            return res.status(200).json({ success: true, profile: profileLink });
                        } else { //TODO: ограничить количество вводов пароля
                            res.status(500).json({
                                error: "Пароль неверен", //Database connection error
                            });
                        }

                    }
                })
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