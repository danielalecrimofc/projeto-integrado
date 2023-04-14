require('dotenv').config();
const sql = require('mssql');


async function editService(serviceId, name, description, status, value) {
    try {
      await sql.connect(config);
  
      const query = `UPDATE services SET 
        name_service = COALESCE(NULLIF(@name, ''), name_service),
        description_service = COALESCE(NULLIF(@description, ''), description_service),
        status_service = COALESCE(NULLIF(@status, ''), status_service),
        value_service = COALESCE(NULLIF(@value, ''), value_service)
        WHERE id_service = @serviceId;
        SELECT @@ROWCOUNT AS rowCount;`;
  
      const result = await sql.query(query, {
        serviceId,
        name,
        description,
        status,
        value,
      });
  
      const rowCount = result.recordset[0].rowCount;
  
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