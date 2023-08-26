function GetUserByUsername (productRepository) {
  return async (username) => {
    return productRepository.getUserByUsername(username);
  }
}
module.exports = GetUserByUsername;