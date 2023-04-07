'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookies = require("cookie-parser");
const cors = require("cors");
require('module-alias/register');
const schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');


//require('dotenv').config();
//const dotenv = require('dotenv');
//dotenv.config();


//Импорты
const { signin } = require("@controllers/signin");
const { signup } = require("@controllers/signup");
const { signout } = require("@controllers/signout");
const { getProfile } = require("@controllers/getProfile");
const { getProfileOrgList } = require("@controllers/profile/getProfileOrgList");
const { getUser } = require("@controllers/getUser");
const { confirmemail } = require("@controllers/confirmemail");

const { getOrg } = require("@controllers/org/getOrg");
const { getOrgList } = require("@controllers/org/getOrgList");
const { getOrgPayments } = require("@controllers/org/getOrgPayments");

const { getPurposeList } = require("@controllers/org/purpose/getPurposeList");
const { newPurpose } = require("@controllers/org/purpose/newPurpose");
const { editPurpose } = require("@controllers/org/purpose/editPurpose");
const { setActive } = require("@controllers/org/purpose/setActive");

const { newOrg } = require("@controllers/org/newOrg");
const { editOrg } = require("@controllers/org/editOrg");
const { orgConfirm } = require("@controllers/moderation/org/confirm");
const { setOrgComment } = require("@controllers/moderation/org/setOrgComment");
const { getOrgRequest } = require("@controllers/moderation/org/getOrgRequest");
const { getOrgRequestList } = require("@controllers/moderation/org/getOrgRequestList");
const { getPayList } = require("@controllers/moderation/org/pay/getPayList");
const { confirmPay } = require("@controllers/moderation/org/pay/confirmPay");
const { canselPay } = require("@controllers/moderation/org/pay/canselPay");

const { refreshToken } = require("@middleware/refreshToken");

//Импорты middleware 
const { uploadAvatar } = require("@middleware/multer/uploadAvatar")

// приложение
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookies());
app.use(cors({
  origin: ['https://cbot.lampymarket.com', 'https://tbot.lampymarket.com']
}));

// Позволяет видеть в req.ip реальный ip пользователя, а не nginx
app.set('trust proxy', true)

app.get('/', (req, res) => {
  res.send('Hello World in panel api');
});

app.post('/api/signin', signin);
app.post('/api/signup', signup);
app.post('/api/confirmemail', confirmemail);
app.get('/api/token', refreshToken);
app.get('/api/orglist', getOrgList);
app.get('/api/org', getOrg);

app.get('/api/org/purpose', getPurposeList);

app.use(require('./middleware/auth'));

app.get('/api/profile', getProfile);
app.get('/api/profile/orgs', getProfileOrgList);

app.post('/api/org/purpose', newPurpose);
app.post('/api/org/purpose/edit', editPurpose);
app.post('/api/org/purpose/active', setActive);

app.post('/api/org', uploadAvatar.single('avatar'), newOrg);
app.post('/api/org/edit', uploadAvatar.single('avatar'), editOrg);
app.get('/api/org/paylist', getOrgPayments);


app.get('/api/moderation/org', getOrgRequest);
app.post('/api/moderation/org/confirm', orgConfirm);
app.post('/api/moderation/org/setcomment', setOrgComment);
app.get('/api/moderation/org/requestlist', getOrgRequestList);
app.get('/api/moderation/org/pay', getPayList);
app.post('/api/moderation/org/pay/confirm', confirmPay);
app.post('/api/moderation/org/pay/cansel', canselPay);
app.delete('/api/token', signout);
app.get('/api/user', getUser);

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(`Running on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});
