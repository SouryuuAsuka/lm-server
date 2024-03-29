import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@src/presentation/exceptions/exceptions.service';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private exceptionService: ExceptionsService,
  ) { }
  async getUserPassByEmail(email: string) {
    try {
      const {rows} = await this.pool.query(
        `
        SELECT 
        u.user_id AS id
        , u.username AS username
        , u.email AS email
        , u.user_role AS role
        , u.password AS password
        , u.pass_salt AS "passSalt"
        FROM users AS u WHERE email = $1`,
        [email],
      );
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getUserPassByUsername(username: string) {
    try {
      const {rows} = await this.pool.query(
        `
        SELECT 
        u.user_id AS id
        , u.username AS username
        , u.email AS email
        , u.user_role AS role
        , u.password AS password
        , u.pass_salt AS "passSalt"
        FROM users AS u WHERE username = $1`,
        [username],
      );
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async createRefreshToken(userId, tokenDate, tokenHash, ip) {
    try {
      const { rowCount } = await this.pool.query(
        `
        INSERT INTO refresh_tokens (user_id, user_ip, created, token) 
        VALUES ($1, $2, $3, $4)`,
        [userId, ip, tokenDate, tokenHash],
      );
      if (rowCount === 0) throw new Error('Токен не создан');
      return true;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async deleteRefreshTokenById(tokenId: number) {
    try {
      const response = await this.pool.query(
        `DELETE FROM refresh_tokens WHERE token_id = $1`,
        [tokenId],
      );
      if (response.rowCount === 0) throw new Error('Токен не создан');
      return true;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getRefreshTokenById(userId: number) {
    try {
      const { rows } = await this.pool.query(
        `
        SELECT * FROM refresh_tokens WHERE user_id = $1`,
        [userId],
      );
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async searchRefreshToken(userId: number, date, hash) {
    try {
      const { rows } = await this.pool.query(
        `
      SELECT 
      u.user_role AS role
      , r.user_id AS id
      , u.email AS email
      , r.token_id AS "tokenId"
      FROM refresh_tokens AS r 
      JOIN users AS u
      ON r.user_id = u.user_id
      WHERE r.user_id = $1 AND r.created = $2 AND r.token = $3`,
        [userId, date, hash],
      );
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async updateRefreshTokenById(ip, tokenDate, tokenHash, tokenId) {
    try {
      const { rowCount } = await this.pool.query(
        `UPDATE refresh_tokens SET (user_ip, created, token) = ($1, $2, $3) WHERE token_id = $4`,
        [ip, tokenDate, tokenHash, tokenId],
      );
      if (rowCount === 0) throw new Error('Токен не найден');
      return true;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async createUser(username, email, hash, salt) {
    try {
      const userInsertString = `INSERT INTO users (username, email, password, pass_salt, regtime) VALUES ($1, $2, $3, $4, $5) RETURNING user_id AS "userId";`;
      const { rowCount, rows } = await this.pool.query(userInsertString, [
        username,
        email,
        hash,
        salt,
        'NOW()',
      ]);
      if (rowCount === 0) throw new Error('Юзер не создан');
      return rows;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async createMailToken(userId, mailToken, mailKeyHash) {
    try {
      const mailInsertString = `INSERT INTO mail_confirm_tokens (user_id, mail_token, mail_key, created) VALUES ($1, $2, $3, $4);`;
      const { rowCount } = await this.pool.query(mailInsertString, [
        userId,
        mailToken,
        mailKeyHash,
        'NOW()',
      ]);
      if (rowCount === 0) throw new Error('Почтовый токен не создан');
      return true;
    } catch (err: any) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}
