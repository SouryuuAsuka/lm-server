function EditOrg (orgRepository) {
  return async (data, ownerId) => {
    return await orgRepository.editOrg(data, ownerId);
  }
}
module.exports = EditOrg;