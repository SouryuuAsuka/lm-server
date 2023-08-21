const pool = require("@database/postgresql/db");

module.exports = class OrgsRepositoryPostgresql {
  constructor(pool) {
    this.pool = pool;
  }
  getOrgById(orgId, jwt) {
    let fullAccess = false;
    if (jwt.isAdmin) fullAccess = true;
    else if (jwt.isAuth) {
      try {
        const selOrgRow = pool.query(`SELECT owner FROM organizations WHERE org_id = $1`, [req.params.orgId])
      } catch (err) {
        return res.status(400).json({ success: false, error: "Произошла ошибка при поиске организации" })
      }
      if (err) {
        return res.status(400).json({ success: false, error: "Произошла ошибка при верификации запроса" })
      } else if (selOrgRow.rows.length == 0) {
        return res.status(400).json({ success: false, error: "Произошла ошибка поиске организации" })
      } else if (selOrgRow.rows[0].owner == decoded.userId) {
        aythRequest(req, res)
      } else {
        notAythRequest(req, res);
      }
    }
  }
  getOwnerId() {
    try {
      const selOrgRow = pool.query(`SELECT owner FROM organizations WHERE org_id = $1`, [req.params.orgId])
      return selOrgRow.rows.owner;
    } catch (err) {
      return res.status(400).json({ success: false, error: "Произошла ошибка при поиске организации" })
    }
  }
  async getOrgList(page, city, category) {
    try {
      let sqlVar = {};
      if (page == undefined) sqlVar.page = '0';
      else sqlVar.page = (req.query.p - 1) * 10;
      if (city == undefined) sqlVar.city = '%';
      else sqlVar.city = req.query.c;
      if (category == undefined) sqlVar.category = '{0, 1, 2}';
      else sqlVar.category = "{" + req.query.t + "}";
      console.log("!1")
      const orgRow = await this.pool.query(`
        SELECT 
        org.org_id AS id, 
        org.name AS name, 
        org.about AS about, 
        org.category AS category, 
        org.avatar AS avatar, 
        org.city AS city, 
        org.public AS public, 
        (SELECT 
          json_agg( 
            json_build_object(
              'id', g.good_id, 
              'name', g.name, 
              'about',  g.about, 
              'price',  g.price, 
              'active', g.active, 
              'picture', g.picture, 
              'sold', g.sold, 
              'created', g.created, 
              'orders', g.orders, 
              'cat_id', g.cat_id, 
              'preparation_time', g.preparation_time
            )
          )  
          FROM goods AS g 
          WHERE g.org_id = org.org_id
          GROUP BY g.org_id
        ) AS goods
        FROM organizations AS org 
        WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = true
        GROUP BY org.org_id
        OFFSET $3 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.page])
      console.log("!2")
      if (orgRow.rows.length != 0) {
        var count = await this.pool.query("SELECT COUNT(*) FROM organizations AS org WHERE org.city LIKE $1 AND org.category = ANY($2)", [sqlVar.city, sqlVar.category])
        if (err) {
          throw 'Ошибка поиска';
        } else {
          console.log("!3")
          if (orgRow.rows.length == 0) {
            return { orgs: [], count: 0 };
          } else {
            console.log("!4")
            return { orgs: orgRow.rows, count: count };
          }
        }
      } else {
        return { orgs: [], count: 0 };
      }
    }
    catch (err) {
      console.log(err);
      throw err;
    };
  }
}