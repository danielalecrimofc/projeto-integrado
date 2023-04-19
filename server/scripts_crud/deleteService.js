require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env._USER,
    password: process.env._PASSWORD,
    server: process.env._SERVER,
    database: process.env._DATABASE,
    options: {
        trustServerCertificate: true
    }
};



async function deleteService(serviceId) {
    try {
      await sql.connect(config);
      const request = new sql.Request();

      request.input('serviceId', sql.Int, serviceId);
      const query = `DELETE FROM Servico WHERE id_service = @serviceId`;
      
      await request.query(query);
  
      await sql.close();
  
      return;
    } catch (err) {
      console.error(err);
      throw new Error('Internal server error');
    }
  }
  

  //Deixando a função disponível para ser utilizada em outras partes do código
module.exports = {
    deleteService
  }