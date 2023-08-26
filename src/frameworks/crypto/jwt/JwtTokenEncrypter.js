module.exports = class BcryptUserComparer {
  constructor(jwt) {
    this.jwt = jwt;
  }
  async generateAccessToken(userId, email, userRole) {
    try {
      const accessToken = this.jwt.sign( 
        {
          userId: userId,
          email: email,
          userRole: userRole
        },
        process.env.ACCESS_KEY_SECRET,
        {
          expiresIn: '5m'
        }
      );
      return accessToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateRefreshToken(userId, tokenHash, tokenDate) {
    try {
      const refreshToken = this.jwt.sign( 
        {
          userId: userId,
          date: tokenDate,
          hash: tokenHash
        },
        process.env.REFRESH_KEY_SECRET,
        {
          expiresIn: '30d'
        }
      );
      return refreshToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async verifyRefreshToken(token) {
    try {
      await this.jwt.verify(token, process.env.REFRESH_KEY_SECRET);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}