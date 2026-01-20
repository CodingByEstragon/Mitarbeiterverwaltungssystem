const db = require("../db.js");
require("dotenv").config();

module.exports = {
  async viewSupervisorByUsername(username) {
    let connection = await db.connection();
    let sql = `SELECT * FROM supervisors_wfp WHERE username = :username`;
    const result = await connection.execute(sql, { username });
    await connection.close();
    return result.rows[0];
  },
};
