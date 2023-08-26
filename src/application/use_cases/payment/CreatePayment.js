function CreatePayment (paymentRepository) {
  return async (orgId, userId, questsId) => {
    const quests = await paymentRepository.setPaidQuests(questsId);
    var sum = 0
      quests.map((quest) => {
        var quSum = 0
        quest.goods_array.map((good) => {
          quSum += Number(good.price) * Number(good.num)
        })
        sum += Math.floor((quSum * (1 - (Number(quest.commission) / 100))) * 100) / 100
      })
      await paymentRepository.updatePaymentsById(orgId, userId, questsId, sum );
    return sum;
  }
}
module.exports = CreatePayment;