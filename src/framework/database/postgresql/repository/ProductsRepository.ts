import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';
import { CreateProductDto, UpdateProductDto } from '@domain/dtos/product';

@Injectable()
export class ProductsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async createProduct(product: CreateProductDto) {
    try {
      const orgInsertString = `INSERT INTO goods (name, about, org_id, price, preparation_time, created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING good_id AS "productId"`;
      const response = await this.pool.query(orgInsertString, [[{ lang: product.lang, text: product.name }], [{ lang: product.lang, text: product.about }], product.orgId, product.price, product.preparationTime * 24, "NOW()"]);
      if (response.rowCount === 0) throw new Error("Товар не найден");
      return response.rows[0].productId;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOwnerOfProduct(productId: number) {
    try {
      const user = await this.pool.query(`
        SELECT org.owner as owner FROM organizations AS org
        JOIN goods AS g ON org.org_id = g.org_id
        WHERE g.good_id = $1`, [productId]);
      if (user.rowCount === 0) throw new Error("Организация не найдена");
      return user.rows[0].owner;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async editProduct(product: UpdateProductDto){
    try {
      const orgInsertString = "UPDATE goods SET name = $1, about = $2, price = $3, preparation_time = $4 WHERE good_id = $5";
      const response = await this.pool.query(orgInsertString, [product.name, product.about, Number(product.price).toFixed(2), (24 * product.preparationTime), product.productId]);
      if (response.rowCount === 0) throw new Error("Товар не найден");
      return true;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async setActiveProduct(status: string, productId: number,) {
    try {
      const purUpdateString = "UPDATE goods SET active = $1 WHERE good_id = $2";
      const response = await this.pool.query(purUpdateString, [status, productId]);
      if (response.rowCount === 0) throw new Error("Товар не найден");
      return true;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
}