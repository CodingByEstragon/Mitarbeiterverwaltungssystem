const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
require("dotenv").config();

async function connection() {
   try {
      let db = await oracledb.getConnection({
         user: process.env.ORACLEDB_USER,
         password: process.env.ORACLEDB_PASSWORD,
         connectString: process.env.ORACLEDB_CONNECT_STRING,
      });
      return db;
      
   } catch (error) {
      console.error("OracleDB connection error:", error);
   }
}

module.exports = {
   connection,
};
