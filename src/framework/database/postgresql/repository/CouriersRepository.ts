import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';
@Injectable()
export class CouriersRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) {}
  async getCourierList() {
    try {
      const count = await this.pool.query(
        'SELECT COUNT(*) FROM tg_couriers WHERE confirm = false',
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
        if (i + 1 == couriersRow.rows.length) {
          return { couriers: couriersList, count: count };
        }
      }
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async confirmCourier(tgId) {
    try {
      const tgRow = await this.pool.query(
        `
        UPDATE tg_couriers
        SET confirm = true
        WHERE tg_id = $1
        RETURNING app_id`,
        [tgId],
      );
      if (tgRow.rowCount === 0) throw new Error('Курьер не найден');
      return tgRow.rows[0].app_id;
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
