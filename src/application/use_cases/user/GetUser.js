function GetUser (productRepository) {
  return async (userId) => {
    return productRepository.getUserById(userId);
  }
}
module.exports = GetUser;