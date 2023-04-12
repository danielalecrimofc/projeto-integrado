import { Link } from "react-router-dom";
import { useState } from "react";
import logo_servmais_app from "../../assets/logo_servmais_app.png"
import { LayoutAuth } from "../../components/LayoutAuth";
import  { useNavigate } from  'react-router-dom';
import axios from 'axios';


const register = async (name, email, password) => {
  try {
    const response = await axios.post('http://localhost:3001/register', { name, email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // email já cadastrado, retorna um erro customizado
      throw new Error('Email já cadastrado');
    }
    throw error; // se não for erro de email já cadastrado, lança o erro original
  }
};

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("")
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
  //logica de tratamento que vai capturar os eventos no back e ira mostrar por aqui
    try {
      const result = await register(name, email, password);
      if (result.error) {
        window.alert(result.error);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      window.alert('Erro ao cadastrar usuário');
    }
  };
  
  
  return (
    <LayoutAuth >
      <form className="login-form" onSubmit={handleRegister}>
        <span className="login-form-title"> Criar Conta </span>

        <span className="login-form-title">
          <img src={logo_servmais_app} alt="Service Mais" />
        </span>

        <div className="wrap-input">
          <input
            className={name !== "" ? "has-val input" : "input"}
            type="text"
            value={name}
            required
            onChange={(e) => {
              console.log(e.target.value); // Adicione este console.log para verificar se o valor está sendo atualizado
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
