const tbot = require("@axios/tbot_axios");

function SetRequestComment(requestRepository) {
  return async (requestId) => {
    try {
      const request = await requestRepository.setRequestComment(requestId);
      await tbot.post('sendmsg', {
        key: process.env.TBOT_ACCESS_KEY,
        id: request.app_id,
        text: msgText
      })
        .catch(function (error) {
          throw "Ошибка при отправке сообщения в бот";
        })
      return true
    } catch (err) {
      throw err;
    }
  }
}
module.exports = SetRequestComment;