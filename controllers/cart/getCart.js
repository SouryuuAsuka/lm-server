const pool = require("@service/db");
const validator = require('validator');

exports.getCart = async (req, res) => {
    try {
        if (req.cookies.cart_id == undefined) {
            return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
        } else if (isNaN(req.cookies.cart_id)) {
            return res.status(400).json({ success: false, error: "ID корзины некорректен" })
        } else if (req.cookies.cart_token == undefined) {
            return res.status(400).json({ success: false, error: "Токен корзины должен быть отправлен" })
        } else if (!validator.matches(req.cookies.cart_token, '^[0-9a-zA-Z]{6}$')) {
            return res.status(400).json({ success: false, error: "Токен корзины некорректен" })
        } else {
            var cartInsertString;
            if (req.query.type == "full") {
                cartInsertString =
                    `SELECT 
                    elem ->> 'num' AS num,
                    elem ->> 'id' AS id,
                    g.price AS price,
                    g.name AS name,
                    g.active AS active,
                    g.picture AS picture,
                    g.preparation_time AS preparation_time,
                    o.org_id AS org_id,
                    o.name AS org_name
                    FROM carts AS c
                    CROSS JOIN LATERAL unnest(c.order_array) AS elem
                    JOIN goods AS g
                    ON (elem ->> 'id')::INT = g.good_id
                    JOIN organizations AS o
                    ON o.org_id = g.org_id
                    WHERE c.token = $1 AND c.cart_id = $2`
                pool.query(cartInsertString, [req.cookies.cart_token, req.cookies.cart_id], (err, cartRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).jsons({ success: false, error: "Ошибка при сохранении корзины" })
                    } else if(cartRow.rows.length ==0 ){
                        return res.status(200).json({ success: true, cart: [] })
                    } else {
                        sortCart(cartRow.rows, (cartArray, prTime)=>{
                            return res.status(200).json({ success: true, cart: cartArray, prTime: prTime })
                        })
                    }
                })
            } else {
                cartInsertString = "SELECT order_array FROM carts WHERE token = $1 AND cart_id = $2"
                pool.query(cartInsertString, [req.cookies.cart_token, req.cookies.cart_id], (err, cartRow) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                    } else {
                        if (cartRow.rows.length == 0) {
                            return res.status(200).json({ success: true, cart: [] })
                        } else {
                            return res.status(200).json({ success: true, cart: cartRow.rows[0].order_array })
                        }
                    }
                })
            }

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}
function sortCart(cart, callback) {
    var cartArray = [];
    var prTime = 0;
    for (let i = 0; i < cart.length; i++) {
        if (cart[0].preparation_time > prTime) {
            prTime = cart[0].preparation_time;
        }
        if (cartArray.length == 0) {
            cartArray.push({ org_id: cart[i].org_id, orgName: cart[i].org_name, app_id: cart[i].app_id, order: [{ id: cart[i].good_id, num: cart[i].cart_num, price: cart[i].good_price, name: goodName }] })
        } else {
            for (let j = 0; j < cartArray.length; j++) {
                if (cartArray[j].org_id == cart[i].org_id) {
                    cartArray[j].order.push({ id: cart[i].good_id, num: cart[i].cart_num, name: goodName })
                    if(cart.length == i+1 ){
                        callback(cartArray, prTime/24)
                    } else {
                        break;
                    }
                }
                else if (cartArray.length == j + 1) {
                    cartArray.push({ org_id: cart[i].org_id, org_name: orgName, app_id: cart[i].app_id, order: [{ id: cart[i].good_id, num: cart[i].cart_num, price: cart[i].good_price, name: goodName }] })
                    if(cart.length == i+1 ){
                        callback(cartArray, prTime/24)
                    }
                }
            }
        }
    }
}