
const pool = require("@database/postgresql/db");

function generateRandomString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
const newCart = async (req, res) => {
    try {
        if (req.body.goodId == undefined) {
            return res.status(400).json({ success: false, error: "ID товара должен быть отправлен" })
        } else if (isNaN(req.body.goodId)) {
            return res.status(400).json({ success: false, error: "ID товара некорректен" })
        } else {
            var token = generateRandomString(6)
            const goodSelectString = 
            `SELECT price FROM goods
            WHERE good_id = $1`
            pool.query(goodSelectString, [req.body.goodId], (err, goodRow) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                } else {
                    const orgInsertString = 
                    `INSERT INTO carts (token, order_array, last_update) 
                    VALUES ($1, $2, $3) RETURNING cart_id`
                    pool.query(orgInsertString, [token, [{ id: req.body.goodId, num: 1, price: goodRow.rows[0].price }], "NOW()"], (err, cartRow) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({ success: false, error: "Ошибка при сохранении корзины" })
                        } else {
                            return res.status(200).json({ success: true, cartId:cartRow.rows[0].cart_id, token:token})
                        }
                    })                }
            })

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = newCart;