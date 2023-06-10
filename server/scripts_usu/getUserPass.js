const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env._USER,
  password: process.env._PASSWORD,
  server: process.env._SERVER,
  database: process.env._DATABASE,
  options: {
    trustServerCertificate: true
  }
};




const getUserPass = async (userId) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.Int, userId)
        .query('SELECT password_user FROM Usuario WHERE id_user = @id');
      return result.recordset[0].password_user;
    } catch (err) {
      console.error(err);
    }
  };
  
  module.exports = {
    getUserPass
  };
  