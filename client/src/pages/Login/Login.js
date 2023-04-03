import { Link } from "react-router-dom";
import {useState} from "react";
import { LayoutAuth } from "../../components/LayoutAuth"
import logo_servmais_app from "../../assets/logo_servmais_app.png"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return(
      <LayoutAuth>
          <form className="login-form">
            <span className="login-form-title"> Login </span>
            <span className="login-form-title">
              <img src={logo_servmais_app} alt="Service Mais" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn">Login</button>
            </div>

            <div className="text-center">
              <span className="txt1">Não possui conta? </span>
              <Link to="/register">Register</Link>
            </div>
          </form>
      </LayoutAuth> 
  );
}


