function GetOrgList (orgRepository) {
  return async (id) => {
    return orgRepository.getOrgList(id);
  }
}
module.exports = GetOrgList;