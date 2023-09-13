import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';
@Injectable()
export class PaymentsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) {}
  async cancelPayment(orgId: number, paymentId: number) {
    try {
      const payRow = await this.pool.query(
        `UPDATE org_payments SET canceled = true WHERE pay_id = $1 AND org_id = $2 RETURNING ord_array`,
        [paymentId, orgId],
      );
      if (payRow.rowCount === 0) throw new Error('Выплата не найдена');
      const response = await this.pool.query(
        `UPDATE org_quests SET paid=false WHERE qu_id = ANY($1)`,
        [payRow.rows[0].ord_array],
      );
      if (response.rowCount === 0)
        throw new Error('Ошибка при изменении выплат');
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getFullPaymentList(orgId: number, page: number = 1) {
    try {
      const sqlVar = { offset: (page - 1) * 10 };
      const orgRow = await this.pool.query(
        `
          SELECT 
            COUNT(*) AS count
            , u.username AS payername
            , p.pay_id AS pay_id
            , p.usd_sum AS usd_sum
            , p.canceled AS canceled
            , p.created AS created
          FROM org_payments AS p
          LEFT JOIN users AS u                            
          ON p.payer_id = u.user_id
          WHERE p.org_id = $1
          GROUP BY p.pay_id, u.user_id
          OFFSET $2 LIMIT 10`,
        [orgId, sqlVar.offset],
      );
      return orgRow.rows;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getPaymentList(orgId: number, page: number = 1) {
    try {
      const sqlVar = { offset: (page - 1) * 10 };
      const orgRow = await this.pool.query(
        `
        SELECT 
          COUNT(*) AS count
          , p.pay_id AS pay_id
          , p.usd_sum AS usd_sum
          , p.canceled AS canceled
          , p.created AS created
        FROM org_payments AS p
        WHERE p.org_id = $1
        GROUP BY p.pay_id
        OFFSET $2 LIMIT 10`,
        [orgId, sqlVar.offset],
      );
      return orgRow.rows;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async setPaidQuests(quests) {
    try {
      const quRow = await this.pool.query(
        `
        UPDATE org_quests
        SET paid=true
        WHERE qu_id = ANY($1) AND paid=false AND status_code=5 
        RETURNING products_array, commission`,
        [quests],
      );
      if (quRow.rowCount === 0)
        throw new Error('Ошибка при регистрации выплат');
      return quRow.rows;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async updatePaymentsById(orgId: number, userId: number, quests, sum) {
    try {
      const response = await this.pool.query(
        `
        INSERT INTO org_payments
        (org_id, created, payer_id, ord_array, usd_sum)
        VALUES ($1, $2, $3, $4, $5)`,
        [orgId, 'NOW()', userId, quests, sum.toFixed(1)],
      );
      if (response.rowCount === 0) throw new Error('Ошибка при поиске выплаты');
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
