const pool = require("@service/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');


exports.getPayList = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId], (err, userRow) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: "Ошибка при подтверждении роли пользователя" })
                    } else {
                        if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                            var sqlVar = {};
                            if (req.query.p == undefined) sqlVar.page = '0';
                            else sqlVar.page = (req.query.p - 1) * 10;
                            if (req.query.c == undefined) sqlVar.country = '%';
                            else sqlVar.country = req.query.c;
                            if (req.query.t == undefined) sqlVar.type = '{0, 1, 2}';
                            else sqlVar.type = "{" + req.query.t + "}";
                            pool.query(`
                                SELECT 
                                org.org_id AS org_id, 
                                org.name AS name, 
                                org.type AS type, 
                                org.country AS country,
                                org.balance_ton AS balance_ton,
                                org.balance_btc AS balance_btc,
                                org.balance_ape AS balance_ape,
                                org.balance_bch AS balance_bch, 
                                org.balance_dai AS balance_dai, 
                                org.balance_doge AS balance_doge,
                                org.balance_eth AS balance_eth, 
                                org.balance_ltc AS balance_ltc,
                                org.balance_shib AS balance_shib, 
                                org.balance_usdt AS balance_usdt, 
                                org.balance_usdc AS balance_usdc, 
                                org.balance_matic AS balance_matic,
                                org.usd_received AS usd_received
                                FROM organizations AS org 
                                WHERE org.country LIKE $1 AND org.type = ANY($2)
                                OFFSET $3 LIMIT 10`, [sqlVar.country, sqlVar.type, sqlVar.page], (err, orgRow) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({ error: 'Ошибка поиска' });
                                } else {
                                    var orgList = [];
                                    if (orgRow.rows[0] != undefined) {
                                        var count = pool.query("SELECT COUNT(*) FROM organizations")
                                        fs.readFile(__dirname + "/../../../../service/crypto_rates.json", "utf8", (err, data) => {

                                            if (err) {
                                                console.log(err);
                                                return res.status(500).json({ error: 'Неверный запрос' });
                                            } else {
                                                parseData = JSON.parse(data);
                                                for (let i = 0; i < orgRow.rows.length; i++) {
                                                    orgList[i] = {
                                                        id: orgRow.rows[i].org_id,
                                                        name: orgRow.rows[i].name,
                                                        type: orgRow.rows[i].type,
                                                        usdReceived: orgRow.rows[i].usd_received,
                                                        confirm: false,
                                                        balance: []
                                                    }
                                                    var usdTotal = 0;
                                                    var test = "";
                                                    for (var token in parseData) {
                                                        usdTotal += parseData[token] * orgRow.rows[i]["balance_" + token.toLowerCase()];
                                                        test += token + " ";
                                                        orgList[i].balance.push({ name: token, sum: orgRow.rows[i]["balance_" + token.toLowerCase()] });
                                                    }
                                                    orgList[i].usdTotal = usdTotal*0.92
                                                    orgList[i].usdTotal = orgList[i].usdTotal.toFixed(1)
                                                    if (i + 1 == orgRow.rows.length) {
                                                        console.log(test);
                                                        return res.status(200).json({ orgs: orgList, count: count });
                                                    }
                                                }
                                            }
                                        })
                                    } else {
                                        console.log("Организаций не найдено")
                                        return res.status(200).json({ orgs: [] });
                                    }
                                }
                            });
                        } else {
                            return res.status(400).json({ success: false, error: "Недостаточно доступа для запроса" })
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