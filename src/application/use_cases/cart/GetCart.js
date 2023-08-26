function GetCart (paymentRepository) {
  return async (type, cartToken, cartId) => {
    if (type === 'full') {
      return await paymentRepository.getFullCart(cartToken, cartId);
    } else {
      return await paymentRepository.getCart(cartToken, cartId);
    }
  }
}
module.exports = GetCart;