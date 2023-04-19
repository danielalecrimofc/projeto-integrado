//Componenete utilizado para Ser uma máscara para a rota de crud.
import Cookies from 'js-cookie';
import React from 'react';
import { Navigate } from "react-router";
// Declaração de uma função componente chamada "PrivateRoute" que recebe "children" como parâmetro.
//Children é usado para representar os componentes que são passados como filhos para o componente PrivateRoute
function PrivateRoute({ children }) {
    // Verifica se há um token de autenticação no Local Storage do navegador.
  const isAuthenticated = !!Cookies.get("token");
   // Se o usuário estiver autenticado, renderiza o componente filho (ou seja, a tela de CRUD).
  if (isAuthenticated) {
    return children;
  }
   // Caso contrário, redireciona o usuário para a tela de login.
  return <Navigate to="/login" />;
}

export default PrivateRoute;
  


