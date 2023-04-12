const sql = require("mssql");// importa a biblioteca mssql para utilizar o banco dedados sql server
const express = require("express");// importa a biblioteca express para criar o servidor web
const app = express();//criando o servidor web por meio da variável app
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const  { InsertUser }   = require("./scripts_usu/InsertUser");
const { validateLogin }  = require("./scripts_usu/validateLogin");

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

//Criando a variável para a conexão
const pool = new sql.ConnectionPool(config);

//Realizando a conexão com o banco de dados
pool.connect(err => {
    if(err){
        console.error('Erro ao conectar no banco de dados:', err);
    }else{
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
        app.listen(3001, () => {
        console.log('Aplicativo rodando na porta 3001.')
        })
    }
})

app.get("/",(req, res) =>{
    res.send("Hello World!");
})


  app.get('/register', (req, res) => {
    res.send("hello world!")
  });

  app.post('/login', async function(req, res) {
    const { email, password } = req.body; // Obtém as informações de email e senha do corpo da requisição
  
    try {
      const token = await validateLogin(email, password); // Chama a função de validação de login e recebe o token retornado
      console.log(token);//Mostra o token no console do servidor
      res.json({ token }); // Retorna o token como resposta da requisição
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: err.message }); // Retorna o erro de autenticação com o status 401
    }
  });  
//endpoint para o cadastro
app.post('/register', async (req, res) => {
    const {name , email, password } = req.body;
    try {
      const result = await InsertUser(name, email, password);
      res.status(201).json(result);
    } catch (err) {
        console.error(err); // Aqui exibimos o erro no console para fins de debug
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' }); // Aqui enviamos a mensagem de erro na resposta
    }
  });

//código para permitir que permitir ocódigo na porta 3000 acesse o servidor na porta 3001.
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//Função para saber se o aplicativo está rodando/escutando
/*app.listen(3001, () =>{
    console.log("Rodando na porta 3001!");
})*/
