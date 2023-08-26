function CancelPayment (paymentRepository) {
  return async (data, ownerId) => {
    return await paymentRepository.cancelPayment(data, ownerId);
  }
}
module.exports = CancelPayment;