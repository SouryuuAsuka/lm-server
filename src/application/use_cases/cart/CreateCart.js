function CreateCart(paymentRepository) {
  return async (goodId) => {
    function generateRandomString(length) {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    const token = generateRandomString(6);

    return await paymentRepository.createCart(goodId, token);
  }
}
module.exports = CreateCart;