const pool = require("@database/postgresql/db");
const jwt = require('jsonwebtoken');

const signout = (req, res) => {
    // refresh the damn token
    try {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, process.env.REFRESH_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                await pool.query(`SELECT * FROM refresh_tokens WHERE user_id = $1`, [decoded.userId], (err, user) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            error: "Ошибка сервера"
                        })
                    } else if (user.rows.length == 0) {
                        console.error(err);
                        return res.status(500).json({
                            error: "Пользователь не найден"
                        })
                    } else {
                        var counter = 0;
                        var nowTime = new Date();
                        var searchSuccess = false;
                        for (let i = 0; i < user.rows.length; i++) {
                            const element = user.rows[i];
                            var createdTime = element.created;
                            var tokenCreated = new Date(createdTime);
                            var tokenTime = tokenCreated.setMonth(tokenCreated.getMonth() + 1);
                            if (element.token == refreshToken && tokenTime > nowTime) {
                                pool.query(`DELETE FROM refresh_tokens WHERE token_id = $1`, [ element.token_id ] , (err, dbResult) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).json({
                                            error: "Ошибка сервера"
                                        })
                                    } else {
                                        searchSuccess = true;
                                        return res.status(200).clearCookie('accessToken', {httpOnly: true}).clearCookie('refreshToken', {httpOnly: true}).json({ error: "" });
                                    };
                                });
                            } else if (searchSuccess == false && (i+1) == user.rows.length ) {
                                return res.status(403).json({
                                    error: "Ошибка при верификации токена", //Database connection error
                                });
                            }
                        }
                    }

                });
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = signout;