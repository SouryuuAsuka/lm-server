const axios = require('axios');

const dbot = axios.create({
  baseURL: 'http://lm-dbot:3000/webhook/',
  timeout: 1000
});

module.exports = dbot ;