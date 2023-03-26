const pool = require("@service/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');


exports.getOrgPayments = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else {
                pool.query(`
                SELECT owner
                FROM organizations 
                WHERE org_id = $1`, [req.query.id], (err, orgRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: 'Ошибка поиска' });
                    } else {
                        if (decoded.userRole == 5 || decoded.userRole == 6 || orgRow.rows[0].owner == decoded.userId) {
                            var page;
                            if (req.query.p == undefined) page = '0';
                            else page = (req.query.p - 1) * 10;

                            pool.query(`
                                SELECT 
                                o.org_id AS org_id,
                                o.name AS name,
                                p.pay_id AS pay_id,
                                p.balance_ton AS balance_ton,
                                p.balance_btc AS balance_btc,
                                p.balance_ape AS balance_ape,
                                p.balance_bch AS balance_bch, 
                                p.balance_dai AS balance_dai, 
                                p.balance_doge AS balance_doge,
                                p.balance_eth AS balance_eth, 
                                p.balance_ltc AS balance_ltc,
                                p.balance_shib AS balance_shib, 
                                p.balance_usdt AS balance_usdt, 
                                p.balance_usdc AS balance_usdc, 
                                p.balance_matic AS balance_matic,
                                p.usd_sum AS usd_sum,
                                p.created AS created
                                FROM org_payments AS p
                                LEFT JOIN organizations AS o
                                ON p.org_id = o.org_id
                                WHERE p.org_id = $1
                                OFFSET $2 LIMIT 10`, [req.query.id, page], (err, orgRow) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({ error: 'Ошибка поиска' });
                                } else {
                                    var orgList = [];
                                    if (orgRow.rows[0] != undefined) {
                                        var count = pool.query("SELECT COUNT(*) FROM organizations")
                                        fs.readFile(__dirname + "/../../service/crypto_rates.json", "utf8", (err, data) => {
                                            console.log(data)
                                            parseData = JSON.parse(data);
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).json({ error: 'Неверный запрос' });
                                            } else {
                                                for (let i = 0; i < orgRow.rows.length; i++) {
                                                    var date = new Date(orgRow.rows[i].created)
                                                    orgList[i] = {
                                                        id: orgRow.rows[i].pay_id,
                                                        name: orgRow.rows[i].name,
                                                        usdSum: orgRow.rows[i].usd_sum,
                                                        created: date.toUTCString(),
                                                        confirm: false,
                                                        balance: []
                                                    }
                                                    var usdTotal = 0;
                                                    var test = "";
                                                    for (var token in parseData) {
                                                        usdTotal += parseData[token] * orgRow.rows[i]["balance_" + token.toLowerCase()];
                                                        test += token + " ";
                                                        orgList[i].balance.push({ name: token, sum: orgRow.rows[0]["balance_" + token.toLowerCase()] });
                                                    }
                                                    orgList[i].usdTotal = usdTotal.toFixed(1)
                                                    console.log(JSON.stringify(orgList[i]))
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