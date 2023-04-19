const pool = require("@service/db");
const tbot = require("@service/tbot_axios");
const minioClient = require("@service/minio");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const tx = require("@service/tx");


exports.orgConfirm = async (req, res) => {
    try {//TODO: Модифицировать middleware функцию, чтобы не вызывать jwf.verify дважды за запрос
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            console.log("начало проверки")
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if (req.body.requestId == undefined) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
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
                    WHERE o.org_id = $1`, [req.body.requestId], (err, userRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                    } else {
                        tx(res, "Ошибка подключения к базе данных",
                            async (client) => {
                                var newOrgRow = await client.query(
                                    `INSERT INTO organizations (owner, name, about, category, created, avatar, city) 
                                    SELECT organizations_request.owner, organizations_request.name, organizations_request.about, organizations_request.category, organizations_request.created, organizations_request.avatar, organizations_request.city
                                    FROM organizations_request
                                    WHERE organizations_request.org_id = $1
                                    RETURNING organizations.org_id, organizations.owner`, [req.body.requestId]);
                                await client.query(`DELETE FROM organizations_request WHERE org_id = $1;`, [req.body.requestId]);
                                await client.query(`UPDATE users SET user_role = 3 WHERE user_id = $1;`, [newOrgRow.rows[0].owner]);
                                minioClient.copyObject('avatars-org', newOrgRow.rows[0].org_id + ".jpeg", '/avatars-org-request/' + req.body.requestId + ".jpeg", function (e, data) {
                                    if (e) {
                                        console.log(e);
                                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                                    } else {
                                        minioClient.removeObject('avatars-org-request', req.body.requestId + ".jpeg", function (err) {
                                            if (err) {
                                                console.log('Unable to remove object', err)
                                                return res.status(500).json({ error: "Ошибка при сохранении аватара" });
                                            } else {
                                                var msgText = "Ваша заявка принята!\nПерейдите на сайт lampymarket.com и войдите в свой аккаунт. В разделе \"Мои огранизации\" мы можете выбрать созданную организацию и добавить туда ваши товары.\nПосле заполнения организации свяжитесь с модераторми для того, чтобы ее сделали доступной для клиентов";
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
                                            }
                                        })
                                    }
                                })
                            });
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