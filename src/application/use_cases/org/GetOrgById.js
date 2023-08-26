function GetOrgById (orgRepository) {
  return async (id) => {
    return await orgRepository.getOrgById(id);
  }
}
module.exports = GetOrgById;