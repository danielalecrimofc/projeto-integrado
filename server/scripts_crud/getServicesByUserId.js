require('dotenv').config();
const sql = require('mssql');

//Variável de COnfiuração do Bd utilizando o arquivo env com as credenciais omitidas
const config = {
    user:process.env._USER,
    password:process.env._PASSWORD,
    server:process.env._SERVER,
    database:process.env._DATABASE,
    options: {
        trustServerCertificate: true
      }
  }

async function getServicesByUserId(userId) {
    try {
      await sql.connect(config);
      const result = await sql.query(`SELECT * FROM services WHERE userId = ${userId}`);
      return result.recordset;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      sql.close();
    }
  }


   //Deixando a função disponível para ser utilizada em outras partes do código
   module.exports = {
    getServicesByUserId
  }