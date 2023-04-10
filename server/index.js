const sql = require("mssql");// importa a biblioteca mssql para utilizar o banco dedados sql server
const express = require("express");// importa a biblioteca express para criar o servidor web
const ejs = require('ejs');// importa a biblioteca ejs ) que permite renderizar HTML com dados dinâmicos em aplicativos Node.js/Para renderizar as telas no back. 
const app = express();//criando o servidor web por meio da variável app
app.use(express.static(__dirname + '/public'));

//Criando a variável para autenticação do banco de dados
const config = {
    user:'sa',
    password:'danielsam1999',
    server:'DESKTOP-RDICEJ4',
    database:'serv_mais',
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

//Função para saber se o aplicativo está rodando/escutando
/*app.listen(3001, () =>{
    console.log("Rodando na porta 3001!");
})*/
