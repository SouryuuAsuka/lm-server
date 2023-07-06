const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


exports.refreshToken = (req, res) => {
    // refresh the damn token
    try {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, process.env.REFRESH_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                pool.query(`SELECT 
                u.user_role AS user_role,
                r.user_id AS user_id, 
                u.email AS email,
                r.token_id AS token_id
                FROM refresh_tokens AS r 
                JOIN users AS u
                ON r.user_id = u.user_id
                WHERE r.user_id = $1 AND r.created = $2 AND r.token = $3`, [decoded.userId, decoded.date, decoded.hash], (err, user) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: "Ошибка сервера"
                        })
                    } else if (user.rows.length == 0) {
                        return res.status(500).json({
                            error: "Пользователь не найден"
                        })
                    } else {
                        var userRow = user.rows[0];
                        var nowTime = new Date();
                        var tokenCreated = new Date(decoded.date);
                        var tokenTime = tokenCreated.setMonth(tokenCreated.getMonth() + 1);

                        if (tokenTime > nowTime) {
                            var tokenHash = crypto.randomBytes(8).toString('hex');
                            var tokenDate = new Date();
                            const accessToken = jwt.sign( //Signing a jwt tsoken
                                {
                                    userId: userRow.user_id,
                                    email: userRow.email,
                                    userRole: userRow.user_role
                                },
                                process.env.ACCESS_KEY_SECRET,
                                {
                                    expiresIn: '5m'
                                }
                            );
                            const refreshToken = jwt.sign( //Signing a jwt tsoken
                                {
                                    userId: userRow.user_id,
                                    date: tokenDate,
                                    hash: tokenHash
                                },
                                process.env.REFRESH_KEY_SECRET,
                                {
                                    expiresIn: '30d'
                                }
                            );
                            pool.query(`UPDATE refresh_tokens SET (user_ip, created, token) = ($1, $2, $3) WHERE token_id = $4`, [req.ip, tokenDate, tokenHash, userRow.token_id], (err, dbResult) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({
                                        error: "Ошибка сервера"
                                    })
                                } else {
                                    res.cookie('accessToken', accessToken, {
                                        httpOnly: true,
                                    })
                                    res.cookie('refreshToken', refreshToken, {
                                        httpOnly: true,
                                    })
                                    return res.status(200).json({ error: "" });
                                }
                                ;
                            });

                        } else {
                            return res.status(500).json({
                                error: "Ошибка сервера"
                            })
                        }
                    }

                });
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}