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
            } else if (req.params.requestId == undefined) {
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
                    WHERE o.org_id = $1`, [req.params.requestId], (err, userRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                    } else {
                        tx(res, "Ошибка подключения к базе данных",
                            async (client) => {
                                var newOrgRow = await client.query(
                                    `INSERT INTO organizations AS o (owner, name, about, category, created, avatar, country, city, street, house, flat) 
                                    SELECT org_r.owner, org_r.name, org_r.about, org_r.category, org_r.created, org_r.avatar, org_r.country, org_r.city, org_r.street, org_r.house, org_r.flat
                                    FROM organizations_request AS org_r
                                    WHERE org_r.org_id = $1
                                    RETURNING o.org_id, o.owner`, [req.params.requestId]);
                                await client.query(`DELETE FROM organizations_request WHERE org_id = $1;`, [req.params.requestId]);
                                await client.query(`UPDATE users SET user_role = 3 WHERE user_id = $1;`, [newOrgRow.rows[0].owner]);
                                minioClient.copyObject('avatars-org', newOrgRow.rows[0].org_id + ".jpeg", '/avatars-org-request/' + req.params.requestId + ".jpeg", function (e, data) {
                                    if (e) {
                                        console.log(e);
                                        return res.status(500).json({ error: "Ошибка при обработке запроса" });
                                    } else {
                                        minioClient.removeObject('avatars-org-request', req.params.requestId + ".jpeg", function (err) {
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