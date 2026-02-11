import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Index from "./pages/index.jsx";
import ProtectedRoute from "./pages/protected_route.jsx";
import Kuis from "./pages/kuis";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />

        <Route element={<ProtectedRoute />}>
          {""}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kuis" element={<Kuis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
