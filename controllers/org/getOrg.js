const pool = require("@service/db");
const jwt = require('jsonwebtoken');

exports.getOrg = async (req, res) => {
    try {
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
            if (err) {
                notAythRequest(req, res);
            } else if (req.query.id == undefined) {
                return res.status(500).json({ error: true, message: 'Пустой запрос' });
            } else if (decoded.userRole == 5 || decoded.userRole == 6) {
                aythRequest(req, res)
            } else {
                pool.query(`SELECT owner FROM organizations WHERE org_id = $1`, [req.query.id], async (err, selOrgRow) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
                    } else if (selOrgRow.rows.length == 0) {
                        return res.status(400).json({ success: false, error: "Произошла ошибка поиске организации" })
                    } else if (selOrgRow.rows[0].owner == decoded.userId) {
                        aythRequest(req, res)
                    } else {
                        notAythRequest(req, res);
                    }
                })
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

function sendOrgData(res, org, owner) {
    var newOrg = {
        orgId: Number(org.org_id),
        name: org.name,
        about: org.about,
        owner: Number(org.owner),
        avatar: org.avatar,
        category: org.category,
        public: org.public,
        city: org.city,
        goods: []
    }
    for (let i = 0; i < org.goods.length; i++) {
        if (owner) {
            newOrg.goods.push({
                id: Number(org.goods[i].good_id),
                name: org.goods[i].good_name,
                about: org.goods[i].good_about,
                price: Number(org.goods[i].good_price),
                active: org.goods[i].good_active,
                picture: org.goods[i].good_picture,
                sold: Number(org.goods[i].good_sold),
                cat_id: Number(org.goods[i].good_cat_id),
                orders: Number(org.goods[i].good_orders),
                created: org.goods[i].good_created,
                preparation_time: Number(org.goods[i].good_preparation_time)
            })
        } else {
            if (org.goods[i].good_active) {
                newOrg.goods.push({
                    id: Number(org.goods[i].good_id),
                    name: org.goods[i].good_name,
                    about: org.goods[i].good_about,
                    price: Number(org.goods[i].good_price),
                    active: org.goods[i].good_active,
                    picture: org.goods[i].good_picture,
                    sold: Number(org.goods[i].good_sold),
                    cat_id: Number(org.goods[i].good_cat_id),
                    preparation_time: Number(org.goods[i].good_preparation_time)
                })
            }
        }
        if (i + 1 == org.goods.length) {
            if (owner) {
                var totalSum = 0
                if (Array.isArray(org.quests)){
                    org.quests.map((quest) => {
                        var goodSum=0;
                        quest.goods.map((good) => {
                            goodSum+= (Number(good.num) * Number(good.price))
                        })
                        console.log("goodSum - " + goodSum)
                        totalSum += goodSum
                    })
                }
                console.log("totalSum - "+totalSum)
                newOrg.sum_total = totalSum;
                return res.status(200).json({ org: newOrg });
            } else {
                return res.status(200).json({ org: newOrg });

            }
        }
    }
}
function aythRequest(req, res) {
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
    (SELECT 
        json_agg( 
            json_build_object(
            'qu_id', qu.qu_id,
            'status_code', qu.status_code,
            'goods', qu.goods_array
            )
        )  
        FROM org_quests AS qu 
        WHERE qu.org_id = $1 AND (qu.status_code = 5 AND qu.paid = false)
        GROUP BY qu.org_id
    ) AS quests, 
    json_agg( 
        json_build_object(
            'good_id', g.good_id, 
            'good_name', g.name, 
            'good_about',  g.about, 
            'good_price',  g.price, 
            'good_active', g.active, 
            'good_picture', g.picture, 
            'good_sold', g.sold, 
            'good_created', g.created, 
            'good_orders', g.orders, 
            'good_cat_id', g.cat_id, 
            'good_preparation_time', g.preparation_time
        )
    ) AS goods
    FROM organizations AS org 
    LEFT JOIN goods AS g
    ON g.org_id = org.org_id
    WHERE org.org_id = $1 
    GROUP BY org.org_id
    ORDER BY org.created DESC`,
        [req.query.id], async (err, orgRow) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
            } else {
                if (orgRow.rows.length != 0) {
                    var org = orgRow.rows[0];
                    sendOrgData(res, org, true);
                } else {
                    return res.status(500).json({ error: true, message: 'Ошибка запроса' });
                }
            }
        });
}
function notAythRequest(req, res) {
    pool.query(`
        SELECT 
        org.org_id AS org_id, 
        org.name AS name, 
        org.about AS about, 
        org.category AS category, 
        org.avatar AS avatar, 
        org.city AS city, 
        org.public AS public, 
        json_agg( 
            json_build_object(
                'good_id', g.good_id, 
                'good_name', g.name, 
                'good_about',  g.about, 
                'good_price',  g.price, 
                'good_active', g.active, 
                'good_picture', g.picture, 
                'good_sold', g.sold, 
                'good_created', g.created, 
                'good_orders', g.orders, 
                'good_cat_id', g.cat_id, 
                'good_preparation_time', g.preparation_time
            )
        ) AS goods
        FROM organizations AS org 
        LEFT JOIN goods AS g
        ON g.org_id = org.org_id 
        WHERE org.org_id = $1 AND org.public = true AND g.active = true
        GROUP BY org.org_id`, [req.query.id], async (err, orgRow) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
        } else {
            if (orgRow.rows.length != 0) {
                var org = orgRow.rows[0];
                sendOrgData(res, org);
            } else {
                return res.status(500).json({ error: true, message: 'Ошибка запроса' });
            }
        }
    });
}