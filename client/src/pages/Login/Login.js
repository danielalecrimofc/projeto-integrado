import { Link } from "react-router-dom";
import {useState} from "react";
import { LayoutAuth } from "../../components/LayoutAuth"
import logo_servmais_app from "../../assets/logo_servmais_app.png"
import  { useNavigate } from  'react-router-dom';
import axios from 'axios';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3001/login', {
      email: email,
      password: password
    });
    localStorage.setItem('token', response.data.token); // Armazena o token no Local Storage
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log(response); 
      if (!response.token) {
        throw new Error('Token not found in response');
      }
      const token = response.token;
      // armazena o token no armazenamento local do navegador
      localStorage.setItem("token", token);
      // redireciona para a tela de CRUD do usuário
      navigate("/crud");
    } catch (error) {
      console.error(error);
      window.alert("Email ou senha inválidos");
      //  tratamento específico para diferentes tipos de erros
    }
  };
  
  return(
      <LayoutAuth>
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-title"> Login </span>
            <span className="login-form-title">
              <img src={logo_servmais_app} alt="Service Mais" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
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


