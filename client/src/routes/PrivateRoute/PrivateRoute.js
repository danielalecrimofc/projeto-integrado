//Componenete utilizado para Ser uma máscara para a rota de crud.
import React from 'react';
import { Routes,Route, Navigate } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica se o token está armazenado
  return (
    <Routes>
         <Route
            {...rest}
            element={
                isAuthenticated ? (
                children
                ) : (
                <Navigate to={{ pathname: '/login', state: { from: rest.location } }} />
                )
        }
        />
    </Routes>
  );
}

export default PrivateRoute;
