const pool = require("@service/db");
const dbot = require("@service/dbot_axios");

exports.confirmCourier = async (req, res) => {
    pool.query(`
            UPDATE tg_couriers
            SET confirm = true
            WHERE tg_id = $1
            RETERNING app_id`, [req.body.tgId], (err, tgRow) => {
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