import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") !== "false";
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload.username || "User");
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLinkClick = (e, path) => {
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      return;
    }
    
    e.preventDefault();
    navigate(path);
  };

  const handleLogoClick = (e) => {
    handleLinkClick(e, "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a
          href="/"
          className="nav-logo"
          onClick={handleLogoClick}
          onAuxClick={handleLogoClick}
          title="Home | Ctrl+Click or Middle-Click to open in new tab"
        >
          🌌 SolarCollector
        </a>
      </div>

      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "Dark" : "Light"}
        </button>

        <a 
          href="/orbital" 
          className="nav-link"
          onClick={(e) => handleLinkClick(e, "/orbital")}
          onAuxClick={(e) => {
            if (e.button === 1) return; 
            click
          }}
          title="3D Orbital View of Solar System"
        >
          Orbital View
        </a>

        {user ? (
          <>
            <span className="nav-user"> Welcome, {user}</span>
            
            <a 
              href="/" 
              className="nav-link"
              onClick={(e) => handleLinkClick(e, "/")}
              onAuxClick={(e) => {
                if (e.button === 1) return;
              }}
              title="Home (Grid View)"
            >
               Grid View
            </a>
            
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <a 
              href="/login" 
              className="nav-link"
              onClick={(e) => handleLinkClick(e, "/login")}
              onAuxClick={(e) => {
                if (e.button === 1) return;
              }}
              title="Login"
            >
             Login
            </a>
            <a 
              href="/signup" 
              className="nav-link signup"
              onClick={(e) => handleLinkClick(e, "/signup")}
              onAuxClick={(e) => {
                if (e.button === 1) return;
              }}
              title="Sign Up"
            >
              Signup
            </a>
          </>
        )}
      </div>
    </nav>
  );
}


