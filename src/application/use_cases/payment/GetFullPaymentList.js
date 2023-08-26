function GetFullPaymentList (paymentRepository) {
  return async (orgId, page) => {
    return await paymentRepository.getFullPaymentList(orgId, page);
  }
}
module.exports = GetFullPaymentList;