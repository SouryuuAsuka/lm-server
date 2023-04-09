const { getOrgFromDB } = require('@service/getOrgFromDB');
const jwt = require('jsonwebtoken');

exports.getOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            } else if (req.query.id == undefined) {
                return res.status(500).json({ error: true, message: 'Пустой запрос' });
            } else {
                pool.query(`
                    SELECT 
                    org.org_id AS org_id, 
                    org.name AS name, 
                    org.about AS about, 
                    org.category AS category, 
                    org.avatar AS avatar, 
                    org.city AS city, 
                    org.public AS public, 
                    g.good_id AS good_id,
                    g.name AS good_name,
                    g.about AS good_about,
                    g.sum AS good_sum,
                    g.active AS good_active,
                    g.currency AS good_currency,
                    g.picture AS good_picture,
                    g.sold AS good_sold
                    FROM organizations AS org 
                    LEFT JOIN goods AS g
                    ON g.good_id = (
                        SELECT g1.good_id FROM goods AS g1
                        WHERE g1.org_id = org.org_id AND g1.active = true
                        ORDER BY g1.created DESC
                    )
                    WHERE org_id = $1`, [req.query.id], async (err, orgRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                    } else {
                        if(decoded.userRole == 5 || decoded.userRole == 6 || orgRow.rows[0].owner ==  decoded.userId || orgRow.rows[0].good_active == true){
                            if (orgRow.rows[0] != undefined) {
                                const org = {
                                    orgId: orgRow.rows[0].org_id,
                                    name: orgRow.rows[0].name,
                                    about: orgRow.rows[0].about,
                                    owner: orgRow.rows[0].owner,
                                    avatar: orgRow.rows[0].avatar,
                                    category: orgRow.rows[0].category,
                                    public: orgRow.rows[i].public,
                                    city: orgRow.rows[0].city,
                                    goods: []
                                }
                                for (let i = 0; i < orgRow.rows.length; i++) {
                                    org.goods.push({
                                        id: orgRow.rows[i].good_id,
                                        name: orgRow.rows[i].good_name,
                                        about: orgRow.rows[i].good_about,
                                        sum: orgRow.rows[i].good_sum,
                                        active: orgRow.rows[i].good_active,
                                        picture: orgRow.rows[i].good_picture,
                                        sold: orgRow.rows[i].good_sold
                                    })
                                    if (i + 1 == orgRow.rows.length) {
                                        return res.status(200).json({ org: org });
                                    }
                                }
                            } else {
                                return res.status(500).json({ error: true, message: 'Ошибка запроса' });
                            }
                        } else {
                            return res.status(500).json({ error: true, message: 'Недостаточно прав получения информации' });
                        }
                    }
                });
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}