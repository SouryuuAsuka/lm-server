const GetOrgList = require('@use_cases/org/GetOrgList')

module.exports = (dependecies) => {
  const { orgRepository } = dependecies.DatabaseService;
  const getOrgList = async (req, res, next) => {
    try {
      const GetOrgListCommand = GetOrgList(orgRepository);
      const response = await GetOrgListCommand(req.query.p, req.query.c, req.query.t);
      console.log(JSON.stringify(response));
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
  return { getOrgList };
}