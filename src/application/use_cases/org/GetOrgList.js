function GetOrgList (orgRepository) {
  return async (id) => {
    console.log(JSON.stringify(orgRepository.getOrgList(id)));
    return orgRepository.getOrgList(id);
  }
}
module.exports = GetOrgList;