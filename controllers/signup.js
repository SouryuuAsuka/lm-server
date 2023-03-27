const bcrypt = require("bcrypt");
const pool = require("@service/db");
const validator = require('validator');
const crypto = require("crypto");
const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
const { networkInterfaces } = require('os');

//var postfixUser = process.env.SMTP_USER;
let transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 587,
    secure: true,
    auth:{
        user: 'noreply@lampymarket.com',
        pass: 'jg3j&W%YV5i#yLF%CZfq'
    },
})

exports.signup = async (req, res) => {

    try {
        pool.on('error', console.error);
        var username, email, password;
        try {
            username = req.body.username;
            email = req.body.email.toLowerCase();
            password = req.body.password;
        } catch {
            console.log(err);
            res.status(400).json({
                error: "Ошибка при чтении формы", //Database connection error
            });
        } //TODO: прописать blacklist из зарезервированных username
        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, error: "Некорректный Email" })
        }
        else if (validator.isEmpty(username)) {
            res.status(400).json({ success: false, error: "Заполните поле Username" })
        } else if (!validator.matches(username, '^[a-zA-Z0-9_.-]*$')) {
            res.status(400).json({ success: false, error: "Username содержит некорректные символы" })
        }
        else if (!validator.isStrongPassword(password)) {
            res.status(400).json({ success: false, error: "Некорректный пароль" })
        }
        else {
            console.log("Подключаюсь");
            const nets = networkInterfaces();
            const results = Object.create(null); // Or just '{}', an empty object

            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
                    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
                    if (net.family === familyV4Value && !net.internal) {
                        if (!results[name]) {
                            results[name] = [];
                        }
                        results[name].push(net.address);
                    }
                }
            }
            console.log("%j", results);
            pool.on('error', console.error);
            console.log("Начинаю искать");
            const emailSearch = await pool.query(`SELECT * FROM users WHERE email= $1;`, [email]); //Checking if user already exists
            if (emailSearch.rows.length != 0) {
                return res.status(400).json({
                    error: "Пользователь с таким Email уже существует",
                });
            }
            else {
                console.log("Пользователь с таким Email не существует");
                const usernameSearch = await pool.query(`SELECT * FROM users WHERE username= $1;`, [username]); //Checking if user already exists
                if (usernameSearch.rows.length != 0) {
                    return res.status(400).json({
                        error: "Пользователь с таким Username уже существует",
                    });
                }
                else {
                    const salt = await bcrypt.genSalt(10);
                    const salt2 = await bcrypt.genSalt(10);
                    const salt3 = await bcrypt.genSalt(10);
                    console.log("Солим ебать")
                    console.log(salt2)
                    console.log("salt3")
                    console.log(salt3)
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);

                            return res.status(500).json({
                                error: "Код: 101. Ошибка сервера",
                            });
                        }
                        console.log("первый пароль")
                        bcrypt.hash(hash, process.env.LOCAL_PASS_SALT, async (err2, hash2) => {
                            if (err2) {
                                console.log(err2);
                                return res.status(500).json({
                                    error: "Код: 101. Ошибка сервера",
                                });
                            }
                            console.log("Пароли сгенерированы");
                            try {
                                await pool.query(`BEGIN;`);
                                const userInsertString = "INSERT INTO users (username, email, password, pass_salt, regtime) VALUES ($1, $2, $3, $4, $5) RETURNING user_id;"
                                const dbResult = await pool.query(userInsertString, [username, email, hash2, salt, "NOW()"]);
                                var mailKey = crypto.randomBytes(16).toString('hex');
                                var mailToken = crypto.randomBytes(16).toString('hex');
                                console.log("mailKey "+ mailKey);
                                var mailKeyHash = await bcrypt.hash(mailKey, process.env.LOCAL_MAIL_KEY_SALT);
                                console.log("mailKey "+ mailKey);
                                console.log("mailKeyHash "+ JSON.stringify(mailKeyHash));
                                console.log(dbResult.rows[0].user_id);
                                const mailInsertString = `INSERT INTO mail_confirm_tokens (user_id, mail_token, mail_key, created) VALUES ($1, $2, $3, $4);`;
                                await pool.query(mailInsertString, [dbResult.rows[0].user_id, mailToken, mailKeyHash, "NOW()"]);
                                
                                var link = 'https://lampymarket.com/confirmemail?t=' + mailToken + '&k=' + mailKey
                                let result = await transporter.sendMail({
                                    from: '"Сервер" <noreply@lampymarket.com>',
                                    to: email,
                                    subject: 'Подтвердите вашу почту на lampymarket.com',
                                    text: 'Ссылка на подтверждение: ' + link,
                                    html:
                                        'Ссылка на подтверждение: <a href=' + link + '>' + link + '</a>',
                                })
                                console.log(result);
                                await pool.query(`COMMIT;`);
                                return res.status(200).json({ success: true });

                            } catch (err) {
                                console.error('Error in transaction', err)
                                pool.query(`ROLLBACK;`);
                                return res.status(500).json({
                                    error: "Код: 102. Ошибка сервера"
                                })
                            }
                        });
                    });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при формировании запроса!", //Database connection error
        });
    };
}