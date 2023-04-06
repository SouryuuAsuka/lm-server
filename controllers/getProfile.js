const pool = require("@service/db");

exports.getProfile = async (req, res) => {
    try {
        if (req.query.username == undefined) {
            return res.status(500).json({ error: true, message: 'Пустой запрос' });
        } else {
            const userRow = await pool.query(`SELECT * FROM users WHERE LOWER(username) = $1`, [req.query.username.toLowerCase()]);
            if (userRow.rows[0] != undefined) {
                const user = {
                    userId: userRow.rows[0].user_id,
                    username: userRow.rows[0].username,
                    firstname: userRow.rows[0].firstname,
                    surname: userRow.rows[0].surname,
                    userRole: userRow.rows[0].user_role,
                    regtime: userRow.rows[0].regtime,
                }
                if (userRow.rows[0].avatar != null) {
                    user.avatar = userRow.rows[0].avatar;
                } else {
                    user.avatar = "defaultAvatar";
                }
                if (!userRow.rows[0].telegram){
                    var sult = trRow.rows[0].pass_sult;
                    user.tgCode = sult.substring(sult.length - 6) 
                }
                return res.status(200).json({ profile: user });
            } else {
                return res.status(500).json({ error: true, message: 'Пользователь не найден' });
            }
        }
        //TODO: Дописать дополнительный get по id
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}