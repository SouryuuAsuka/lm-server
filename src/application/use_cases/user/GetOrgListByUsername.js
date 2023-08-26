function GetOrgListByUsername (productRepository) {
  return async (username, page, city, category) => {
    return productRepository.getOrgListByUsername(username, page, city, category);
  }
}
module.exports = GetOrgListByUsername;