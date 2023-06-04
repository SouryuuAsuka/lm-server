const pool = require("@service/db");
const jwt = require('jsonwebtoken');

exports.getCouriers = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            console.log("начало проверки")
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if (decoded.userRole != 5 && decoded.userRole != 6) {
                return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
            } else {
                var count = pool.query("SELECT COUNT(*) FROM tg_couriers WHERE confirm = false", [])
                if (count != 0) {
                    pool.query(`
                        SELECT 
                        tg_id, username, country, city, firstname, lastname
                        FROM tg_couriers
                        WHERE confirm = false`, [], (err, couriersRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: 'Ошибка поиска' });
                        } else {
                            var couriersList = [];

                            for (let i = 0; i < couriersRow.rows.length; i++) {
                                var country;
                                var city;
                                if (couriersRow.rows[i].country == "ge") {
                                    country = "Грузия";
                                }
                                if (couriersRow.rows[i].city == "tbi") {
                                    city = "Тбилиси"
                                }
                                couriersList.push({
                                    tgId: couriersRow.rows[i].tg_id,
                                    username: couriersRow.rows[i].username,
                                    firstname: couriersRow.rows[i].firstname,
                                    lastname: couriersRow.rows[i].lastname,
                                    country: country,
                                    city: city
                                })
                                if (i + 1 == couriersRow.rows.length) {
                                    return res.status(200).json({ couriers: couriersList, count: count });
                                }

                            }

                        }
                    });
                } else {
                    console.log("Организаций не найдено")
                    return res.status(200).json({ couriers: [], count: 0 });
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Ошибка при обработке запроса" });
    };
}