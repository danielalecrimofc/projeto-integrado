import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home";

import { Login } from "../pages/Login/Login";

import { Register } from "../pages/Register/Register";

import { NotFoundPage } from "../components/NotFoundPage";


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;