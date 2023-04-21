const nodemailer = require('nodemailer');
require('dotenv').config();



async function sendDeleteNotificationEmail(userEmail, serviceName) {
    try {
      // Crie um objeto de transporte SMTP com as informações da sua conta do Gmail
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER_ADMIN, // e-mail do app
          pass: process.env.GMAIL_PASS // senha
        }
      });
  
      // Configurar o e-mail que será enviado
      let mailOptions = {
        from: process.env.GMAIL_USER_ADMIN, // e-mail do app
        to: userEmail, // e-mail do usuário
        subject: 'Serviço deletado com sucesso',
        html: `<p>Olá,</p><p>O serviço ${serviceName} foi deletado com sucesso.</p><p>Obrigado por utilizar nossos serviços!</p>`
      };
  
      // Envie o e-mail
      let info = await transporter.sendMail(mailOptions);
      console.log(`E-mail enviado para ${userEmail}: ${info.messageId}`);
    } catch (err) {
      console.error(err);
    }
  }
  
  module.exports = {
    sendDeleteNotificationEmail
  }