function EditProduct (productRepository, avatarRepository) {
  return async (isAdmin, userId, product, file) => {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await productRepository.getOwnerOfProduct(product.productId)
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await productRepository.editProduct(product);
      await avatarRepository.savePicture(file, product.productId, 'goods');
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
}
module.exports = EditProduct;