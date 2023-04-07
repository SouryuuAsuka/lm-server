const axios = require('axios');

const cbot = axios.create({
  baseURL: 'http://lm-cbot/weebhooks/',
  timeout: 1000
});

module.exports = cbot ;