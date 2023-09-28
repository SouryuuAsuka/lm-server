import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';

@Injectable()
export class RequestsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async getRequestById(requestId: number) {
    try {
      const { rows, rowCount } = await this.pool.query(
        `
        SELECT 
        o.org_id AS "orgId"
        , o.name AS name
        , o.about AS about
        , o.avatar AS avatar
        , o.category AS category
        , o.city AS city
        , o.moderator_comment AS "moderatorComment"
        , u.email AS email
        , u.firstname AS firstname
        , u.surname AS surname
        , u.telegram AS telegram
        , t.username AS "tgUsername"
        , t.app_id AS "appId"
        FROM organizations_request AS o
        LEFT JOIN users AS u
        ON o.owner = u.user_id
        LEFT JOIN tg_tech_users AS t
        ON u.user_id = t.user_id
        WHERE o.org_id = $1`,
        [requestId],
      );
      if (rowCount === 0) throw new Error('Организация не найдена');
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async confirmRequest(requestId: number) {
    try {
      const newOrgRow = await this.pool.query(
        `INSERT INTO organizations AS o (owner, name, about, category, created, avatar, country, city, street, house, flat) 
        SELECT org_r.owner, org_r.name, org_r.about, org_r.category, org_r.created, org_r.avatar, org_r.country, org_r.city, org_r.street, org_r.house, org_r.flat
        FROM organizations_request AS org_r
        WHERE org_r.org_id = $1
        RETURNING o.org_id, o.owner`,
        [requestId],
      );
      if (newOrgRow.rowCount === 0) throw new Error('Организация не найдена');
      const response = await this.pool.query(
        `DELETE FROM organizations_request WHERE org_id = $1;`,
        [requestId],
      );
      if (response.rowCount === 0)
        throw new Error('Ошибка при переносе организации');
      return newOrgRow.rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getRequestList(page: number) {
    try {
      const sqlVar = { page: (page - 1) * 10 };
      const { rows } = await this.pool.query(
        `
        SELECT 
        o.org_id AS id
        , o.name AS name
        , o.about AS about
        , o.category AS category
        , o.created AS created
        , o.city AS city
        , o.avatar AS avatar
        FROM organizations_request AS o
        OFFSET $1 LIMIT 10`,
        [sqlVar.page],
      );
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async setRequestComment(requestId: number, comment: string) {
    try {
      const { rows, rowCount } = await this.pool.query(`
        UPDATE organizations_request 
        SET moderator_comment = $1 
        WHERE org_id = $2 
        RETURNING app_id AS "appId";`,
        [comment, requestId],
      );
      if (rowCount === 0)
        throw new Error('Ошибка при переносе организации');
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
