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



async function createService(name,description,status,value,userId) {
    try {
        await sql.connect(config);

        const query = `INSERT INTO Servico ( name_service, description_service,status_service,value_service,id_user) VALUES (@name, @description, @status, @value,@userId);
                       SELECT SCOPE_IDENTITY() AS serviceId;`;

         const request = new sql.Request();
         request.input('name', sql.VarChar, name);
         request.input('description', sql.VarChar, description);
         request.input('status', sql.VarChar, status);
         request.input('value', sql.VarChar, value);
         request.input('userId', sql.Int, userId);
         const result = await request.query(query);
      
        const serviceId = result.recordset[0].serviceId;

        await sql.close();

        return { id: serviceId, name, description, status, value };
    } catch (err) {
        console.error(err);
        throw new Error('Internal server error');
    }
}


//Deixando a função disponível para ser utilizada em outras partes do código
module.exports = {
    createService
  }