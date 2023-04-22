const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEditNotificationEmail(userEmail, serviceName, beforeServiceInfo, afterServiceInfo) {
    try {
      // Crie um objeto de transporte SMTP com as informações da sua conta do Gmail
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER_ADMIN, //  e-mail do app
          pass: process.env.GMAIL_PASS // senha
        }
      });

      console.log("valor antes:",beforeServiceInfo);
      console.log("valor depois:",afterServiceInfo);
      
      // Gerar lista de informações editadas
      const editedFields = Object.keys(afterServiceInfo).filter(field => afterServiceInfo[field] !== beforeServiceInfo[field]);
      const editedInfoList = editedFields.map(field => `<li>${field}: ${beforeServiceInfo[field]} &rarr; ${afterServiceInfo[field]}</li>`).join('');
  
      // Configurar o e-mail que será enviado
      let mailOptions = {
        from: process.env.GMAIL_USER_ADMIN, // e-mail do app
        to: userEmail, // e-mail do usuário
        subject: 'Serviço editado com sucesso',
        html: `<p>Olá,</p><p>O serviço ${serviceName} foi editado com sucesso.</p><p>Detalhes editados:</p><ul>${editedInfoList}</ul><p>Obrigado por utilizar nossos serviços!</p>`
      };
  
      // Envie o e-mail
      let info = await transporter.sendMail(mailOptions);
      console.log(`E-mail enviado para ${userEmail}: ${info.messageId}`);
    } catch (err) {
      console.error(err);
    }
  }

  
  module.exports = {
    sendEditNotificationEmail
  }