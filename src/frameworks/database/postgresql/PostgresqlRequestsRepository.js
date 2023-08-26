module.exports = class PostgresqlCourierRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async getRequestById(requestId) {
    try {
      const requestRow = await this.pool.query(`
        SELECT 
        o.org_id AS "orgId",
        o.name AS name, 
        o.about AS about, 
        o.avatar AS avatar, 
        o.category AS category, 
        o.city AS city, 
        o.moderator_comment AS "moderatorComment",
        u.email AS email, 
        u.firstname AS firstname, 
        u.surname AS surname, 
        u.telegram AS telegram,
        t.username AS "tgUsername"
        FROM organizations_request AS o
        LEFT JOIN users AS u
        ON o.owner = u.user_id
        LEFT JOIN tg_tech_users AS t
        ON u.user_id = t.user_id
        WHERE o.org_id = $1`, [requestId]);
      if (requestRow.rows.length === 0) throw "Организация не найдена";
      return requestRow.rows[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async confirmRequest(requestId) {
    try {
      const newOrgRow = await this.pool.query(
        `INSERT INTO organizations AS o (owner, name, about, category, created, avatar, country, city, street, house, flat) 
        SELECT org_r.owner, org_r.name, org_r.about, org_r.category, org_r.created, org_r.avatar, org_r.country, org_r.city, org_r.street, org_r.house, org_r.flat
        FROM organizations_request AS org_r
        WHERE org_r.org_id = $1
        RETURNING o.org_id, o.owner`, [requestId]);
      if (newOrgRow.rows.length === 0) {
        await this.pool.query(`DELETE FROM organizations_request WHERE org_id = $1;`, [requestId]);
        return newOrgRow.rows[0]; 
      } else {
        throw "Организация не найдена";
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getRequestList(page) {
    try {
      let sqlVar;
      sqlVar.page = (page - 1) * 10;
      const requestRow = await this.pool.query(`
        SELECT 
        o.org_id AS id,
        o.name AS name,
        o.about AS about,
        o.category AS category,
        o.created AS created,
        o.city AS city,
        o.avatar AS avatar
        FROM organizations_request AS o
        OFFSET $1 LIMIT 10`, [sqlVar.page]);
      return requestRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async setOrgComment(requestId, comment) {
    try {
      const requestRow = this.pool.query(`UPDATE organizations_request SET moderator_comment = $1 WHERE org_id = $2 RETURNING app_id AS addId;`, [comment, requestId]);
      return requestRow.rows[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}