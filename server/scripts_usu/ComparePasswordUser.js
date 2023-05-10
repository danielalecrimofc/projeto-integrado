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
  

async function ComparePasswordUser(userId, oldPassword) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('userId', sql.Int, userId);
    const query = `
      SELECT password_user
      FROM Usuario
      WHERE id_user = @userId;
    `;
    const result = await request.query(query);
    await sql.close();

    if (result.recordset.length === 0) {
      throw new Error('User not found');
    }

    const hashedPassword = result.recordset[0].password_user;
    // Aqui você pode usar uma biblioteca de hash de senhas, como o bcrypt, para comparar as senhas
    if (hashedPassword === oldPassword) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    throw new Error('Internal server error');
  }
}


module.exports = {
    ComparePasswordUser,
};
  