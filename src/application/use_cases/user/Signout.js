function Signout(userRepository, jwtEncrypter) {
  return async (userId, refreshToken) => {
    try {
      await jwtEncrypter.verifyRefreshToken(refreshToken);
      const tokenRow = await userRepository.getRefreshTokenById(userId);
      if (tokenRow.length === 0) throw "Пользователь не найден";
      const nowTime = new Date();
      let tokenId = null;
      tokenRow.forEach(element => {
        if (tokenId) return;
        const createdTime = element.created;
        const tokenCreated = new Date(createdTime);
        const tokenTime = tokenCreated.setMonth(tokenCreated.getMonth() + 1);
        if (element.token == refreshToken && tokenTime > nowTime) {
          tokenId = element.token;
          return;
        }
      });
      if(!tokenId) throw "Ошибка при верификации токена"
      await userRepository.deleteRefreshTokenById(tokenId);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Signout;