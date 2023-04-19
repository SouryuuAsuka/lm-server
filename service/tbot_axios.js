const axios = require('axios');

const cbot = axios.create({
  baseURL: 'http://lm-tbot:3000/webhooks/',
  timeout: 1000
});

module.exports = cbot ;