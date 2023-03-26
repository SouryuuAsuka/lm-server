const pool = require("@service/db");
const fs = require('fs');

exports.getOrgList = async (req, res) => {
    try {
        var sqlVar = {};
        if (req.query.p == undefined) sqlVar.page = '0';
        else sqlVar.page = (req.query.p - 1) * 10;
        if (req.query.c == undefined) sqlVar.country = '%';
        else sqlVar.country = req.query.c;
        if (req.query.t == undefined) sqlVar.type = '{0, 1, 2}';
        else sqlVar.type = "{"+req.query.t+"}";
        pool.query(`
            SELECT 
            org.org_id AS org_id, 
            org.name AS name, 
            org.about AS about, 
            org.type AS type, 
            org.avatar AS avatar, 
            p.pur_id AS pur_id,
            p.name AS pur_name,
            p.about AS pur_about,
            p.sum AS pur_sum,
            p.active AS pur_active,
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
            p.balance_matic AS balance_matic
            FROM organizations AS org 
            LEFT JOIN purposes AS p
            ON p.pur_id = (
                SELECT p1.pur_id FROM purposes AS p1
                WHERE p1.org_id = org.org_id AND p1.active = true
                ORDER BY created DESC
                LIMIT 1)
            WHERE org.country LIKE $1 AND org.type = ANY($2)
            OFFSET $3 LIMIT 10`, [sqlVar.country, sqlVar.type, sqlVar.page], (err, orgRow) => {
            if (err) {

                console.log(err)
                return res.status(500).json({ error: 'Ошибка поиска' });
            } else {
                var count = pool.query("SELECT COUNT(*) FROM organizations")
                var orgList = [];
                if (orgRow.rows[0] != undefined) {
                    fs.readFile(__dirname + "/../../service/crypto_rates.json", "utf8", (err, data) => {
                        console.log(data)
                        parseData = JSON.parse(data);
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: 'Неверный запрос' });
                        } else {
                            for (let i = 0; i < orgRow.rows.length; i++) {
                                var usdTotal = 0;
                                var test = "";
                                for (var token in parseData) {
                                    usdTotal += parseData[token] * orgRow.rows[i]["balance_" + token.toLowerCase()];
                                    test += token + " ";
                                    console.log("usdTotal " + usdTotal)
                                    console.log("token " + token)
                                    console.log("data[token] " + parseData[token])
                                    console.log('orgRow.rows[i]["balance_" + token.toLowerCase()] ' + orgRow.rows[i]["balance_" + token.toLowerCase()])
                                }
                                orgList[i] = {
                                    id: orgRow.rows[i].org_id,
                                    name: orgRow.rows[i].name,
                                    about: orgRow.rows[i].about,
                                    type: orgRow.rows[i].type,
                                    avatar: orgRow.rows[i].avatar,
                                    purId: orgRow.rows[i].pur_id,
                                    purName: orgRow.rows[i].pur_name,
                                    purAbout: orgRow.rows[i].pur_about,
                                    purSum: orgRow.rows[i].pur_sum,
                                    purActive: orgRow.rows[i].pur_active,
                                    purUsdTotal: usdTotal.toFixed(1)
                                }
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

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}