'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookies = require("cookie-parser");
const cors = require("cors");
require('module-alias/register');

const users = require('@routes/users');
const carts = require('@routes/carts');
const couriers = require('@routes/couriers');
const orgs = require('@routes/orgs');
const products = require('@routes/products');
const profiles = require('@routes/profiles');
const requests = require('@routes/requests');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookies());
app.use(cors({
  origin: ['https://lampymarket.com', 'https://cbot.lampymarket.com', 'https://tbot.lampymarket.com', 'https://dbot.lampymarket.com'],
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
