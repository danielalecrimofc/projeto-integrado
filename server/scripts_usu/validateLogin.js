require('dotenv').config();
const { ConnectionPool } = require('mssql');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = {
    user:'sa',
    password:'danielsam1999',
    server:'DESKTOP-RDICEJ4',
    database:'serv_mais',
    options: {
        trustServerCertificate: true
      }
}


const pool = new ConnectionPool(config);

/*pool.on('connect', async () => {
  console.log('Conexão estabelecida com sucesso');
  try {
    const token = await validateLogin("fulano@example.com", "senha123");
    console.log(token);
  } catch (err) {
    console.error(err);
  }
});*/

const validateLogin = async (email, password) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const query = `SELECT id_user, password_user FROM Usuario WHERE email = '${email}'`;
    console.log(`Executando consulta SQL: ${query}`);
    const request = pool.request();
    const result = await request.query(query);
    console.log(`Resultado da consulta: ${JSON.stringify(result.recordset)}`);
    const user = result.recordset[0];
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const passwordMatch = password === user.password_user;
    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }
    const token = generateAuthToken(user.id);
    return token;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao validar login');
  } finally {
    if (pool) {
      await pool.close();
      console.log('Conexão com o banco de dados fechada');
    }
  }
}





const generateAuthToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
}

//Deixando a função disponível para ser utilizada em outras partes do código
module.exports = {
    validateLogin
  }