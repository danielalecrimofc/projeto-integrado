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

const getServiceById = async (serviceId) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, serviceId)
      .query('SELECT * FROM Servico WHERE id_service = @id');
    return result.recordset[0];
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getServiceById
};