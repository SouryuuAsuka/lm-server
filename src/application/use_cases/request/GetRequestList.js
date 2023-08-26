function GetRequestList (requestRepository) {
  return async (page) => {
    try{
      return await requestRepository.getRequestList(page);
    } catch(err){
      throw err;
    }
  }
}
module.exports = GetRequestList;