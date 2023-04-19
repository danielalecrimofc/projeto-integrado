import { Link } from "react-router-dom";
import {useState} from "react";
import { LayoutAuth } from "../../components/LayoutAuth"
import logo_servmais_app from "../../assets/logo_servmais_app.png"
import  { useNavigate } from  'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// Exporta a função 'loginUser', que recebe dois parâmetros: email e password
export const loginUser = async (email, password) => {
  try {
    // Faz uma requisição POST para a URL 'http://localhost:3001/login', enviando o email e password no corpo da requisição
    const response = await axios.post('http://localhost:3001/login', {
      email: email,
      password: password
    });
    // Armazena o token retornado pela API no Local Storage do navegador
    //localStorage.setItem('token', response.data.token);//
    // Armazena o token retornado pela API nos cookies
    // Imprime a resposta da API no console
    console.log("dados",response.data);
    // Retorna os dados retornados com o token pela API
    return response.data.token;
    //Caso ocorra algum erro na requisição ele será capturado
  } catch (error) {
    //O erro que foi capturado será mostrado no console
    console.error(error);
  }
}

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Função assíncrona que será chamada quando o formulário de login for submetido
  const handleLogin = async (e) => {
    // Previne o comportamento padrão do formulário de atualizar a página quando submetido
    e.preventDefault();
    try {
      // chama a função loginUser passando email e senha como parâmetros
      const response = await loginUser(email, password);
      //Imprime no console a resposta 
      console.log(response); 
      // verifica se o token foi recebido na resposta
      if (!response) {
        // lança um erro caso o token não seja encontrado
        throw new Error('Token not found in response');
      }
      // armazena o token da resposta em uma variável
      const token = response;
      // armazena o token no armazenamento local do navegador
      Cookies.set("token", token, {expires: 7});
      // redireciona para a tela de CRUD do usuário
      navigate("/services");
      // captura algum erro que for gerado durante a execução do código
    } catch (error) {
      // exibe mensagem de erro no console caso ocorra algum problema
      if (error.response && error.response.status === 401) {
        // erro de login inválido
        window.alert("Email ou senha inválidos");
      } else {
        // erro genérico
        console.error(error);
        window.alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
      }
      //console.error(error);
      //window.alert("Email ou senha inválidos");
      //  tratamento específico para diferentes tipos de erros
    }
  };
  
  return(
      <LayoutAuth>
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-title"> Login </span>
            <span className="login-form-title">
              <Link to="/" ><img src={logo_servmais_app} alt="Service Mais" /></Link>
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                required
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
                title="A senha deve ter pelo menos 9 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>

            <div className="container-login-form-btn">
              <button type="submit" className="login-form-btn">Login</button>
            </div>


            <div className="text-center">
              <span className="txt1">Não possui conta? </span>
              <Link className="txt2" to="/register">Crie sua conta</Link>
            </div>
          </form>
      </LayoutAuth> 
  );
}


