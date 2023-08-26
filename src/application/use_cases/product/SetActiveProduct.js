function SetActiveProduct (productRepository) {
  return async (isAdmin, userId, productId, status) => {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await productRepository.getOwnerOfProduct(productId)
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await productRepository.setActiveProduct(status, productId);
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
}
module.exports = SetActiveProduct;