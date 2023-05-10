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

async function deleteResetToken(token) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        
        request.input('token', sql.NVarChar, token);
        const query = `DELETE FROM PasswordResetToken WHERE token = @token`;
        
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
    deleteResetToken,
}
