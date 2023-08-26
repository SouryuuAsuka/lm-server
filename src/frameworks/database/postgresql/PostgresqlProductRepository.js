module.exports = class PostgresqlProductRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async editProduct(product) {
    try {
      const orgInsertString = "UPDATE goods SET name = $1, about = $2, price = $3, preparation_time = $4 WHERE good_id = $5";
      await this.pool.query(orgInsertString, [product.name, product.about, Number(product.price).toFixed(2), (24 * product.preparationTime), product.productId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getOwnerOfProduct(productId) {
    try {
      const user = await this.pool.query(`
        SELECT org.owner as owner FROM organizations AS org
        JOIN goods AS g ON org.org_id = g.org_id
        WHERE g.good_id = $1`, [productId]);
      return user.rows[0].owner;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async createProduct(product) {
    try {
      const orgInsertString = "INSERT INTO goods (name, about, org_id, price, preparation_time, created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING good_id AS 'productId'";
      const productRow = await this.pool.query(orgInsertString, [[{lang: product.lang, text: product.name}], [{lang: product.lang, text: product.about}], product.orgId, product.price, product.preparationTime*24, "NOW()"]);
      return productRow.rows[0].productId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async setActiveProduct(status, productId) {
    try {
      const purUpdateString = "UPDATE goods SET active = $1 WHERE good_id = $2";
      await this.pool.query(purUpdateString, [status, productId]);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}