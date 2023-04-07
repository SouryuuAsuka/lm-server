const pool = require("@service/db");
const cbot = require("@service/cbot_axios");
const jwt = require('jsonwebtoken');

exports.setOrgComment = async (req, res) => {
    try {//TODO: Модифицировать middleware функцию, чтобы не вызывать jwf.verify дважды за запрос
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            console.log("начало проверки")
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if (req.body.requestId == undefined) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                pool.query(`
                    SELECT * 
                    FROM users AS u
                    LEFT JOIN tg_users AS t
                    ON u.user_id = t.user.id
                    WHERE user_id = $1`, [decoded.userId], async (err, userRow) => {
                    if (err) {
                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                    } else {
                        if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                            pool.query(
                                `UPDATE organizations_request SET moderator_comment = $1 WHERE org_id = $2;`, [req.body.comment, req.body.orgId], (err, orgRow) => {
                                if (err) {
                                    return res.status(500).json({ error: "Ошибка при обработке запроса" });
                                } else {
                                    var msgText = "Ваша заявка на создание организации обновлена!\nПолучен комментарий от модератора:\n"+req.body.comment  ;
                                    cbot.post('sendmsg', {
                                        key: process.env.CBOT_ACCESS_KEY,
                                        id: userRow.rows[0].app_id,
                                        text: msgText
                                    })
                                    .then(() => {
                                        console.log('Removed the object')
                                        return res.status(200).json({});
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                        return res.status(500).json({ error: "Ошибка при отправке сообщения в бот" });
                                    })
                                }
                            });
                        } else {
                            return res.status(500).json({
                                error: "Недостаточно прав для совершения операции", //Database connection error
                            });
                        }
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Ошибка при обработке запроса" });
    };
}