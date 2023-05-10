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

async function createPasswordResetToken(userId, resetToken, expirationDate) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('userId', sql.Int, userId);
    request.input('resetToken', sql.NVarChar, resetToken);
    request.input('expirationDate', sql.DateTime, expirationDate);

    request.on('error', (err) => {
      console.error(err, "error happened");
    });

    const query = `
      INSERT INTO PasswordResetToken (user_id, token, created_at)
      VALUES (@userId, @resetToken, @expirationDate);
    `;

    await request.query(query);
    await sql.close();
  } catch (err) {
    console.error(err);
    throw new Error('Internal server error');
  }
}

module.exports = {
  createPasswordResetToken,
};
