import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ExceptionsService } from '@presentation/exceptions/exceptions.service';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly exceptionService: ExceptionsService,
  ) { }
  async getUserByUsername(username: string) {
    try {
      const userRow = await this.pool.query(`
        SELECT 
        user_id AS "userId"
        , username AS username
        , firstname AS firstname
        , surname AS surname
        , user_role AS "userRole"
        , regtime AS regtime
        , email AS email
        , tech_telegram AS "techTelegram"
        , telegram AS telegram
        , avatar AS avatar
        , pass_salt AS passSalt
        FROM users WHERE LOWER(username) = $1`
        , [username.toLowerCase()]);
      if (userRow.rowCount === 0) throw new Error("Пользователь не найден");
      let user = userRow.rows[0];
      if (!user.telegram) {
        const salt = user.passSalt;
        user.tgCode = salt.substring(salt.length - 6);
      } else {
        const tgUserRow = await this.pool.query(`SELECT * FROM tg_users WHERE user_id = $1`, [user.userId]);
        if (tgUserRow.rowCount === 0) throw new Error("Пользователь не найден");
        user.tgUsername = tgUserRow.rows[0].username;
      }
      delete user.passSalt;
      return user;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getOrgListByUsername(username: string, page: number = 1, city: string = '%', category: string = '0, 1, 2') {
    try {
      interface SqlVar {
        page: number;
        city: string;
        category: string;
      }
      let sqlVar: SqlVar;
      sqlVar.page = (page - 1) * 10;
      sqlVar.city = city;
      sqlVar.category = "{" + category + "}";
      const orgRow = await this.pool.query(`
        SELECT 
        org.org_id AS id
        , org.name AS name
        , org.about AS about
        , org.category AS category
        , org.avatar AS avatar
        , org.public AS public
        , org.city AS city
        FROM organizations AS org 
        LEFT JOIN users AS u
        ON org.owner = u.user_id
        WHERE org.city LIKE $1 AND org.category = ANY($2) AND u.username = $3
        OFFSET $4 LIMIT 10`, [sqlVar.city, sqlVar.category, username, sqlVar.page]);
      const orgCount = await this.pool.query(`
        SELECT COUNT(*)  
        FROM organizations AS org 
        LEFT JOIN users AS u
        ON org.owner = u.user_id
        WHERE org.city LIKE $1 AND org.category = ANY($2) AND u.username = $3`, [sqlVar.city, sqlVar.category, username]);
      if (orgRow.rowCount === 0) {
        return { orgs: [], count: 0 };
      } else {
        return { orgs: orgRow.rows, count: orgCount.rows[0].count };
      }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async updateUserRole(userId: number, userRole) {
    try {
      const response = await this.pool.query(`UPDATE users SET user_role = $1 WHERE user_id = $2;`, [userRole, userId]);
      if (response.rowCount === 0) throw new Error("Пользователь не найден");
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getUserById(userId: number) {
    try {
      const userRow = await this.pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
      if (userRow.rows[0] != undefined) {
        const user = {
          id: userRow.rows[0].user_id,
          username: userRow.rows[0].username,
          email: userRow.rows[0].email,
          firstname: userRow.rows[0].firstname,
          surname: userRow.rows[0].surname,
          userRole: userRow.rows[0].user_role,
          regtime: userRow.rows[0].regtime,
          techTelegram: userRow.rows[0].tech_telegram,
          telegram: userRow.rows[0].telegram,
          avatar: userRow.rows[0].avatar,
          tgCode: null,
          tgUsername: null
        }
        if (!userRow.rows[0].tech_telegram) {
          let salt = userRow.rows[0].pass_salt;
          user.tgCode = salt.substring(salt.length - 6)
          return user;
        } else {
          const tgUserRow = await this.pool.query(`SELECT * FROM tg_tech_users WHERE user_id = $1`, [userRow.rows[0].user_id]);
          if (tgUserRow.rows[0] != undefined) {
            user.tgUsername = tgUserRow.rows[0].username;
            return user;
          } else {
            throw 'Ошибка при поиске пользователя';
          }
        }
      } else {
        throw 'Unauthorized access.';
      }
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async createUser(username, email, hash, salt) {
    try {
      const userInsertString = `INSERT INTO users (username, email, password, pass_salt, regtime) VALUES ($1, $2, $3, $4, $5) RETURNING user_id AS "userId";`
      const response = await this.pool.query(userInsertString, [username, email, hash, salt, "NOW()"]);
      if (response.rowCount === 0) throw new Error("Юзер не создан");
      return response.rows[0];
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async createMailToken(userId, mailToken, mailKeyHash) {
    try {
      const mailInsertString = `INSERT INTO mail_confirm_tokens (user_id, mail_token, mail_key, created) VALUES ($1, $2, $3, $4);`;
      const response = await this.pool.query(mailInsertString, [userId, mailToken, mailKeyHash, "NOW()"]);
      if (response.rowCount === 0) throw new Error("Почтовый токен не создан");
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async getMailConfirm(mailToken, mailKey) {
    try {
      const response = await this.pool.query(`
      SELECT 
      user_id AS "userId"
      , mail_key AS "mailKey"
      FROM mail_confirm_tokens WHERE mail_token = $1;`
        , [mailToken, mailKey]);
      if (response.rowCount === 0) throw new Error('Токен валидации не найден');
      return response.rows[0];
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
  async deleteMailConfirm(userId) {
    try {
      const response = await this.pool.query(`DELETE FROM mail_confirm_tokens WHERE user_id = $1;`, [userId]);
      if (response.rowCount === 0) throw new Error('Токен валидации не найден');
      return true;
    } catch (err) {
      this.exceptionService.DatabaseException(err.message);
    }
  }
}