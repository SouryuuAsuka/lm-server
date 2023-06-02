const pool = require("@service/db");

exports.getOrgList = async (req, res) => {
    var count = pool.query("SELECT COUNT(*) FROM tg_couriers WHERE confirm = false", [])
    if (count != 0) {
        pool.query(`
            SELECT 
            tg_id, username, country, city
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
                    if (couriersRow.rows[i].city == "tbi"){
                        city = "Тбилиси"
                    }
                    couriersList.push({
                        tgId: couriersRow.rows[i].tg_id,
                        username: couriersRow.rows[i].username,
                        country: country,
                        city: city
                    })
                    if (i + 1 == couriersRow.rows.length && j + 1 == couriersRow.rows[i].goods.length) {
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