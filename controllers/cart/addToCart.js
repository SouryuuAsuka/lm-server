const pool = require("@service/db");
const validator = require('validator');

exports.addToCart = async (req, res) => {
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
            const orgInsertString = "UPDATE carts SET order_array = $1, last_update = $2 WHERE token = $3 AND cart_id = $4"
            pool.query(orgInsertString,[req.body.cart, "NOW()", req.body.token, req.body.cartId], (err, cartRow) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                } else {
                    return res.status(200).json({ success: true})
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