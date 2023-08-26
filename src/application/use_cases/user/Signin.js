function Signin(userRepository, userComparer, jwtEncrypter) {
  return async (login, password, ip, type) => {
    try {
      let user;
      if (type === 'email') {
        user = await userRepository.getUserPassByEmail(login);
      } else if (type === 'username') {
        user = await userRepository.getUserPassByUsername(login);
      } else {
        throw 'Login type error';
      }
      const hash = await userComparer.getPasswordHash(password, user.passSalt)
      if (hash !== user.password) {
        throw 'Login error';
      }
      const tokenHash = await userComparer.generateHash(8);
      const tokenDate = new Date();
      await userRepository.createRefreshToken(user.userId, tokenDate, tokenHash, ip);
      const accessToken = await jwtEncrypter.generateAccessToken(user.userId, user.email, user.userRole);
      const refreshToken = await jwtEncrypter.generateRefreshToken(user.userId, tokenHash, tokenDate);
      let profileLink;
      if (user.username !== '') {
        profileLink = user.username;
      } else {
        profileLink = "id" + user.userId;
      }
      return { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink }
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Signin;