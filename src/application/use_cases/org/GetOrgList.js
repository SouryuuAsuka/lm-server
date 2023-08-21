function GetOrgList (orgRepository) {
  return async (id) => {
    return orgRepository.GetOrgList(id);
  }
}
module.exports = GetOrgList;