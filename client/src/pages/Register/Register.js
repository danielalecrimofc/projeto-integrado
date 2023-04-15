import { Link } from "react-router-dom";
import { useState } from "react";
import logo_servmais_app from "../../assets/logo_servmais_app.png"
import { LayoutAuth } from "../../components/LayoutAuth";
import  { useNavigate } from  'react-router-dom';
import axios from 'axios';

//Função assincrona resultado não disponível imediatamente
const register = async (name, email, password) => {
  try {
    // Criando variável response/esperando resposta da requisição
    const response = await axios.post('http://localhost:3001/register', { name, email, password });
    // Retorna a resposta do servidor em formato de dados
    return response.data;
  } catch (error) {
    // Verifica se a resposta do servidor retorna um erro 409 (conflito de dados)
    if (error.response && error.response.status === 409) {
      // Se o erro for de email já cadastrado, retorna um erro customizado com a mensagem "Email já cadastrado"
      throw new Error('Email já cadastrado');
    }
    // Se não for um erro de email já cadastrado, lança o erro original
    throw error; 
  }
};

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name_email, setName] = useState("")
  const navigate = useNavigate();

  // Função assíncrona que será chamada quando o formulário de cadastro for submetido
  const handleRegister = async (event) => {
    // Previne o comportamento padrão do formulário de atualizar a página quando submetido
    event.preventDefault();
  //logica de tratamento que vai capturar os eventos no back e ira mostrar por aqui
    try {
       // Chama a função assíncrona "register" para inserir um novo usuário no banco de dados
      const result = await register(name_email, email, password);
      // Verifica se a propriedade "error" foi definida no objeto retornado pela função "register"
      if (result.error) {
        // Exibe um alerta com a mensagem de erro retornada pela função "register"
        window.alert(result.error);
      } else {
        // Exibe um alerta de sucesso quando o usuário é cadastrado com sucesso
        window.alert("Usuário cadastrado com sucesso");
        // Navega para a página de login
        navigate('/login');
      }
      //Se for capturado algum erro entra aqui
    } catch (error) {
      // Exibe o erro no console do navegador
      console.error(error);
      // Exibe um alerta de erro genérico
      window.alert('Erro ao cadastrar usuário');
    }
  };
  
  
  return (
    <LayoutAuth >
      <form className="login-form" onSubmit={handleRegister}>
        <span className="login-form-title"> Criar Conta </span>

        <span className="login-form-title">
          <Link to="/"><img src={logo_servmais_app} alt="Service Mais" /></Link>
        </span>

        <div className="wrap-input">
          <input
            className={name_email !== "" ? "has-val input" : "input"}
            type="text"
            value={name_email}
            required
            pattern="^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$"
            onInput={(e) => {
              console.log("onInput sendo chamado")
              const isValid = e.target.checkValidity();
              console.log(isValid)
              if (!isValid) {
                e.target.setCustomValidity("");
                e.target.title = "O nome deve conter apenas letras e espaços, com no mínimo 2 e no máximo 50 caracteres";
              } else {
                e.target.setCustomValidity("");
                e.target.title = "";
              }
              setName(e.target.value);
              e.target.reportValidity();
            }}
            
            onChange={(e) => {
              console.log(e.target.value); // Adicionei este console.log para verificar se o valor está sendo atualizado
              setName(e.target.value);
            }}
          />
          <span className="focus-input" data-placeholder="Nome"></span>
        </div>

        <div className="wrap-input">
          <input
            className={email !== "" ? "has-val input" : "input"}
            type="email"
            value={email}
            pattern="^[a-z0-9]+([._]?[a-z0-9]+)*@gmail\.com$"
            onInput={(e) => {
              console.log("onInput sendo chamado")
              const isValid = e.target.checkValidity();
              console.log(isValid)
              if (!isValid) {
                e.target.setCustomValidity("");
                e.target.title = "Por favor, insira um e-mail válido do Gmail (somente letras, números e pontos são permitidos, e o endereço deve terminar com '@gmail.com'";
              } else {
                e.target.setCustomValidity("");
                e.target.title = "";
              }
              setEmail(e.target.value);
              e.target.reportValidity();
            }}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Email"></span>
        </div>

        <div className="wrap-input">
          <input
            className={password !== "" ? "has-val input" : "input"}
            type="password"
            value={password}
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$"
            onInput={(e) => {
              console.log("onInput sendo chamado")
              const isValid = e.target.checkValidity();
              console.log(isValid)
              if (!isValid) {
                e.target.setCustomValidity("");
                e.target.title = "A senha deve ter pelo menos 9 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial";
              } else {
                e.target.setCustomValidity("");
                e.target.title = "";
              }
              setPassword(e.target.value);
              e.target.reportValidity();
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Password"></span>
        </div>

        <div className="container-login-form-btn">
          <button type="submit" className="login-form-btn">Cadastrar</button>
        </div>

        <div className="text-center">
          <span className="txt1">Tem uma conta? </span>
          <Link className="txt2" to="/login">
            Faça o Login
          </Link>
        </div>
      </form>
    </LayoutAuth>
  )
}
