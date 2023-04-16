const pool = require("@service/db");
const validator = require('validator');

exports.getCart = async (req, res) => {
    try {
        if (req.cookies.cart_id == undefined) {
            return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
        } else if (isNaN(req.cookies.cart_id )) {
            return res.status(400).json({ success: false, error: "ID корзины некорректен" })
        } else if (req.cookies.cart_token  == undefined) {
            return res.status(400).json({ success: false, error: "Токен корзины должен быть отправлен" })
        } else if (!validator.matches(req.cookies.cart_token, '^[0-9a-zA-Z]{6}$')) {
            return res.status(400).json({ success: false, error: "Токен корзины некорректен" })
        } else {
            const orgInsertString = "SELECT order_array FROM carts WHERE token = $1 AND cart_id = $2"
            pool.query(orgInsertString,[req.cookies.cart_token, req.cookies.cart_id], (err, cartRow) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                } else {
                    return res.status(200).json({ success: true, cart: cartRow.rows[0].order_array})
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