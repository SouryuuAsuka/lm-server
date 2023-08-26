module.exports = class PostgresqlPaymentRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async cancelPayment(orgId, paymentId) {
    try {
      const payRow = await this.pool.query(`UPDATE org_payments SET canceled = true WHERE pay_id = $1 AND org_id = $2 RETURNING ord_array`, [paymentId, orgId]);
      await this.pool.query(`UPDATE org_quests SET paid=false WHERE qu_id = ANY($1)`, [payRow.rows[0].ord_array]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getFullPaymentList(orgId, page = 1) {
    try {
      let sqlVar;
      sqlVar.offset = (page - 1) * 10;
      const orgRow = await this.pool.query(`
          SELECT 
            COUNT(*) AS count,
            u.username AS payername,
            p.pay_id AS pay_id,
            p.usd_sum AS usd_sum,
            p.canceled AS canceled,
            p.created AS created
          FROM org_payments AS p
          LEFT JOIN users AS u                            
          ON p.payer_id = u.user_id
          WHERE p.org_id = $1
          GROUP BY p.pay_id, u.user_id
          OFFSET $2 LIMIT 10`, [orgId, sqlVar.offset])
      return orgRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getPaymentList(orgId, page = 1) {
    try {
      let sqlVar;
      sqlVar.offset = (page - 1) * 10;
      const orgRow = await this.pool.query(`
        SELECT 
          COUNT(*) AS count,
          p.pay_id AS pay_id,
          p.usd_sum AS usd_sum,
          p.canceled AS canceled,
          p.created AS created
        FROM org_payments AS p
        WHERE p.org_id = $1
        GROUP BY p.pay_id
        OFFSET $2 LIMIT 10`, [orgId, sqlVar.offset]);
      return orgRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async setPaidQuests(quests) {
    try {
      const quRow = await this.pool.query(`
        UPDATE org_quests
        SET paid=true
        WHERE qu_id = ANY($1) AND paid=false AND status_code=5 RETURNING goods_array, commission`,
        [quests]);
      return quRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updatePaymentsById(orgId, userId, quests, sum) {
    try {
      await this.pool.query(`
        INSERT INTO org_payments
        (org_id, created, payer_id, ord_array, usd_sum)
        VALUES ($1, $2, $3, $4, $5)`,
        [orgId, "NOW()", userId, quests, sum.toFixed(1)])
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}