require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env._USER,
  password: process.env._PASSWORD,
  server: process.env._SERVER,
  database: process.env._DATABASE,
  options: {
    trustServerCertificate: true,
  },
};

async function UpdatePasswordUser(userId, newPassword) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('userId', sql.Int, userId);
    request.input('newPassword', sql.NVarChar, newPassword);

    request.on('error', (err) => {
      console.error(err, 'error happened');
    });

    const query = `
      UPDATE Usuario
      SET password_user = @newPassword
      WHERE id_user = @userId;
    `;

    const result = await request.query(query);
    const rowCount = result.rowsAffected[0];

    await sql.close();

    if (rowCount === 0) {
      throw new Error('User not found');
    }

    return { userId, message: 'Senha atualizada com sucesso' };
  } catch (err) {
    console.error(err);
    throw new Error('Internal server error');
  }
}

module.exports = {
  UpdatePasswordUser,
};
