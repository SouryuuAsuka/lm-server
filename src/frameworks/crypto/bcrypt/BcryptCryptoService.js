const BcryptUserComparer = require('@crypto/bcrypt/BcryptUserComparer')

const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = class BcryptCryptoService {
  constructor() {
    this.hasher=bcrypt;
    this.crypto=crypto;
    this.userComparer = new BcryptUserComparer(this.pool, this.hasher, this.crypto);
  }
};