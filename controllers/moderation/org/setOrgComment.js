const pool = require("@service/db");
const tbot = require("@service/tbot_axios");
const jwt = require('jsonwebtoken');

exports.setOrgComment = async (req, res) => {
    try {//TODO: Модифицировать middleware функцию, чтобы не вызывать jwf.verify дважды за запрос
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            console.log("начало проверки")
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if (req.body.orgId == undefined) {
                return res.status(401).json({ error: true, message: 'Id организации не задан' });
            } else if (decoded.userRole != 5 && decoded.userRole != 6) {
                return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
            } else {
                pool.query(`
                    SELECT * 
                    FROM organizations_request AS o
                    LEFT JOIN users AS u
                    ON o.owner = u.user_id
                    LEFT JOIN tg_tech_users AS t
                    ON u.user_id = t.user_id
                    WHERE o.org_id = $1`, [req.body.orgId], async (err, userRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                    } else {
                        pool.query(
                            `UPDATE organizations_request SET moderator_comment = $1 WHERE org_id = $2;`, [req.body.comment, req.body.orgId], (err, orgRow) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({ error: "Ошибка при обработке запроса" });
                                } else {
                                    if (req.body.comment != "") {
                                        var msgText = "Ваша заявка на создание организации обновлена!\nПолучен комментарий от модератора:\n" + req.body.comment;
                                        tbot.post('sendmsg', {
                                            key: process.env.TBOT_ACCESS_KEY,
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

                                    } else {
                                        return res.status(200).json({});
                                    }

                                }
                            }
                        );
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