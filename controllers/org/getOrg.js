const pool = require("@service/db");
const jwt = require('jsonwebtoken');

exports.getOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                notAythRequest(req, res);
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
                    org.owner AS owner, 
                    org.usd_total AS usd_total, 
                    org.usd_received AS usd_received, 
                    g.good_id AS good_id,
                    g.name AS good_name,
                    g.about AS good_about,
                    g.price AS good_price,
                    g.active AS good_active,
                    g.picture AS good_picture,
                    g.sold AS good_sold,
                    g.created AS good_created,
                    g.orders AS good_orders,
                    g.cat_id AS good_cat_id,
                    g.min_time AS good_min_time,
                    g.max_time AS good_max_time
                    FROM organizations AS org 
                    LEFT JOIN goods AS g
                    ON g.org_id = org.org_id
                    WHERE org.org_id = $1
                    ORDER BY g.created DESC`,
                    [req.query.id], async (err, orgRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                    } else {
                        if (orgRow.rows[0] != undefined) {
                            if (decoded.userRole == 5 || decoded.userRole == 6 || orgRow.rows[0].owner == decoded.userId ) {
                                sendOrgData(res, orgRow, true);
                            } else if(orgRow.rows[0].public == true) {
                                sendOrgData(res, orgRow, false)
                            } else {
                                return res.status(500).json({ error: true, message: 'Недостаточно прав для получения данных' });
                            }
                        } else {
                            return res.status(500).json({ error: true, message: 'Ошибка запроса' });
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

function sendOrgData(res, orgRow, allGoods) {
    const org = {
        orgId: orgRow.rows[0].org_id,
        name: orgRow.rows[0].name,
        about: orgRow.rows[0].about,
        owner: orgRow.rows[0].owner,
        avatar: orgRow.rows[0].avatar,
        category: orgRow.rows[0].category,
        public: orgRow.rows[0].public,
        city: orgRow.rows[0].city,
        usdTotal: orgRow.rows[0].usd_total,
        usdReceived: orgRow.rows[0].usd_received,
        goods: []
    }
    for (let i = 0; i < orgRow.rows.length; i++) {
        if(allGoods){
            org.goods.push({
                id: orgRow.rows[i].good_id,
                name: orgRow.rows[i].good_name,
                about: orgRow.rows[i].good_about,
                price: orgRow.rows[i].good_price,
                active: orgRow.rows[i].good_active,
                picture: orgRow.rows[i].good_picture,
                sold: orgRow.rows[i].good_sold,
                cat_id: orgRow.rows[i].good_cat_id,
                orders: orgRow.rows[i].good_orders,
                created: orgRow.rows[i].good_created,
                minTime: orgRow.rows[i].good_min_time,
                maxTime: orgRow.rows[i].good_max_time
            })
        } else {
            if(orgRow.rows[i].good_active){
                org.goods.push({
                    id: orgRow.rows[i].good_id,
                    name: orgRow.rows[i].good_name,
                    about: orgRow.rows[i].good_about,
                    price: orgRow.rows[i].good_price,
                    active: orgRow.rows[i].good_active,
                    picture: orgRow.rows[i].good_picture,
                    sold: orgRow.rows[i].good_sold,
                    cat_id: orgRow.rows[i].good_cat_id,
                    minTime: orgRow.rows[i].good_min_time,
                    maxTime: orgRow.rows[i].good_max_time
                }) 
            }
        }
        if (i + 1 == orgRow.rows.length) {
            return res.status(200).json({ org: org });
        }
    }
}

function notAythRequest(req, res){
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
        g.price AS good_price,
        g.active AS good_active,
        g.picture AS good_picture,
        g.sold AS good_sold,
        g.created AS good_created,
        g.orders AS good_orders,
        g.min_time AS good_min_time,
        g.max_time AS good_max_time
        FROM organizations AS org 
        LEFT JOIN goods AS g
        ON g.good_id = (
            SELECT g1.good_id FROM goods AS g1
            WHERE g1.org_id = org.org_id AND g1.active = true
            ORDER BY g1.created DESC
        )
        WHERE org.org_id = $1 AND org.public = true`, [req.query.id], async (err, orgRow) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
        } else {
            if (orgRow.rows[0] != undefined) {
                sendOrgData(res, orgRow);
            } else {
                return res.status(500).json({ error: true, message: 'Ошибка запроса' });
            }
        }
    });
}