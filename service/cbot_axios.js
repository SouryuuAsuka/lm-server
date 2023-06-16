const axios = require('axios');

const cbot = axios.create({
  baseURL: 'http://lm-cbot:3000/webhook/',
  timeout: 1000
});

module.exports = cbot ;