function AddProductToCart(paymentRepository) {
  return async (cart, cartToken, cartId) => {
    return await paymentRepository.addProductToCart(cart, cartToken, cartId);
  }
}
module.exports = AddProductToCart;