const pool = require("@service/db");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { json } = require("body-parser");
const tx = require("@service/tx");



exports.canselPay = async (req, res) => {
    try {

        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else {
                pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId], async (err, userRow) => {
                    console.log(JSON.stringify(req.body))
                    if (err) {
                        return res.status(400).json({ success: false, error: "Ошибка при подтверждении роли пользователя" })
                    } else if (req.body.payId == undefined) {
                        return res.status(400).json({ error: true, message: 'Значение id отсутствует' });
                    } else if (!Number.isInteger(req.body.payId)) {
                        return res.status(400).json({ error: true, message: 'Значение id некорректно' });
                    }else {
                        if (userRow.rows[0].user_role == 5 || userRow.rows[0].user_role == 6) {
                            pool.query(`
                                SELECT * FROM org_payments WHERE pay_id = $1 `,
                            [req.body.payId],
                                async (err, payRow) => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(500).json({ error: 'Ошибка сохранения выплаты' });
                                    } else {
                                        var tokens = ["APE", "BTC", "BCH", "DAI", "DOGE", "ETH", "LTC", "SHIB", "USDT", "USDC", "MATIC", "TON"];
                                        var balance = payRow.rows[0]
                                        /*var promise = tokens.map((tokUpName)=>{
                                            var tokName = tokUpName.toLowerCase();
                                            if(payRow.rows[0][tokName] == null){
                                                balance[tokName] = 0
                                            } else {
                                                balance[tokName] = payRow.rows[0][tokName]
                                            }
                                        })
                                        await Promise.all(promise)*/
                                        tx(res, "Ошибка подключения к базе данных",
                                        async (client)=>{
                                            console.log(JSON.stringify(balance));

                                            client.query(`
                                            UPDATE organizations 
                                            SET
                                            balance_btc = balance_btc + $1,
                                            balance_ton = balance_ton + $2,
                                            balance_ape = balance_ape + $3,
                                            balance_bch = balance_bch + $4, 
                                            balance_dai = balance_dai + $5, 
                                            balance_doge = balance_doge + $6,
                                            balance_eth = balance_eth + $7,  
                                            balance_ltc = balance_ltc + $8,
                                            balance_shib = balance_shib + $9, 
                                            balance_usdt = balance_usdt + $10, 
                                            balance_usdc = balance_usdc + $11, 
                                            balance_matic = balance_matic + $12,
                                            usd_received = usd_received - $13
                                            WHERE org_id = $14`,
                                            [balance.balance_btc, balance.balance_ton, balance.balance_ape, balance.balance_bch,
                                            balance.balance_dai, balance.balance_doge, balance.balance_eth, balance.balance_ltc, balance.balance_shib, balance.balance_usdt,
                                            balance.balance_usdc, balance.balance_matic, payRow.rows[0].usd_sum, payRow.rows[0].org_id],
                                                (err, orgRow) => {
                                                    if (err) {
                                                        console.log(err)
                                                        return res.status(500).json({ error: 'Ошибка обновления баланса организации' });
                                                    } else {
                                                        client.query(`DELETE FROM org_payments WHERE pay_id = $1`, [payRow.rows[0].pay_id], (err, payRow) =>{
                                                            if (err){
                                                                return res.status(500).json({ error: 'Ошибка обновления баланса организации' });
    
                                                            } else {
                                                                return res.status(200).json({})
                                                            }
    
                                                        })
                                                    }
                                                })
                                        })
                                        
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