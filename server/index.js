const sql = require("mssql");// importa a biblioteca mssql para utilizar o banco dedados sql server
const express = require("express");// importa a biblioteca express para criar o servidor web
const app = express();//criando o servidor web por meio da variável app
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const  { InsertUser }   = require("./scripts_usu/InsertUser");
const { validateLogin }  = require("./scripts_usu/validateLogin");
const { createService }  = require("./scripts_crud/createService");
const { deleteService }  = require("./scripts_crud/deleteService");
const { editService }  = require("./scripts_crud/editService");
const { getServicesByUserId }  = require("./scripts_crud/getServicesByUserId");
const { getUserById }  = require("./scripts_usu/getUserById");
const { sendCreateNotificationEmail }  = require("./scripts_email/sendCreateNotificationEmail");
const { sendEditNotificationEmail  }  = require("./scripts_email/sendEditNotificationEmail");
const { sendDeleteNotificationEmail }  = require("./scripts_email/sendDeleteNotificationEmail");
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

  //função utilizada para pegar os dados do usuário depois de autenticado e utilizar nas minhas operações de forma segura
  const authMiddleware = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send('Unauthorized');
      }
      const token = authHeader.replace('Bearer ', ''); // remove "Bearer " da string de autorização
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decodifica o token
      req.userId = decodedToken.userId;
      const user = await getUserById(req.userId);
      console.log(user);
      req.userEmail = user.email; // Inclui o e-mail do usuário em req.userEmail
      console.log(decodedToken);
      console.log(req.userId);
      next();
    } catch (err) {
      console.error(err);
      res.status(401).send('Unauthorized');
    }
  };
  

//endpoint para o cadastro
app.post('/register', async (req, res) => {
    const {name, email, password } = req.body;
    try {
      const result = await InsertUser(name, email, password);
      res.status(201).json(result);
    } catch (err) {
        console.error(err); // Aqui exibimos o erro no console para fins de debug
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' }); // Aqui enviamos a mensagem de erro na resposta
    }
  });

  app.get('/service', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId; // userId vem do middleware de autenticação
      const services = await getServicesByUserId(userId);
      res.json(services);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });

  app.post('/services', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId; // userId vem do middleware de autenticação
      const userEmail = req.userEmail;//UserEmail vem do middleware de autenticação
      const {name,description,status,value } = req.body;
      //console.log(req.body);
      
      const newService = await createService(name,description,status,value,userId);
      res.json({ ...newService, id: newService.id })
       // Envia a notificação por e-mail
      await sendCreateNotificationEmail(userEmail, name, description, status, value);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
  app.put('/services',authMiddleware, async (req, res) => {
    try {
      const { id_service, name, description, status, value } = req.body;
      const userEmail = req.userEmail;//UserEmail vem do middleware de autenticação
      console.log("id chegando",id_service);
      const editedService = await editService(id_service, name, description, status, value);
      res.json(editedService);
      await sendEditNotificationEmail(userEmail, name, description, status, value);
    } catch (err) {

      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
  
  app.delete('/services',authMiddleware, async (req, res) => {
    try {
      const {id_service,name_service} = req.body;
      console.log(name_service);
      const userEmail = req.userEmail;
      console.log(id_service);
      await deleteService(id_service);
      res.sendStatus(200);
      await sendDeleteNotificationEmail(userEmail,name_service);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
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
