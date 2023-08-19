const pool = require("@database/postgresql/db");
const dbot = require("@axios/dbot_axios");
const jwt = require('jsonwebtoken');

const confirmCourier = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: true, message: 'Unauthorized access.' });
            } else if (req.params.tgId == undefined) {
                return res.status(401).json({ error: true, message: 'Некорректный id.' });
            } else if (decoded.userRole != 5 && decoded.userRole != 6) {
                return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
            } else {
                pool.query(`
                    UPDATE tg_couriers
                    SET confirm = true
                    WHERE tg_id = $1
                    RETURNING app_id`, [req.params.tgId], (err, tgRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: 'Ошибка поиска' });
                    } else {
                        var msgText = "Ваша заявка на регистрацию в курьерской системе одобрена."
                        dbot.post('sendmsg', {
                            key: process.env.DBOT_ACCESS_KEY,
                            id: tgRow.rows[0].app_id,
                            text: msgText
                        })
                        return res.status(200).json({});
                    }
                });
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Ошибка при обработке запроса" });
    };
}

module.exports = confirmCourier;