function ConfirmCourier (paymentRepository) {
  return async (tgId) => {
    return await paymentRepository.confirmCourier(tgId);
  }
}
module.exports = ConfirmCourier;