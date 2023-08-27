function RefreshToken(userRepository, userComparer, jwtEncrypter) {
  return async (refreshToken, ip) => {
    try {
      const decoded = await jwtEncrypter.verifyRefreshToken(refreshToken);
      console.log(JSON.stringify(decoded))
      const user = await userRepository.searchRefreshToken(decoded.userId, decoded.date, decoded.hash);
      if (user.length === 0) throw 'Токен не найден';
      const nowTime = new Date();
      const tokenCreated = new Date(decoded.date);
      const tokenTime = tokenCreated.setMonth(tokenCreated.getMonth() + 1);
      console.log(JSON.stringify(user));
      if (tokenTime > nowTime) {
        const hash = userComparer.generateHash(8);
        const accessToken = await jwtEncrypter.generateAccessToken(user.userId, user.email, user.userRole);
        const refreshToken = await jwtEncrypter.generateRefreshToken(user.userId, hash, nowTime);
        await userRepository.updateRefreshTokenById(ip, nowTime, hash, user.tokenId);
        return { accessToken: accessToken, refreshToken: refreshToken };
      } else {
        throw "Ошибка сервера"
      }
    } catch (err) {
      throw err;
    }
  }
}
module.exports = RefreshToken;