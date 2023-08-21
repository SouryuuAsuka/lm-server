function GetOrgList (orgRepository) {
  return async (id) => {
    console.log(JSON.stringify(await orgRepository.getOrgList(id)));
    return await orgRepository.getOrgList(id);
  }
}
module.exports = GetOrgList;