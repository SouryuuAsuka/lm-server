export default function GetOrgList(orgsRepository) {
  return async (id) => {
    return orgsRepository.GetOrgList(id);
  }
}