import React, { useEffect, useState } from "react";
import api from "../api";
import PlanetCard from "../components/PlanetCard";
import AddPlanetForm from "../components/AddPlanetForm";
import Starfield from "../components/Starfield";
import "../App.css";

const Home = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const fetchPlanets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/planets/");
      setPlanets(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching planets:", err);
      setError("Could not load planets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();

    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload.username);
        setIsAdmin(payload.is_superuser || false);
        console.log("User:", payload.username, "Admin:", payload.is_superuser);
      } catch (e) {
        console.error("JWT decode failed:", e);
      }
    }
  }, []);

  return (
    <div className="app-container">
      <Starfield />
      <h1 className="app-title">Solar System Explorer</h1>

      {user && (
        <div className="user-info">
          <p>👤 Logged in as: <strong>{user}</strong></p>
          {isAdmin ? (
            <p className="admin-badge">Admin Mode: You can add, edit and delete planets</p>
          ) : (
            <p className="user-badge">User Mode: You can only view planets</p>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchPlanets} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading planets...</p>
        </div>
      ) : (
        <>
          <div className="planets-grid">
            {planets.map((planet) => (
              <PlanetCard
                key={planet.id}
                planet={planet}
                isAdmin={isAdmin}
                refreshPlanets={fetchPlanets}
              />
            ))}
          </div>

          {isAdmin && (
            <AddPlanetForm refreshPlanets={fetchPlanets} />
          )}

          {!user ? (
            <div className="login-reminder">
              <p>🔒 Please login to view more options</p>
              <a href="/login" className="login-link">Go to Login</a>
            </div>
          ) : !isAdmin ? (
            <div className="user-message">
              <p>👤 You are logged in as a regular user.</p>
              <p>Only administrators can add, edit, or delete planets.</p>
              <p>Contact an admin if you need to add a new planet.</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Home;
