'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");
const cors = require("cors");
require('module-alias/register');

const users = require('@root/src/frameworks/web/routes/users');
const carts = require('@root/src/frameworks/web/routes/carts');
const couriers = require('@root/src/frameworks/web/routes/couriers');
const orgs = require('@root/src/frameworks/web/routes/orgs');
const products = require('@root/src/frameworks/web/routes/products');
const profiles = require('@root/src/frameworks/web/routes/profiles');
const requests = require('@root/src/frameworks/web/routes/requests');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookies());
app.use(cors({
  origin: ['https://cbot.lampymarket.com', 'https://tbot.lampymarket.com', 'https://dbot.lampymarket.com'],
  credentials: true
}));

// Позволяет видеть в req.ip реальный ip пользователя, а не nginx
app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send('Hello World in panel api');
});

app.use('/v1/users', users);
app.use('/v1/carts', carts);
app.use('/v1/couriers', couriers);
app.use('/v1/orgs', orgs);
app.use('/v1/products', products);
app.use('/v1/profiles', profiles);
app.use('/v1/requests', requests);

//app.use(require('./middleware/auth'));

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(`Running on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});
