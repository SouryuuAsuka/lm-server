function RefreshToken(userRepository, userComparer, jwtEncrypter) {
  return async (userId, refreshToken, ip) => {
    try {
      await jwtEncrypter.verifyRefreshToken(refreshToken);
      const user = await userRepository.searchRefreshToken(userId, date, hash);
      if (user.length === 0) 'Токен не найден';
      const nowTime = new Date();
      const tokenCreated = new Date(decoded.date);
      const tokenTime = tokenCreated.setMonth(tokenCreated.getMonth() + 1);
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