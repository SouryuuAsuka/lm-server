module.exports = class PostgresqlUserRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async getUserByUsername(username) {
    try {
      const userRow = await this.pool.query(`SELECT * FROM users WHERE LOWER(username) = $1`, [username.toLowerCase()]);
      if (userRow.rows[0] != undefined) {
        const user = {
          userId: userRow.rows[0].user_id,
          username: userRow.rows[0].username,
          firstname: userRow.rows[0].firstname,
          surname: userRow.rows[0].surname,
          userRole: userRow.rows[0].user_role,
          regtime: userRow.rows[0].regtime,
          email: userRow.rows[0].email,
          techTelegram: userRow.rows[0].tech_telegram,
          telegram: userRow.rows[0].telegram
        }
        if (userRow.rows[0].avatar != null) {
          user.avatar = userRow.rows[0].avatar;
        } else {
          user.avatar = "defaultAvatar";
        }
        if (!userRow.rows[0].telegram) {
          let salt = userRow.rows[0].pass_salt;
          user.tgCode = salt.substring(salt.length - 6);
          return user;
        } else {
          const tgUserRow = await this.pool.query(`SELECT * FROM tg_users WHERE user_id = $1`, [userRow.rows[0].user_id]);
          if (tgUserRow.rows[0] != undefined) {
            user.tgUsername = tgUserRow.rows[0].username;
            return user;
          } else {
            throw 'Ошибка при поиске пользователя';
          }
        }
      } else {
        throw 'Пользователь не найден';
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getOrgListByUsername(username, page = 1, city = '%', category = '0, 1, 2') {
    try {
      var sqlVar = {};
      sqlVar.page = (page - 1) * 10;
      sqlVar.city = city;
      sqlVar.category = "{" + category + "}";
      const orgRow = await this.pool.query(`
        SELECT 
        org.org_id AS id, 
        org.name AS name, 
        org.about AS about, 
        org.category AS category, 
        org.avatar AS avatar, 
        org.public AS public, 
        org.city AS city
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
      if (orgRow.rows.length == 0) {
        return { orgs: [], count: 0 };
      } else {
        return { orgs: orgRow.rows, count: orgCount.rows[0].count };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updateUserRole(userId, userRole) {
    try {
      await this.pool.query(`UPDATE users SET user_role = $1 WHERE user_id = $2;`, [userRole, userId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getUserById(userId) {
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
      console.log(err);
      throw err;
    }
  }
  async getUserPassById(userId) {
    try {
      const userRow = await this.pool.query(`
        SELECT 
        u.user_id AS "userId"
        , u.username AS username
        , u.email AS email
        , u.user_role AS "userRole"
        , u.password AS password
        , u.pass_salt AS "passSalt"
        FROM users AS u WHERE user_id = $1`
        , [userId])
      if(userRow.rows.length === 0) throw "Пользователь не найден";
      return userRow.rows[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getUserPassByEmail(email) {
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
      console.log(err);
      throw err;
    }
  }
  async getUserPassByUsername(username) {
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
      console.log(err);
      throw err;
    }
  }
  async createRefreshToken(userId, tokenDate, tokenHash, ip) {
    try {
      await this.pool.query(`
        INSERT INTO refresh_tokens (user_id, user_ip, created, token) 
        VALUES ($1, $2, $3, $4)`
        , [userId, ip, tokenDate, tokenHash]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async deleteRefreshTokenById(tokenId) {
    try {
      await this.pool.query(`DELETE FROM refresh_tokens WHERE token_id = $1`, [tokenId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getRefreshTokenById(userId) {
    try {
      const refreshRow = await this.pool.query(`
        SELECT * FROM refresh_tokens WHERE user_id = $1`
        , [userId]);
      return refreshRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async searchRefreshToken(userId, date, hash) {
    try {
      const refreshRow = await this.pool.query(`
      SELECT 
      u.user_role AS "userRole"
      , r.user_id AS "userId"
      , u.email AS email
      , r.token_id AS "tokenId"
      FROM refresh_tokens AS r 
      JOIN users AS u
      ON r.user_id = u.user_id
      WHERE r.user_id = $1 AND r.created = $2 AND r.token = $3`, [userId, date, hash]);
      return refreshRow.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updateRefreshTokenById(ip, tokenDate, tokenHash, tokenId) {
    try {
      await this.pool.query(`UPDATE refresh_tokens SET (user_ip, created, token) = ($1, $2, $3) WHERE token_id = $4`, [ip, tokenDate, tokenHash, tokenId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async createUser(username, email, hash, salt) {
    try {
      const userInsertString = `INSERT INTO users (username, email, password, pass_salt, regtime) VALUES ($1, $2, $3, $4, $5) RETURNING user_id AS "userId";`
      const userRow = await this.pool.query(userInsertString, [username, email, hash, salt, "NOW()"]);
      return userRow;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async createMailToken(userId, mailToken, mailKeyHash) {
    try {
      const mailInsertString = `INSERT INTO mail_confirm_tokens (user_id, mail_token, mail_key, created) VALUES ($1, $2, $3, $4);`;
      await this.pool.query(mailInsertString, [userId, mailToken, mailKeyHash, "NOW()"]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getMailConfirm(mailToken) {
    try {
      const mailConfirm = await this.pool.query(`
      SELECT 
      user_id AS "userId"
      , mail_key AS "mailKey"
      FROM mail_confirm_tokens WHERE mail_token = $1;`
        , [mailToken, mailKey]);
      if (mailConfirm.rows.length === 0) 'Токен валидации не найден';
      return mailConfirm.rows[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async deleteMailConfirm(userId) {
    try {
      await this.pool.query(`DELETE FROM mail_confirm_tokens WHERE user_id = $1;`, [userId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}