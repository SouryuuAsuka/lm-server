function ConfirmEmail(userRepository, userComparer, jwtEncrypter) {
  return async (mailToken, mailKey, ip) => {
    try {
      const mailConfirm = await userRepository.getMailConfirm(mailToken);
      const mailKeyHash = await userComparer.getMailHash(mailKey);
      if (mailConfirm.mailKey != mailKeyHash) {
        throw "Данные валидации не верны";
      }
      const user = await userRepository.getUserPassById(mailConfirm.userId);
      const tokenHash = await userComparer.generateHash(8);
      const nowDate = new Date();
      const accessToken = await jwtEncrypter.generateAccessToken(user.userId, user.email, user.userRole);
      const refreshToken = await jwtEncrypter.generateRefreshToken(user.userId, tokenHash, nowDate);
      await userRepository.updateUserRole(user.userId, 1);
      await userRepository.createRefreshToken(user.userId, nowDate, tokenHash, ip);
      await userRepository.deleteMailConfirm(user.userId);
      let profileLink;
      if (user.username != '') {
        profileLink = user.username;
      } else {
        profileLink = "id" + user.userId;
      }
      return { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink };
    } catch (err) {
      throw err;
    }
  }
}
module.exports = ConfirmEmail;