const sql = require("mssql");
const express = require("express");

const app = express();

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
