//importando biblioteca mssql para utilizar na função de inserir os usuários e utilizar o sql server
const sql = require('mssql');
require('dotenv').config();

//Variável de COnfiuração do Bd utilizando o arquivo env com as credenciais omitidas
const config = {
  user:process.env._USER,
  password:process.env._PASSWORD,
  server:process.env._SERVER,
  database:process.env._DATABASE,
  options: {
      trustServerCertificate: true
    }
}

//Função de inserção/cadastro de Usuários
// Função assíncrona que recebe três parâmetros: name, email e password
async function InsertUser(name_user, email, password) {
  try {
    // imprime no console os valores de name, email e password para fins de debug
    console.log(name_user, email, password); 
    // Conecta com o banco de dados
    const pool = await sql.connect(config);

    // Verifica se o email já está cadastrado

    // Define uma query SQL para contar o número de registros na tabela de usuário que tenha o email informado
    const queryCheckEmail = `SELECT COUNT(*) AS count FROM Usuario WHERE email = @email`;
    // Cria uma requisição a partir da conexão do pool e define um parâmetro @email
    const requestCheckEmail = pool.request()
      .input('email', sql.NVarChar, email);
    // Executa a queryCheckEmail na conexão do pool com os parâmetros definidos na requestCheckEmail
    const resultCheckEmail = await requestCheckEmail.query(queryCheckEmail);
    // Obtém o valor da coluna count do primeiro registro retornado pela query e armazena na variável count
    const count = resultCheckEmail.recordset[0].count;

    // Se o email já estiver cadastrado, retorna um objeto com a propriedade error
    if (count > 0) {
      return { error: 'Email já cadastrado' }; 
    }

    // Insere o novo usuário
    // Define a query de inserção do novo usuário na tabela "Usuario"
    const queryInsertUser = `INSERT INTO Usuario (name_user, email, password_user) VALUES (@name_user, @email,@password)`;
    // Cria um objeto "request" com as variáveis da query inserção
    const requestInsertUser = pool.request()
      .input('name_user', sql.NVarChar, name_user)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password);
    // Executa a query de inserção do novo usuário no banco de dados
    const resultInsertUser = await requestInsertUser.query(queryInsertUser);
    // Imprime no console uma mensagem de sucesso da operação de inserção
    console.log('Usuário inserido com sucesso.');
    // Retorna o resultado da operação de inserção, que é um objeto contendo as informações do usuário recém-inserido
    return resultInsertUser.recordset;
    // Se ocorrer um erro durante a verificação de cadastro do usuário ele é capturado
  } catch (err) {
    //A mensagem com o erro é mostrada no console
    console.error('Erro ao inserir usuário:', err);
    // lança o erro novamente para ser tratado por quem chamou a função
    throw err;
  }
}
  //Deixando a função disponível para ser utilizada em outras partes do código
  module.exports = {
    InsertUser
  }