require('dotenv').config();
const { ConnectionPool } = require('mssql');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

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


// Define uma função assíncrona chamada validateLogin, que recebe dois parâmetros: email e password
const validateLogin = async (email, password) => {
  //Declara a variável pool
  let pool; 
  try {
    // Abre uma conexão com o banco de dados usando a instância de ConnectionPool criada acima
    pool = await sql.connect(config);
    // Define uma string contendo a consulta SQL para buscar o usuário com o email fornecido
    const query = `SELECT id_user, password_user FROM Usuario WHERE email = '${email}'`;
    // Exibe uma mensagem de log com a consulta SQL executada
    console.log(`Executando consulta SQL: ${query}`);
    // Cria uma nova solicitação de consulta usando a conexão do pool
    const request = pool.request();
    // Executa a consulta e aguarda o resultado
    const result = await request.query(query);
    // Exibe uma mensagem de log com o resultado da consulta
    console.log(`Resultado da consulta: ${JSON.stringify(result.recordset)}`);
    // Obtém o primeiro usuário retornado pelo resultado da consulta
    const user = result.recordset[0];
    // Se o usuário não corresponder, lança um erro informando que a Usuário não encontrado
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
     // Verifica se a senha fornecida corresponde à senha armazenada no banco de dados
    const passwordMatch = password === user.password_user;
    // Se a senha não corresponder, lança um erro informando que a senha está incorreta
    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }
    // Gera um token de autenticação para o usuário encontrado
    const token = generateAuthToken(user.id);
    // Retorna o token
    return token;
    // Se ocorrer um erro durante a execução do código acima, captura o erro e lança um novo erro informando que houve um erro ao validar o login
  } catch (error) {
    // Exibe uma mensagem de erro no console
    console.error(error);
    throw new Error('Erro ao validar login');
    // Independentemente se houve erro ou não, o bloco finally é sempre executado
  } finally {
    //Se a variável pool estiver definida, significa que a conexão com o banco de dados foi aberta com sucesso
    if (pool) {
      // Fecha a conexão com o banco de dados
      await pool.close();
      // Exibe uma mensagem de log informando que a conexão com o banco de dados foi fechada
      console.log('Conexão com o banco de dados fechada');
    }
  }
}




//Função de geração do token de validação do usuário
//A função recebe o id do usuário gerado no bd
const generateAuthToken = (userId) => {
  /* Criando a variável de token onde será passado dentro da função sign o id do usuário e a chave JWT que criei
  e guardei no meu arquivo de ambiente .env*/
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  // Por fim a o token é retornado pela função para que possa ser usado na validação do login
  return token;
}



/*pool.on('connect', async () => {
  console.log('Conexão estabelecida com sucesso');
  try {
    const token = await validateLogin("fulano@example.com", "senha123");
    console.log(token);
  } catch (err) {
    console.error(err);
  }
});*/


//Deixando a função disponível para ser utilizada em outras partes do código
module.exports = {
    validateLogin
  }
