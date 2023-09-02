import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';

@Injectable()
export class CartsRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async getCart(cartToken, cartId) {
    try {
      const cartInsertString = "SELECT order_array FROM carts WHERE token = $1 AND cart_id = $2"
      const cartRow = await this.pool.query(cartInsertString, [cartToken, cartId])
      if (cartRow.rows.length == 0) {
        return { cart: [] };
      } else {
        return { cart: cartRow.rows[0]?.order_array };
      }
    } catch (err) {
      console.log(err);
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async getFullCart(cartToken, cartId) {
    try {
      function sortCart(cart, callback) {
        var cartArray = [];
        var prTime = 0;
        for (let i = 0; i < cart.length; i++) {
          if (cart[0].preparation_time > prTime) {
            prTime = cart[0].preparation_time;
          }
          if (cartArray.length == 0) {
            cartArray.push({ org_id: cart[i].org_id, name: cart[i].org_name, order: [{ id: cart[i].good_id, num: cart[i].good_num, price: Number(cart[i].good_price).toFixed(2), saved_price: Number(cart[i].good_saved_price).toFixed(2), preparation_time: cart[i].preparation_time, active: cart[i].active, picture: cart[i].picture, name: cart[i].good_name }] })
            if (cart.length == i + 1) {
              callback(cartArray, prTime / 24)
            }
          } else {
            for (let j = 0; j < cartArray.length; j++) {
              if (cartArray[j].org_id == cart[i].org_id) {
                cartArray[j].order.push({ id: cart[i].good_id, num: cart[i].good_num, name: cart[i].good_name, price: Number(cart[i].good_price).toFixed(2), saved_price: Number(cart[i].good_saved_price).toFixed(2), preparation_time: cart[i].preparation_time, active: cart[i].active, picture: cart[i].picture })
                if (cart.length == i + 1) {
                  callback(cartArray, prTime / 24)
                } else {
                  break;
                }
              }
              else if (cartArray.length == j + 1) {
                cartArray.push({ org_id: cart[i].org_id, name: cart[i].org_name, order: [{ id: cart[i].good_id, num: cart[i].good_num, price: Number(cart[i].good_price).toFixed(2), saved_price: Number(cart[i].good_saved_price).toFixed(2), preparation_time: cart[i].preparation_time, active: cart[i].active, picture: cart[i].picture, name: cart[i].good_name }] })
                if (cart.length == i + 1) {
                  callback(cartArray, prTime / 24)
                }
              }
            }
          }
        }
      }
      const cartInsertString =
        `SELECT 
        elem ->> 'num' AS good_num,
        elem ->> 'id' AS good_id,
        elem ->> 'price' AS good_saved_price,
        g.price AS good_price,
        g.name AS good_name,
        g.active AS active,
        g.picture AS picture,
        g.preparation_time AS preparation_time,
        o.org_id AS org_id,
        o.name AS org_name
        FROM carts AS c
        CROSS JOIN LATERAL unnest(c.order_array) AS elem
        JOIN goods AS g
        ON (elem ->> 'id')::INT = g.good_id
        JOIN organizations AS o
        ON o.org_id = g.org_id
        WHERE c.token = $1 AND c.cart_id = $2`
      const cartRow = await this.pool.query(cartInsertString, [cartToken, cartId]);
      if (cartRow.rows.length == 0) {
        return { cart: [], prTime: null };
      } else {
        sortCart(cartRow.rows, (cartArray, prTime) => {
          return { cart: cartArray, prTime: prTime };
        })
      }
    } catch (err) {
      console.log(err);
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async addProductToCart(cart, cartToken, cartId) {
    try {
      const orgInsertString = "UPDATE carts SET order_array = $1, last_update = $2 WHERE token = $3 AND cart_id = $4"
      const response = await this.pool.query(orgInsertString, [cart, "NOW()", cartToken, cartId]);
      if (response.rowCount === 0) throw new Error("Корзина не найден");
      return true;
    } catch (err) {
      console.log(err);
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async createCart(productId, token) {
    try {
      const producSelectString = `SELECT price FROM goods WHERE good_id = $1`
      const productRow = await this.pool.query(producSelectString, [productId]);
      if (productRow.rowCount === 0) throw new Error("Корзина не найден");
      const orgInsertString = `INSERT INTO carts (token, order_array, last_update) VALUES ($1, $2, $3) RETURNING cart_id`;
      const cartRow = await this.pool.query(orgInsertString, [token, [{ id: productId, num: 1, price: productRow.rows[0].price }], "NOW()"]);
      if (cartRow.rowCount === 0) throw new Error("Корзина не найден");
      return { cartId: cartRow.rows[0].cart_id, token: token };
    } catch (err) {
      console.log(err);
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
}