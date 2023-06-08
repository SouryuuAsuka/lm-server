
const pool = require("@service/db");

function generateRandomString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
exports.newCart = async (req, res) => {
    try {
        if (req.body.goodId == undefined) {
            return res.status(400).json({ success: false, error: "ID товара должен быть отправлен" })
        } else if (isNaN(req.body.goodId)) {
            return res.status(400).json({ success: false, error: "ID товара некорректен" })
        } else {
            var token = generateRandomString(6)
            const orgInsertString = "INSERT INTO carts (token, order_array, last_update) VALUES ($1, $2, $3) RETURNING cart_id"
            pool.query(orgInsertString, [token, [{ id: req.body.goodId, num: 1 }], "NOW()"], (err, cartRow) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                } else {
                    res.cookie('cart_id', cartRow.rows[0].cart_id, {
                        httpOnly: true
                    })                    
                    res.cookie('cart_token', token, {
                        httpOnly: true
                    })
                    return res.status(200).json({ success: true, cartId:cartRow.rows[0].cart_id, token:token})
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