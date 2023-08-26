function ConfirmRequest (requestRepository, userRepository) {
  return async (requestId) => {
    try{
      const org = await requestRepository.confirmRequest(requestId);
      await userRepository.updateUserRole(org.owner, 3);
      return true;
    } catch(err){
      throw err;
    }
  }
}
module.exports = ConfirmRequest;