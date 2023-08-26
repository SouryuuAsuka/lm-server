function GetFullOrgById (orgRepository) {
  return async (id) => {
    return await orgRepository.getFullOrgById(id);
  }
}
module.exports = GetFullOrgById;