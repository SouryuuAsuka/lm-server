function GetOrgList (orgRepository) {
  return async (page, city, category) => {
    console.log(JSON.stringify(await orgRepository.getOrgList(page, city, category)));
    return await orgRepository.getOrgList(page, city, category);
  }
}
module.exports = GetOrgList;