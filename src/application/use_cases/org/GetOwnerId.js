function GetOwnerId (orgRepository) {
  return async (id) => {
    return await orgRepository.getOwnerId(id);
  }
}
module.exports = GetOwnerId;