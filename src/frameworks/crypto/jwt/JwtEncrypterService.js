const JwtTokenEncrypter = require('@crypto/jwt/JwtTokenEncrypter')

const jwt = require("jsonwebtoken");

module.exports = class JwtEncrypterService {
  constructor() {
    this.jwt = jwt;
    this.jwtEncrypter = new JwtTokenEncrypter(this.jwt);
  }
};