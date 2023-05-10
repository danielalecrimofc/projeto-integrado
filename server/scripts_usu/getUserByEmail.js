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

async function getUserByEmail(email) {
    try {
      await sql.connect(config);
      const request = new sql.Request();
      request.input('email', sql.NVarChar, email);
      const query = `
        SELECT *
        FROM Usuario
        WHERE email = @email;
      `;
      const result = await request.query(query);
      await sql.close();
      if (result.recordset.length === 0) {
        throw new Error('User not found');
      }
      console.log(result.recordset[0]);
      return result.recordset[0];
    } catch (err) {
      console.error(err);
      throw new Error('Internal server error');
    }
  }
  

  module.exports = {
    getUserByEmail,
  };
  