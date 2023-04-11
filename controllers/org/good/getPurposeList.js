const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.getPurposeList = async (req, res) => {
    try {
        if (req.query.org == undefined) {
            return res.status(500).json({ error: 'Пустой запрос' });
        } else {
            if (req.query.archive == undefined)
                pool.query(`SELECT * FROM purposes WHERE org_id = $1 AND active = true`, [req.query.org], (err, purRow) => {
                    return sendRequest(err, purRow, res)
                })
            else if (req.query.archive == "true") {
                jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
                    if (err) {
                        return res.status(401).json({ error: 'Неавторизированный доступ' });
                    } else {
                        if (decoded.userRole == 5 || decoded.userRole == 6 ){
                            pool.query(` 
                            SELECT p.pur_id, p.name, p.about, p.sum, p.active, 
                            p.balance_ton, p.balance_btc, p.balance_ape,
                            p.balance_bch, p.balance_dai, p.balance_doge,
                            p.balance_eth, p.balance_ltc, p.balance_shib,
                            p.balance_usdt, p.balance_usdc, p.balance_matic
                            FROM organizations AS org
                            JOIN purposes AS p 
                            ON org.org_id = p.org_id
                            WHERE org.org_id = $1`, [req.query.org], (err, purRow) => {
                                return sendRequest(err, purRow, res)
                            })
                        } else {
                            pool.query(` 
                            SELECT p.pur_id, p.name, p.about, p.sum, p.active, 
                            p.balance_ton, p.balance_btc, p.balance_ape,
                            p.balance_bch, p.balance_dai, p.balance_doge,
                            p.balance_eth, p.balance_ltc, p.balance_shib,
                            p.balance_usdt, p.balance_usdc, p.balance_matic
                            FROM organizations AS org
                            JOIN purposes AS p 
                            ON org.org_id = p.org_id
                            WHERE org.org_id = $1 AND org.owner = $2`, [req.query.org, decoded.userId], (err, purRow) => {
                                return sendRequest(err, purRow, res)
                            })
                        }

                    }
                })
            }
            else
                return res.status(500).json({ error: 'Неверный запрос' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
function sendRequest(err, purRow, res) {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: "Ошибка при отображении целей сбора" })
    } else {
        var purList = [];
        if (purRow.rows[0] != undefined) {
            fs.readFile(__dirname + "/../../../service/crypto_rates.json", async (err, data) => {
                var parseData = JSON.parse(data);
                if (err) {
                    console.log(err);
                    console.log(data);
                    return res.status(500).json({ error: 'Неверный запрос' });
                } else {

                    for (let i = 0; i < purRow.rows.length; i++) {
                        var usd = await usdCounter(parseData, purRow.rows[i])
                        console.log("usd "+usd)
                        purList[i] = {
                            id: purRow.rows[i].pur_id,
                            name: purRow.rows[i].name,
                            about: purRow.rows[i].about,
                            sum: purRow.rows[i].sum,
                            active: purRow.rows[i].active,
                            usdTotal: usd
                        }
                        if (i + 1 == purRow.rows.length) {
                            return res.status(200).json({ purposes: purList });
                        }
                    }
                }
            })
        } else {
            console.log("Организаций не найдено")
            return res.status(200).json({ purposes: [] });
        }
    }
};

async function usdCounter(parseInData, balance) {
    var usdTotal = 0;
    var i = 1;
    for (var token in parseInData) {
        console.log(token);
        usdTotal += parseInData[token] * balance["balance_" + token.toLowerCase()];
        console.log("Object.keys(parseInData).length " + Object.keys(parseInData).length)
        console.log("i " + i)
        if (i == Object.keys(parseInData).length) return usdTotal.toFixed(1);
        else i++;
    }
}