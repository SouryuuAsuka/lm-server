const axios = require('axios');

const cbot = axios.create({
  baseURL: 'http://lm-cbot:3000/webhooks/',
  timeout: 1000
});

module.exports = cbot ;