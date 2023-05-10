const sql = require("mssql");// importa a biblioteca mssql para utilizar o banco dedados sql server
const express = require("express");// importa a biblioteca express para criar o servidor web
const app = express();//criando o servidor web por meio da variável app
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
const { getServiceById }  = require("./scripts_crud/getServiceById");
const { sendCreateNotificationEmail }  = require("./scripts_email/sendCreateNotificationEmail");
const { sendEditNotificationEmail  }  = require("./scripts_email/sendEditNotificationEmail");
const { sendDeleteNotificationEmail }  = require("./scripts_email/sendDeleteNotificationEmail");
const { UpdateNameUser }  = require("./scripts_usu/UpdateNameUser");
const { UpdateEmailUser }  = require("./scripts_usu/UpdateEmailUser");
const { UpdatePasswordUser }  = require("./scripts_usu/UpdatePasswordUser");
const { ComparePasswordUser } = require("./scripts_usu/ComparePasswordUser");
const { getUserByEmail } = require("./scripts_usu/getUserByEmail");
const { createPasswordResetToken } = require("./scripts_usu/createPasswordResetToken");
const { getUserIdByTokenResetPass } = require('./scripts_usu/getUserIdByTokenResetPass');
const {deleteResetToken} = require('./scripts_usu/deleteResetToken');
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
      req.userName = user.name_user;// Inclui o nome do usuário em req.userNome
      req.userEmail = user.email; // Inclui o e-mail do usuário em req.userEmail
      req.userPass = user.password_user; // Inclui a senha do usuário em req.userPass
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
      const { id_service, name_service, description, status, value} = req.body;
      const userEmail = req.userEmail;//UserEmail vem do middleware de autenticação
      console.log("id chegando",id_service);
      // Obter informações do serviço antes de editar
      const beforeServiceInfo = await getServiceById(id_service);

      //Editar Serviço
      const editedService = await editService(id_service, name_service, description, status, value);
      res.json(editedService);

      // Obter informações do serviço após a edição
      const afterServiceInfo = await getServiceById(id_service);

      // Enviar notificação por e-mail
      await sendEditNotificationEmail(userEmail,name_service, beforeServiceInfo, afterServiceInfo);
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

  // Definir rota para obter dados do usuário autenticado
  app.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/user/name', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    // Verificar se o nome foi enviado
    const regex = /^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$/u;
    if (!regex.test(name)) {
      return res.status(400).json({ message: 'Insira um nome válido apenas com letras maiúsculas e minúsculas e espaços !' });
    }

    // Atualizar o nome do usuário
    const updatedUser = await UpdateNameUser(userId, name);

    res.json({ message: 'Nome atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar o nome do usuário' });
  }
});

app.put('/user/email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    console.log("está chegando isso no req.userid " + userId);
    // Verifica se o email fornecido pelo usuário contém o domínio "@gmail.com"
    const regex = /^[a-z0-9]+([._]?[a-z0-9]+)*@gmail\.com$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: 'Email inválido. Insira um email do Gmail.' });
    }


    // Atualizar o nome do usuário
    const updatedUser = await UpdateEmailUser(userId, email);

    res.json({ message: 'Email atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar o email do usuário' });
  }
});


app.put('/user/pass', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;
    // Verificar se a senha antiga fornecida pelo usuário coincide com a senha armazenada no banco de dados
    const isPasswordValid = await ComparePasswordUser(userId, oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha antiga incorreta' });
    }

    // Atualizar a senha do usuário
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({ message: 'Senha inválida."A senha deve ter pelo menos 9 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial"' });
    }
    const updatedUser = await UpdatePasswordUser(userId, newPassword);

    res.json({ message: 'Senha atualizada com sucesso', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar a senha do usuário' });
  }
});

// Rota para solicitar a recuperação de senha
app.post('/forgot-password', async (req, res) => {
  try {
    // Obter o email do usuário a partir da solicitação
    const { email } = req.body;

    // Buscar o usuário correspondente no banco de dados
    const result = await getUserByEmail(email);

    // Verificar se o usuário existe no banco de dados
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }


    // Gerar um token de redefinição de senha
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Inserir o token de redefinição de senha no banco de dados
    const userId = result.id_user;
    console.log(userId);
    const expirationDate = new Date(Date.now() + 3600000); // 1 hora a partir de agora
    await createPasswordResetToken(userId, resetToken, expirationDate);

    // Enviar um e-mail para o usuário contendo um link com o token de redefinição de senha
    const resetUrl = `http://localhost:3000/passwordresetchange/${resetToken}`;

    // Crie um objeto de transporte SMTP com as informações da sua conta do Gmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER_ADMIN, //  e-mail do app
        pass: process.env.GMAIL_PASS // senha
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER_ADMIN ,
      to: email,
      subject: 'Recuperação de senha',
      text: `Para redefinir sua senha, acesse o seguinte link: ${resetUrl}`
    });

    res.json({ message: 'Um e-mail foi enviado para você com as instruções para redefinir sua senha' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ocorreu um erro ao solicitar a recuperação de senha' });
  }
});


app.put('/change-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    // Pegar id do usuário pelo token
    const userId = await getUserIdByTokenResetPass(token);


    console.log(userId);
    
    //verifica se a senha está no padrão que foi deifnido
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({ message: 'Senha inválida."A senha deve ter pelo menos 9 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial"' });
    }

    // Atualizar a senha do usuário
    await UpdatePasswordUser(userId, newPassword);
    
    // Deletar o token da tabela PasswordResetToken
    await deleteResetToken(token);
    
    res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
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
