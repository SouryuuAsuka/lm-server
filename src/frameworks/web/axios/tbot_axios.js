const axios = require('axios');

const tbot = axios.create({
  baseURL: 'http://lm-tbot:3000/webhook/',
  timeout: 1000
});

module.exports = tbot ;