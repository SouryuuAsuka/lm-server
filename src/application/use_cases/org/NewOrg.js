function NewOrg (orgRepository) {
  return async (data, ownerId) => {
    return await orgRepository.newOrg(data, ownerId);
  }
}
module.exports = NewOrg;