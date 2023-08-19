const pool = require("@database/postgresql/db");
const validator = require('validator');

const addToCart = async (req, res) => {
    try {
        var cartId = null;
        if (req.cookies.cart_id != undefined) {
            if (isNaN(req.cookies.cart_id)) {
                return res.status(400).json({ success: false, error: "ID корзины некорректен" })
            } else {
                cartId = req.cookies.cart_id;
            }
        } else if (req.body.cart_id != undefined) {
            if (isNaN(req.body.cart_id)) {
                return res.status(400).json({ success: false, error: "ID корзины некорректен" })
            } else {
                cartId = req.body.cart_id;
            }
        } else {
            return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
        }
        var cartToken = null;
        if (req.cookies.cart_token != undefined) {
                cartToken = req.cookies.cart_token;
        } else if (req.body.cart_token != undefined) {
                cartToken = req.body.cart_token;
        } else {
            return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
        }

        if (cartToken == null || cartId == null) {
            return res.status(400).json({ success: false, error: "Ошибка чтения" })
        } else if (!validator.matches(cartToken, '^[0-9a-zA-Z]{6}$')) {
            return res.status(400).json({ success: false, error: "Токен корзины некорректен" })
        } else {
            const orgInsertString = "UPDATE carts SET order_array = $1, last_update = $2 WHERE token = $3 AND cart_id = $4"
            pool.query(orgInsertString, [req.body.cart, "NOW()", cartToken, cartId], (err, cartRow) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                } else {
                    return res.status(200).json({ success: true })
                }
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = addToCart;