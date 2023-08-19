
const pool = require("@database/postgresql/db");

const tx = async (res, error, callback) => {
    const client = await pool.connect()
    try {
    await client.query('BEGIN')
      try {
        await callback(client)
        client.query('COMMIT')
      } catch(e) {
        client.query('ROLLBACK')
        console.log(e)
        return res.status(500).json({error: error})
      }
    } finally {
      client.release()
    }
  }
module.exports = tx ;
