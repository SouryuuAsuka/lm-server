function GetPaymentList (paymentRepository, orgRepository) {
  return async (isAdmin, orgId, userId, page) => {
    if (isAdmin) {
      const quests = await paymentRepository.getFullPaymentList(orgId, page);
      return quests;
    } else {
      const owner = await orgRepository.getOwner(orgId);
      if(owner == userId){
        const quests = await paymentRepository.getPaymentList(orgId, page);
        return quests;
      } else {
        throw { error: 'Ошибка доступа' };
      };
    }
  }
}
module.exports = GetPaymentList;