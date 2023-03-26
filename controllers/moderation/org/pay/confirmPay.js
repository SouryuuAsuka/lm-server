const pool = require("@service/db");
const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { json } = require("body-parser");
const tx = require("@service/tx");


exports.confirmPay = async (req, res) => {
    try {

        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId], async (err, userRow) => {
                    console.log(JSON.stringify(req.body))
                    if (err) {
                        return res.status(400).json({ success: false, error: "Ошибка при подтверждении роли пользователя" })
                    } else if (req.body.orgId == undefined) {
                        return res.status(400).json({ error: true, message: 'Значение id отсутствует' });
                    } else if (!Number.isInteger(req.body.orgId)) {
                        return res.status(400).json({ error: true, message: 'Значение id некорректно' });
                    } else if (req.body.balance == []) {
                        return res.status(400).json({ error: true, message: 'Значение баланса пустое' });
                    } else if (req.body.sum == "0.0") {
                        return res.status(400).json({ error: true, message: 'Значение баланса в долларах пустое' });
                    } else if (req.body.sum == 0) {
                        return res.status(400).json({ error: true, message: 'Значение баланса в долларах пустое' });
                    } else {
                        if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                            var tokens = ["APE", "BTC", "BCH", "DAI", "DOGE", "ETH", "LTC", "SHIB", "USDT", "USDC", "MATIC", "TON"];
                            var balance = {}
                            var promise = tokens.map((tokUpName) => {
                                var tokName = tokUpName.toLowerCase();
                                balance[tokName] = 0
                                for (let j = 0; j < req.body.balance.length; j++) {
                                    if (tokUpName == req.body.balance[j].name)
                                        balance[tokName] = Number(req.body.balance[j].sum);
                                }
                            })
                            await Promise.all(promise)
                            await tx(res, "Ошибка подключения к базе данных",
                                async (client) => {
                                    client.query(`
                                    INSERT INTO org_payments
                                    (org_id, created, usd_sum, 
                                    balance_ton,
                                    balance_btc,
                                    balance_ape,
                                    balance_bch, 
                                    balance_dai, 
                                    balance_doge,
                                    balance_eth, 
                                    balance_ltc,
                                    balance_shib, 
                                    balance_usdt, 
                                    balance_usdc, 
                                    balance_matic
                                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                                        [req.body.orgId, new Date(), req.body.sum, balance.ton, balance.btc, balance.ape, balance.bch,
                                        balance.dai, balance.doge, balance.eth, balance.ltc, balance.shib, balance.usdt, balance.usdc, balance.matic],
                                        (err, orgRow) => {
                                            if (err) {
                                                console.log(err)
                                                return res.status(500).json({ error: 'Ошибка сохранения выплаты' });
                                            } else {
                                                client.query(`
                                                UPDATE organizations 
                                                SET 
                                                balance_ton = balance_ton - $1,
                                                balance_btc = balance_btc - $2,
                                                balance_ape = balance_ape - $3,
                                                balance_bch = balance_bch - $4, 
                                                balance_dai = balance_dai - $5, 
                                                balance_doge = balance_doge - $6,
                                                balance_eth = balance_eth - $7,  
                                                balance_ltc = balance_ltc - $8,
                                                balance_shib = balance_shib - $9, 
                                                balance_usdt = balance_usdt - $10, 
                                                balance_usdc = balance_usdc - $11, 
                                                balance_matic = balance_matic - $12,
                                                usd_received = usd_received + $13
                                                WHERE org_id = $14`,
                                                    [balance.ton, balance.btc, balance.ape, balance.bch,
                                                    balance.dai, balance.doge, balance.eth, balance.ltc, balance.shib, balance.usdt,
                                                    balance.usdc, balance.matic, req.body.sum, req.body.orgId],
                                                    (err, orgRow) => {
                                                        if (err) {
                                                            console.log(err)
                                                            return res.status(500).json({ error: 'Ошибка обновления баланса организации' });
                                                        } else {
                                                            return res.status(200).json({})
                                                        }
                                                    })
                                            }
                                        });
                                })
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