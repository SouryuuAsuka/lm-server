import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';

@Injectable()
export class OrgsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,

  ) { }
  async getOrgById(orgId: number) {
    try {
      const orgRow = await this.pool.query(`
      SELECT 
      org.org_id AS "orgId", 
      org.name AS name, 
      org.about AS about, 
      org.category AS category, 
      org.avatar AS avatar, 
      org.city AS city, 
      org.public AS public, 
      null as owner,
      json_agg( 
        json_build_object(
          'id', g.product_id, 
          'name', g.name, 
          'about',  g.about, 
          'price',  g.price, 
          'active', g.active, 
          'picture', g.picture, 
          'sold', g.sold, 
          'created', g.created, 
          'orders', g.orders, 
          'catId', g.cat_id, 
          'preparationTime', g.preparation_time
        )
      ) AS products
      FROM organizations AS org 
      LEFT JOIN products AS g
      ON g.org_id = org.org_id 
      WHERE org.org_id = $1 AND org.public = true AND g.active = true
      GROUP BY org.org_id`, [orgId]);
      if (orgRow.rows.length != 0) {
        return orgRow.rows[0];
      } else {
        throw 'Ошибка запроса';
      }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getFullOrgById(orgId: number) {
    try {
      const orgRow = await this.pool.query(`
        SELECT 
        org.org_id AS "orgId", 
        org.name AS name, 
        org.about AS about, 
        org.category AS category, 
        org.avatar AS avatar, 
        org.city AS city, 
        org.public AS public, 
        org.owner AS owner, 
        (SELECT 
          json_agg( 
            json_build_object(
            'quId', qu.qu_id,
            'statusCode', qu.status_code,
            'products', qu.products_array
            )
          )  
          FROM org_quests AS qu 
          WHERE qu.org_id = $1 AND (qu.status_code = 5 AND qu.paid = false)
          GROUP BY qu.org_id
        ) AS quests, 
        (SELECT 
          json_agg( 
            json_build_object(
              'usdSum', p.usd_sum
            )
          )  
          FROM org_payments AS p 
          WHERE p.org_id = $1 AND p.canceled = false
          GROUP BY p.org_id
        ) AS payments, 
        json_agg( 
          json_build_object(
            'id', g.product_id, 
            'name', g.name, 
            'about',  g.about, 
            'price',  g.price, 
            'active', g.active, 
            'picture', g.picture, 
            'sold', g.sold, 
            'created', g.created, 
            'orders', g.orders, 
            'catId', g.cat_id, 
            'preparationTime', g.preparation_time
          )
        ) AS products
        FROM organizations AS org 
        LEFT JOIN products AS g
        ON g.org_id = org.org_id
        WHERE org.org_id = $1 
        GROUP BY org.org_id
        ORDER BY org.created DESC`,
        [orgId])
      if (orgRow.rows.length != 0) {
        return orgRow.rows[0];
      } else {
        throw new Error('Ошибка запроса');
      }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOwnerId(orgId: number) {
    try {
      const selOrgRow = await this.pool.query(`SELECT owner FROM organizations WHERE org_id = $1`, [orgId]);
      return selOrgRow.rows[0].owner;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOrgList(page: number, city: string, category: string) {
    try {
      interface SqlVar {
        page: number;
        city: string;
        category: string;
      }
      let sqlVar: SqlVar = {
        page: (page - 1) * 10,
        city,
        category: "{" + category + "}"
      };
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
              'id', p.product_id, 
              'name', p.name, 
              'about',  p.about, 
              'price',  p.price, 
              'active', p.active, 
              'picture', p.picture, 
              'sold', p.sold, 
              'created', p.created, 
              'orders', p.orders, 
              'catId', p.cat_id, 
              'preparationTime', p.preparation_time
            )
          )  
          FROM products AS p
          WHERE p.org_id = org.org_id
          GROUP BY p.org_id
        ) AS products
        FROM organizations AS org 
        WHERE org.city LIKE $1 AND org.category = ANY($2) AND org.public = true
        GROUP BY org.org_id
        OFFSET $3 LIMIT 10`, [sqlVar.city, sqlVar.category, sqlVar.page]);
      if (orgRow.rows.length != 0) {
        const count = await this.pool.query("SELECT COUNT(*) FROM organizations AS org WHERE org.city LIKE $1 AND org.category = ANY($2)", [sqlVar.city, sqlVar.category])
        if (orgRow.rows.length == 0) {
          return { orgs: [], count: 0 };
        } else {
          return { orgs: orgRow.rows, count: count.rows[0].count };
        }
      } else {
        return { orgs: [], count: 0 };
      }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    };
  }
  async newOrg(org, ownerId: number) {
    try {
      const user = await this.pool.query(`SELECT * FROM users WHERE user_id = $1`, [ownerId])
      if (user.rows[0].user_role === 0 || user.rows[0].telegram === false) {
        throw "Недостаточно прав для создания организации";
      }
      const orgInsertString = "INSERT INTO organizations_request (name, about, owner, category, avatar, city, created, country, street, house, flat, comission) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING org_id"
      await this.pool.query(orgInsertString, [[{ lang: org.lang, text: org.name }], [{ lang: org.lang, text: org.about }], ownerId, org.category, 1, org.city, "NOW()", org.country, org.street, org.house, org.flat, 20]);
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async editOrg(org, ownerId: number, avatar) {
    try {
      const orgInsertString = "UPDATE organizations SET name = $1, about = $2, category = $3, avatar = avatar + $4, city = $5 WHERE owner = $6 AND org_id = $7 RETURNING org_id"
      await this.pool.query(orgInsertString, [org.name, org.about, org.category, avatar, org.city, ownerId, org.orgId]);
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async setPublic(publicType, orgId: number, owner = null) {
    try {
      if (owner === null) {
        const orgInsertString = "UPDATE organizations SET public = $1 WHERE org_id = $2"
        await this.pool.query(orgInsertString, [publicType, orgId])
      } else {
        const orgInsertString = "UPDATE organizations SET public = $1 WHERE owner = $2 AND org_id = $3"
        await this.pool.query(orgInsertString, [publicType, owner, orgId]);
      }
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOwner(orgId: number) {
    try {
      const orgRow = await this.pool.query(`SELECT owner FROM organizations WHERE org_id = $1`, [orgId]);
      return orgRow.rows[0].owner;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOrgQuestList(orgId: number, page = 1, status = '0, 1, 2, 3, 4, 5', paid = 'true, false') {
    try {
      interface SqlVar {
        page: number;
        status: string;
        paid: string;
      }
      let sqlVar: SqlVar = {
        page: (Number(page) - 1) * 20,
        status: "{" + status + "}",
        paid: "{" + paid + "}",
      }
      const count = await this.pool.query(`SELECT COUNT(*) AS count FROM org_quests WHERE org_id = $1 AND status_code = ANY($2)`, [orgId, sqlVar.status]);
      const quRow = await this.pool.query(`
        SELECT 
          qu.qu_id AS qu_id,
          qu.order_id AS order_id,
          qu.products_array AS products,
          qu.paid AS paid,
          qu.commission AS commission,
          qu.status_code AS status_code,
          o.created AS created,
          o.date AS date
        FROM org_quests AS qu
        JOIN orders AS o
        ON o.order_id = qu.order_id
        WHERE qu.org_id = $1 AND qu.status_code = ANY($2) AND qu.paid = ANY($3)
        GROUP BY qu.qu_id, qu.order_id, qu.products_array, qu.paid, qu.status_code, o.created, o.date
        OFFSET $4 LIMIT 20`, [orgId, sqlVar.status, sqlVar.page, sqlVar.paid]);
      return { quests: quRow.rows, count: count.rows[0].count }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}