import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';
@Injectable()
export class CouriersRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async getList() {
    try {
      const count = await this.pool.query(
        'SELECT COUNT(*)::INT FROM tg_couriers WHERE confirm = false',
        [],
      );
      if (count.rows[0].count === 0) return { couriers: [], count: 0 };
      const couriersRow = await this.pool.query(
        `
        SELECT 
        tg_id, username, country, city, firstname, lastname
        FROM tg_couriers
        WHERE confirm = false`,
        [],
      );
      const couriersList = [];
      for (let i = 0; i < couriersRow.rows.length; i++) {
        let country;
        let city;
        if (couriersRow.rows[i].country == 'ge') {
          country = 'Грузия';
        }
        if (couriersRow.rows[i].city == 'tbi') {
          city = 'Тбилиси';
        }
        couriersList.push({
          tgId: couriersRow.rows[i].tg_id,
          username: couriersRow.rows[i].username,
          firstname: couriersRow.rows[i].firstname,
          lastname: couriersRow.rows[i].lastname,
          country: country,
          city: city,
        });
      }
      return { couriers: couriersList, count: count.rows[0].count };
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async confirm(tgId: number) {
    try {
      const {rowCount, rows} = await this.pool.query(
        `
        UPDATE tg_couriers
        SET confirm = true
        WHERE tg_id = $1
        RETURNING app_id AS "appId"`,
        [tgId],
      );
      if (rowCount === 0) throw new Error('Курьер не найден');
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
