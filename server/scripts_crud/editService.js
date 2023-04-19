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

async function editService(serviceId, name, description, status, value) {
    try {
      await sql.connect(config);
      console.log("tipo de value:",typeof value);
      console.log("valor dentro de editService",value);
      //const cleanValue = parseFloat(value);
      //const valueAsNumber = parseFloat(value);
      const request = new sql.Request();
      //const numericValue = Number(value.toFixed(2));
      request.input('serviceId', sql.Int, serviceId);
      request.input('name', sql.NVarChar, name);
      request.input('description', sql.NVarChar, description);
      request.input('status', sql.NVarChar, status);
      //request.input('value', sql.Decimal(10, 2), Number(value.toFixed(2)));
      request.input('value', sql.Decimal(10, 2), value ? Number(String(value).replace(",", ".")) : null);



      request.on('error', (err) => {
        console.error(err,"erro que ta acontecendo");
        //throw new Error('Internal server error');
      });      

      const query = `UPDATE Servico SET 
      name_service = COALESCE(NULLIF(@name, ''), name_service),
      description_service = COALESCE(NULLIF(@description, ''), description_service),
      status_service = COALESCE(NULLIF(@status, ''), status_service),
      value_service = TRY_CONVERT(NUMERIC(10,2), COALESCE(NULLIF(@value, ''), value_service))
      WHERE id_service = @serviceId;
      SELECT @@ROWCOUNT AS rowsAffected;`;



  
       /* const result = await sql.query(query, {
          inputParameters: {
            serviceId: { type: sql.Int, value: serviceId },
            name: { type: sql.NVarChar, value: name },
            description: { type: sql.NVarChar, value: description },
            status: { type: sql.NVarChar, value: status },
            value: { type: sql.Decimal, value: value }
          }
        });*/
      const result = await request.query(query);
      const rowCount = result.recordset[0].rowsAffected;
      await sql.close();
      if (rowCount === 0) {
        throw new Error('Service not found');
      }
  
      return { id: serviceId, name, description, status, value };
    } catch (err) {
      console.error(err);
      throw new Error('Internal server error');
    }
  }
  


   //Deixando a função disponível para ser utilizada em outras partes do código
   module.exports = {
    editService
  }