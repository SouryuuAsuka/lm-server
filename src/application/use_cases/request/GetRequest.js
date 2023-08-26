function GetRequest (requestRepository) {
  return async (requestId) => {
    try{
      return await requestRepository.getRequestById(requestId);
    } catch(err){
      throw err;
    }
  }
}
module.exports = GetRequest;