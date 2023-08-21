const GetOrgList = require('@use_cases/org/GetOrgList')

module.exports = (dependecies) => {
  const { orgRepository } = dependecies.DatabaseService;
  const getOrgList = (req, res, next) => {
    const GetOrgListCommand = GetOrgList(orgRepository);
    GetOrgListCommand(req.query.p, req.query.c, req.query.t).then((response) => {
      console.log(JSON.stringify(response));
      res.json(response);
    }).catch((err) => {
      next(err);
    })
  }
  return { getOrgList };
}