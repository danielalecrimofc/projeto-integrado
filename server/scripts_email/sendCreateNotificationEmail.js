const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendCreateNotificationEmail(userEmail, serviceName, serviceDescription, serviceStatus, serviceValue) {
  try {
    // Crie um objeto de transporte SMTP com as informações da sua conta do Gmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER_ADMIN, //  e-mail do app
        pass: GMAIL_PASS // senha
      }
    });

    // Configurar o e-mail que será enviado
    let mailOptions = {
      from: GMAIL_USER_ADMIN, // e-mail do app
      to: userEmail, // e-mail do usuário
      subject: 'Novo serviço cadastrado com sucesso',
      html: `<p>Olá,</p><p>O serviço ${serviceName} foi cadastrado com sucesso.</p><p>Detalhes do serviço:</p><ul><li>Descrição: ${serviceDescription}</li><li>Status: ${serviceStatus}</li><li>Valor: ${serviceValue}</li></ul><p>Obrigado por utilizar nossos serviços!</p>`
    };

    // Envie o e-mail
    let info = await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${userEmail}: ${info.messageId}`);
  } catch (err) {
    console.error(err);
  }
}


module.exports = {
    sendCreateNotificationEmail
  }