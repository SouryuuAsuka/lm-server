const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.getOrgFromDB = async (req, tableName, res) => {

    pool.query(`
        SELECT * FROM ${tableName} AS t
        LEFT JOIN users AS u
            ON p.prod_id = (
        WHERE org_id = $1`, [req.query.id], async (err, orgRow) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
        } else {
            var owner = false;
            jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
                if (!err) {
                    owner = decoded.userId;
                }
            })
            if (orgRow.rows[0] != undefined) {
                const org = {
                    orgId: orgRow.rows[0].org_id,
                    name: orgRow.rows[0].name,
                    about: orgRow.rows[0].about,
                    owner: orgRow.rows[0].owner,
                    avatar: orgRow.rows[0].avatar,
                    category: orgRow.rows[0].category,
                    city: orgRow.rows[0].city
                }
                if (orgRow.rows[0].owner == owner) {
                    fs.readFile(__dirname + "/crypto_rates.json", async (err, data) => {
                        var parseData = JSON.parse(data);
                        if (err) {
                            console.log(err);
                            console.log(data);
                            return res.status(500).json({ error: 'Неверный запрос' });
                        } else {
                            org.balance = [];
                            var usdTotal = 0;
                            var i = 1;
                            for (var token in parseData) {
                                usdTotal += parseData[token] * orgRow.rows[0]["balance_" + token.toLowerCase()];
                                org.balance.push({ name: token, sum: orgRow.rows[0]["balance_" + token.toLowerCase()] })
                                if (i == Object.keys(parseData).length) {
                                    org.usdTotal = usdTotal.toFixed(1);
                                    org.usdReceived = orgRow.rows[0].usd_received
                                    return res.status(200).json({ org: org });
                                }
                                else i++;
                            }
                        }
                    })
                } else {
                    return res.status(200).json({ org: org });
                }
            } else {
                return res.status(500).json({ "error": true, "message": 'Ошибка запроса' });
            }
        }
    });
}