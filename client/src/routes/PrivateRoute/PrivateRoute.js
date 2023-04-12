//Componenete utilizado para Ser uma máscara para a rota de crud.
import React from 'react';
import { Navigate } from "react-router";

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
    // Se o Usuário estiver autenticado o if será executado e renderizará a minha tela de crud
  if (isAuthenticated) {
    return children;
  }
    //Senão o que será renderizado será minha tela de Login
  return <Navigate to="/login" />;
}

export default PrivateRoute;
  


