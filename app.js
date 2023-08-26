'use strict';

const express = require('express');

require('module-alias/register');

const users = require('@routes/user.router');
const carts = require('@routes/cart.router');
const couriers = require('@routes/courier.router');
const orgs = require('@routes/org.router');
const payments = require('@routes/payment.router');
const products = require('@routes/product.router');
const request = require('@routes/request.router');

const ErrorHandler = require('@common/ErrorHandler');

const dependencies = require("@config/projectDependencies");

const app = express();

app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send('Hello World in panel api');
});

app.use('/v1/carts', carts(dependencies));
app.use('/v1/couriers', couriers(dependencies));
app.use('/v1/orgs', orgs(dependencies));
app.use('/v1/orgs/:orgId/payments', payments(dependencies));
app.use('/v1/products', products(dependencies));
app.use('/v1/users', users(dependencies));
app.use('/v1/requests', request(dependencies));

//app.use(require('./middleware/auth'));
app.use(ErrorHandler);

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(`Running on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});
