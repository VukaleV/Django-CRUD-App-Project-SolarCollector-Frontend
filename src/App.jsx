import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlanetPage from "./pages/PlanetPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import Starfield from "./components/Starfield";
import OrbitalPage from "./pages/OrbitalPage";

export default function App() {
  return (
    <Router>
      <Starfield />
      <Navbar />
      <a 
  href="/orbital"
  className="nav-link"
  onClick={(e) => {
    if (e.button === 1 || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    navigate("/orbital");
  }}
  title="Orbital View"
>
  🪐 Orbital View
</a>
      <div className="app-container">
        <Routes>
          <Route path="/orbital" element={<OrbitalPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/planet/:id" element={<PlanetPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

