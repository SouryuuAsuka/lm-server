function GetOrgList (orgsRepository) {
  return async (id) => {
    return orgsRepository.GetOrgList(id);
  }
}
module.exports = GetOrgList;