function CreateProduct (productRepository, orgRepository, avatarRepository) {
  return async (isAdmin, userId, product, file) => {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await orgRepository.getOwner(userId)
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await productRepository.createProduct(product);
      await avatarRepository.savePicture(file, product.productId, 'goods');
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
}
module.exports = CreateProduct;