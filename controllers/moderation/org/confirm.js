const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var Minio = require('minio');
const tx = require("@service/tx");

const minioClient  = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

exports.orgConfirm = async (req, res) => {
    try {//TODO: Модифицировать middleware функцию, чтобы не вызывать jwf.verify дважды за запрос
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            console.log("начало проверки")
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if(req.body.requestId==undefined){
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId], (err, userRow) => {
                    if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                        tx(res, "Ошибка подключения к базе данных",
                            async (client) => {
                                
                                var newOrgRow = await client.query(
                                    `INSERT INTO organizations (owner, name, about, category, created, avatar, city) 
                                    SELECT organizations_request.owner, organizations_request.name, organizations_request.about, organizations_request.category, organizations_request.created, organizations_request.avatar, organizations_request.city
                                    FROM organizations_request
                                    WHERE organizations_request.org_id = $1
                                    RETURNING organizations.org_id, organizations.owner`, [req.body.requestId]);
                                await client.query(`DELETE FROM organizations_request WHERE org_id = $1;`, [req.body.requestId]);
                                await client.query(`UPDATE users SET user_role = 3 WHERE user_id = $1;`, [newOrgRow.rows[0].user_id]);
                                minioClient.copyObject('avatars-org', newOrgRow.rows[0].org_id+".jpeg", '/avatars-org-request/'+req.body.requestId+".jpeg", function(e, data) {
                                    if (e) {
                                        console.log(e);
                                        return res.status(500).json({ error: "Ошибка при обработке запроса"});
                                    } else {
                                        minioClient.removeObject('avatars-org-request', req.body.requestId+".jpeg", function(err) {
                                            if (err) {
                                              return console.log('Unable to remove object', err)
                                            } else {
                                                console.log('Removed the object')
                                                return res.status(200).json({});
                                            }
                                          })
                                    }
                                    console.log("Successfully copied the object:")
                                    console.log("etag = " + data.etag + ", lastModified = " + data.lastModified)
                                  })
                            });
                    } else {
                        return res.status(500).json({
                            error: "Недостаточно прав для совершения операции", //Database connection error
                        });
                    }

                })
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Ошибка при обработке запроса"});
    };
}