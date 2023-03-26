const pool = require("@service/db");
const jwt = require('jsonwebtoken');
const { getOrgFromDB } = require('@service/getOrgFromDB');

exports.getOrgRequest = async (req, res) => {
    try {
        console.log("access_toket -  " + req.cookies.accessToken);
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized access.' });
            } else {
                userRow = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.userId]);
                if (req.query.id == undefined) {
                    return res.status(500).json({ error: 'Получен пустой запрос' });
                } else if (userRow.rows[0].user_role != 5 && userRow.rows[0].user_role != 6) {
                    return res.status(500).json({  error: 'Недостаточно прав'});
                } else {
                    return getOrgFromDB(req, 'organizations_request', res)
                }
            }
            //TODO: Дописать дополнительный get по id
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
async function getUserFromDb(req, res, tableName) {

}