import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';

@Injectable()
export class CartsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async get(cartToken: string, cartId: number) {
    try {
      const cartInsertString =
        'SELECT order_array FROM carts WHERE token = $1 AND cart_id = $2';
      const { rows } = await this.pool.query(cartInsertString, [
        cartToken,
        cartId,
      ]);
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getFull(cartToken: string, cartId: number) {
    try{
      const cartInsertString = `
      SELECT 
        o.org_id AS org_id,
        o.name AS org_name,
        ARRAY_AGG(
            jsonb_build_object(
                'num', elem ->> 'num',
                'product_id', elem ->> 'id',
                'saved_price', elem ->> 'price',
                'price', g.price,
                'name', g.name,
                'active', g.active,
                'picture', g.picture,
                'preparation_time', g.preparation_time
            )
        ) AS products
      FROM carts AS c
      CROSS JOIN LATERAL unnest(c.order_array) AS elem
      JOIN products AS g ON (elem ->> 'id')::INT = g.product_id
      JOIN organizations AS o ON o.org_id = g.org_id
      WHERE c.token = $1 AND c.cart_id = $2
      GROUP BY o.org_id, o.name`;
      const { rows } = await this.pool.query(cartInsertString, [
        cartToken,
        cartId,
      ]);
      console.log(JSON.stringify(rows));
      return rows;
      
    } catch (err: any) {
      console.log(err);
      this.exceptionService.DatabaseException(err.message);
    }
  }
  /*async getFull(cartToken: string, cartId: number) {
    try {
      function sortCart(cart, callback) {
        const cartArray = [];
        let prTime = 0;
        for (let i = 0; i < cart.length; i++) {
          if (cart[0].preparation_time > prTime) {
            prTime = cart[0].preparation_time;
          }
          if (cartArray.length == 0) {
            cartArray.push({
              org_id: cart[i].org_id,
              name: cart[i].org_name,
              order: [
                {
                  id: cart[i].product_id,
                  num: cart[i].product_num,
                  price: Number(cart[i].product_price).toFixed(2),
                  saved_price: Number(cart[i].product_saved_price).toFixed(2),
                  preparation_time: cart[i].preparation_time,
                  active: cart[i].active,
                  picture: cart[i].picture,
                  name: cart[i].product_name,
                },
              ],
            });
            if (cart.length == i + 1) {
              callback(cartArray, prTime / 24);
            }
          } else {
            for (let j = 0; j < cartArray.length; j++) {
              if (cartArray[j].org_id == cart[i].org_id) {
                cartArray[j].order.push({
                  id: cart[i].product_id,
                  num: cart[i].product_num,
                  name: cart[i].product_name,
                  price: Number(cart[i].product_price).toFixed(2),
                  saved_price: Number(cart[i].product_saved_price).toFixed(2),
                  preparation_time: cart[i].preparation_time,
                  active: cart[i].active,
                  picture: cart[i].picture,
                });
                if (cart.length == i + 1) {
                  callback(cartArray, prTime / 24);
                } else {
                  break;
                }
              } else if (cartArray.length == j + 1) {
                cartArray.push({
                  org_id: cart[i].org_id,
                  name: cart[i].org_name,
                  order: [
                    {
                      id: cart[i].product_id,
                      num: cart[i].product_num,
                      price: Number(cart[i].product_price).toFixed(2),
                      saved_price: Number(cart[i].product_saved_price).toFixed(
                        2,
                      ),
                      preparation_time: cart[i].preparation_time,
                      active: cart[i].active,
                      picture: cart[i].picture,
                      name: cart[i].product_name,
                    },
                  ],
                });
                if (cart.length == i + 1) {
                  callback(cartArray, prTime / 24);
                }
              }
            }
          }
        }
      }
      const cartInsertString = `SELECT 
        elem ->> 'num' AS product_num,
        elem ->> 'id' AS product_id,
        elem ->> 'price' AS product_saved_price,
        g.price AS product_price,
        g.name AS product_name,
        g.active AS active,
        g.picture AS picture,
        g.preparation_time AS preparation_time,
        o.org_id AS org_id,
        o.name AS org_name
        FROM carts AS c
        CROSS JOIN LATERAL unnest(c.order_array) AS elem
        JOIN products AS g
        ON (elem ->> 'id')::INT = g.product_id
        JOIN organizations AS o
        ON o.org_id = g.org_id
        WHERE c.token = $1 AND c.cart_id = $2`;
      const {rows} = await this.pool.query(cartInsertString, [
        cartToken,
        cartId,
      ]);
      console.log(JSON.stringify(rows));
      if (rows.length == 0) {
        return { cart: [], prTime: null };
      } else {
        sortCart(rows, (cartArray, prTime) => {
          return { cart: cartArray, prTime: prTime };
        });
      }
    } catch (err: any) {
      console.log(err);
      this.exceptionService.DatabaseException(err.message);
    }
  }*/
  async addProduct(cart, cartToken, cartId) {
    try {
      const orgInsertString =
        'UPDATE carts SET order_array = $1, last_update = $2 WHERE token = $3 AND cart_id = $4';
      const { rowCount } = await this.pool.query(orgInsertString, [
        cart,
        'NOW()',
        cartToken,
        cartId,
      ]);
      if (rowCount === 0) throw new Error('Корзина не найден');
      return true;
    } catch (err: any) {
      console.log(err);
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async create(productId, token) {
    try {
      const producSelectString = `SELECT price FROM products WHERE product_id = $1`;
      const productRow = await this.pool.query(producSelectString, [productId]);
      if (productRow.rowCount === 0) throw new Error('Корзина не найден');
      const orgInsertString = `INSERT INTO carts (token, order_array, last_update) VALUES ($1, $2, $3) RETURNING cart_id`;
      const cartRow = await this.pool.query(orgInsertString, [
        token,
        [{ id: productId, num: 1, price: productRow.rows[0].price }],
        'NOW()',
      ]);
      if (cartRow.rowCount === 0) throw new Error('Корзина не найден');
      return { cartId: cartRow.rows[0].cart_id, token: token };
    } catch (err: any) {
      console.log(err);
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
