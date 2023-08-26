function GetCourierList (paymentRepository) {
  return async () => {
    return await paymentRepository.getCourierList();
  }
}
module.exports = GetCourierList;