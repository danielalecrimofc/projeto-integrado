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


// Função que pega o id do usuário pelo token
const getUserIdByTokenResetPass = async (token) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('token', sql.VarChar, token)
        .query('SELECT user_id FROM PasswordResetToken WHERE token = @token');
      console.log(result.recordset[0].user_id);
      return result.recordset[0].user_id;
    } catch (err) {
      console.error(err);
    }
  };
  
  module.exports = {
    getUserIdByTokenResetPass,
  };
  