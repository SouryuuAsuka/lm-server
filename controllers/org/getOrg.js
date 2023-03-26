const { getOrgFromDB } = require('@service/getOrgFromDB');

exports.getOrg = async (req, res) => {
    try {
        if (req.query.id == undefined) {
            return res.status(500).json({ error: true, message: 'Пустой запрос' });
        } else {
            return getOrgFromDB(req, 'organizations', res)
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}