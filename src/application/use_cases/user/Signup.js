function Signup(userRepository, userComparer, userTrasporter) {
  return async (username, password, email) => {
    try {
      const emailSearch = await userRepository.getUserPassByEmail(email); //Checking if user already exists
      if (Object.keys(emailSearch).length === 0) {
        throw "Пользователь с таким Email уже существует";
      }
      const usernameSearch = await userRepository.getUserPassByUsername(username); //Checking if user already exists
      if (Object.keys(usernameSearch).length === 0) {
        throw "Пользователь с таким Username уже существует";
      }
      const salt = userComparer.generateSalt(10);
      const hash = await userComparer.getPasswordHash(password, salt);
      const user = await userRepository.createUser(username, email, hash, salt);
      const mailKey = userComparer.generateHash(16);
      const mailToken = userComparer.generateHash(16);
      const mailKeyHash = userRepository.getMailHash(mailKey);
      await userComparer.createMailToken(user.userId, mailToken, mailKeyHash);
      const link = 'https://lampymarket.com/confirmemail?t=' + mailToken + '&k=' + mailKey;
      await userTrasporter.sendLinkToConfirmMail(email, link);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Signup;