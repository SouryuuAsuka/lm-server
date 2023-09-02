import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async getUserPassByEmail(email: string) {
    try {
      const userRow = await this.pool.query(`
        SELECT 
        u.user_id AS "userId"
        , u.username AS username
        , u.email AS email
        , u.user_role AS "userRole"
        , u.password AS password
        , u.pass_salt AS "passSalt"
        FROM users AS u WHERE email = $1`
        , [email])
      return userRow.rows[0];
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async getUserPassByUsername(username: string) {
    try {
      const userRow = await this.pool.query(`
        SELECT 
        u.user_id AS "userId"
        , u.username AS username
        , u.email AS email
        , u.user_role AS "userRole"
        , u.password AS password
        , u.pass_salt AS "passSalt"
        FROM users AS u WHERE username = $1`
        , [username])
      return userRow.rows[0];
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async createRefreshToken(userId, tokenDate, tokenHash, ip) {
    try {
      const response = await this.pool.query(`
        INSERT INTO refresh_tokens (user_id, user_ip, created, token) 
        VALUES ($1, $2, $3, $4)`
        , [userId, ip, tokenDate, tokenHash]);
      if (response.rowCount === 0) throw new Error("Токен не создан");
      return true;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async deleteRefreshTokenById(tokenId:number) {
    try {
      const response = await this.pool.query(`DELETE FROM refresh_tokens WHERE token_id = $1`, [tokenId]);
      if (response.rowCount === 0) throw new Error("Токен не создан");
      return true;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async getRefreshTokenById(userId:number) {
    try {
      const response = await this.pool.query(`
        SELECT * FROM refresh_tokens WHERE user_id = $1`
        , [userId]);
      return response.rows[0];
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async searchRefreshToken(userId:number, date, hash) {
    try {
      const response = await this.pool.query(`
      SELECT 
      u.user_role AS "userRole"
      , r.user_id AS "userId"
      , u.email AS email
      , r.token_id AS "tokenId"
      FROM refresh_tokens AS r 
      JOIN users AS u
      ON r.user_id = u.user_id
      WHERE r.user_id = $1 AND r.created = $2 AND r.token = $3`, [userId, date, hash]);
      return response.rows[0];
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
  async updateRefreshTokenById(ip, tokenDate, tokenHash, tokenId) {
    try {
      const response = await this.pool.query(`UPDATE refresh_tokens SET (user_ip, created, token) = ($1, $2, $3) WHERE token_id = $4`, [ip, tokenDate, tokenHash, tokenId]);
      if (response.rowCount === 0) throw new Error('Токен не найден');
      return true;
    } catch (err) {
      throw new this.exceptionService.DatabaseException(err.message);
    }
  }
}