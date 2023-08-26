function SetPublic (orgRepository) {
  return async (id) => {
    return await orgRepository.setPublic(id);
  }
}
module.exports = SetPublic;