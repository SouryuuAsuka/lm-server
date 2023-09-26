import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';
import { CreateProductDto, UpdateProductDto } from '@src/domain/dtos/product';

@Injectable()
export class ProductsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) {}
  async create(product: CreateProductDto) {
    try {
      const orgInsertString = `INSERT INTO products (name, about, org_id, price, preparation_time, created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id AS "productId"`;
      const response = await this.pool.query(orgInsertString, [
        [{ lang: product.lang, text: product.name }],
        [{ lang: product.lang, text: product.about }],
        product.orgId,
        product.price,
        product.preparationTime * 24,
        'NOW()',
      ]);
      if (response.rowCount === 0) throw new Error('Товар не найден');
      return response.rows[0].productId;
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOwner(productId: number) {
    try {
      const user = await this.pool.query(
        `
        SELECT org.owner as owner FROM organizations AS org
        JOIN products AS g ON org.org_id = g.org_id
        WHERE g.product_id = $1`,
        [productId],
      );
      if (user.rowCount === 0) throw new Error('Организация не найдена');
      return user.rows[0].owner;
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async edit(product: UpdateProductDto) {
    try {
      const orgInsertString =
        'UPDATE products SET name = $1, about = $2, price = $3, preparation_time = $4 WHERE product_id = $5';
      const response = await this.pool.query(orgInsertString, [
        product.name,
        product.about,
        Number(product.price).toFixed(2),
        24 * product.preparationTime,
        product.productId,
      ]);
      if (response.rowCount === 0) throw new Error('Товар не найден');
      return true;
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async setActive(active: boolean, productId: number) {
    try {
      const purUpdateString =
        'UPDATE products SET active = $1 WHERE product_id = $2';
      const response = await this.pool.query(purUpdateString, [
        active,
        productId,
      ]);
      if (response.rowCount === 0) throw new Error('Товар не найден');
      return true;
    } catch (err:any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
