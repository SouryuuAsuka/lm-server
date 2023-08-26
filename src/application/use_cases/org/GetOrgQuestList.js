function GetOrgQuestList(orgRepository) {
  return async (isAdmin, userId, orgId, page, status, paid) => {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const owner = await orgRepository.getOwner(orgId);
      if(owner == userId) fullAccess = true;
    }
    if(fullAccess){
      const quests = await orgRepository.getOrgQuestList(orgId, page, status, paid);
      return quests;
    } else {
      throw { error: 'Огранизация не найдена' };
    }
  }
}
module.exports = GetOrgQuestList;