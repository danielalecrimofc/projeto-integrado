import { BrowserRouter as Router,Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home";

import { Login } from "../pages/Login/Login";

import { Register } from "../pages/Register/Register";

import { Crud } from "../pages/Crud/Crud";

import  PrivateRoute  from "./PrivateRoute/PrivateRoute"

import { NotFoundPage } from "../components/NotFoundPage";

import {User} from "../pages/User/User";

import {PasswordReset} from "../pages/PasswordReset/PasswordReset";

import {PasswordResetChange} from "../pages/PasswordReset/PasswordResetChange";

//import  PrivateRoute  from "./PrivateRoute/PrivateRoute";

export const AppRouter = () => {
  const isAuthenticated = true; // exemplo de variável definida com valor booleano indicando se o usuário está autenticado ou não
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/passwordreset" element={<PasswordReset />} />
        <Route exact path="/passwordresetchange" element={<PasswordResetChange />} />
        <Route exact path="/user" element={<User />} />
        <Route
          exact
          path="/services/*"
          element={<PrivateRoute isAuthenticated={isAuthenticated}><Crud /></PrivateRoute>}
        />
        <Route  path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

/*<Route
          exact
          path="/crud/*"
          element={<PrivateRoute isAuthenticated={isAuthenticated}><Crud /></PrivateRoute>}
        />*/
export default AppRouter;