//importando biblioteca mssql para utilizar na função de inserir os usuários e utilizar o sql server
const sql = require('mssql');

//Variável de COnfiuração do Bd
const config = {
  user:'sa',
  password:'danielsam1999',
  server:'DESKTOP-RDICEJ4',
  database:'serv_mais',
  options: {
      trustServerCertificate: true
    }
}


//Função de inserir os Usuários
async function InsertUser(name, email, password) {
  try {
    console.log(name, email, password); // verifica se o valor do nome está correto aqui
    const pool = await sql.connect(config);

    // Verifica se o email já está cadastrado
    const queryCheckEmail = `SELECT COUNT(*) AS count FROM Usuario WHERE email = @email`;
    const requestCheckEmail = pool.request()
      .input('email', sql.NVarChar, email);
    const resultCheckEmail = await requestCheckEmail.query(queryCheckEmail);
    const count = resultCheckEmail.recordset[0].count;
    if (count > 0) {
      return { error: 'Email já cadastrado' }; // retorna um objeto com a propriedade error
    }

    // Insere o novo usuário
    const queryInsertUser = `INSERT INTO Usuario (name_user, email, password_user) VALUES (@name, @email,@password)`;
    const requestInsertUser = pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password);
    const resultInsertUser = await requestInsertUser.query(queryInsertUser);
    console.log('Usuário inserido com sucesso.');
    return resultInsertUser.recordset;
  } catch (err) {
    console.error('Erro ao inserir usuário:', err);
    throw err;
  }
}
  //Deixando a função disponível para ser utilizada em outras partes do código
  module.exports = {
    InsertUser
  }