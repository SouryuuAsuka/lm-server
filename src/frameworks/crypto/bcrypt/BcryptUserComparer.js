module.exports = class BcryptUserComparer {
  constructor(hasher, crypto) {
    this.hasher = hasher;
    this.crypto = crypto;
  }
  async getPasswordHash(password, passSalt) {
    try {
      const hash = await this.hasher.hash(password, passSalt);
      return await this.hasher.hash(hash, process.env.LOCAL_PASS_SALT);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getMailHash(mailKey) {
    try {
      return await this.hasher.hash(mailKey, process.env.LOCAL_MAIL_KEY_SALT);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateHash(length) {
    try {
      return this.crypto.randomBytes(length).toString('hex');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateSalt(length) {
    try {
      return this.hasher.genSalt(length);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}