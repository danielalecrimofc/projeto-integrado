import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home";

import { Login } from "../pages/Login/Login";

import { Register } from "../pages/Register/Register";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;