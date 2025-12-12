
import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import Starfield from "../components/Starfield";
import "../App.css";

const OrbitalPage = () => {
  const [planets, setPlanets] = useState([]);
  const [sun, setSun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [speed, setSpeed] = useState(1);

  
  const orbitalData = useMemo(() => ({
    mercury: { 
      radiusMultiplier: 1.0, 
      speedMultiplier: 4.15, 
      startAngle: 0 
    },
    venus: { 
      radiusMultiplier: 1.5, 
      speedMultiplier: 1.62,
      startAngle: 45 
    },
    earth: { 
      radiusMultiplier: 2.0, 
      speedMultiplier: 1.0, 
      startAngle: 90 
    },
    mars: { 
      radiusMultiplier: 2.5, 
      speedMultiplier: 0.53,
      startAngle: 135 
    },
    jupiter: { 
      radiusMultiplier: 3.5, 
      speedMultiplier: 0.084,
      startAngle: 180 
    },
    saturn: { 
      radiusMultiplier: 4.5, 
      speedMultiplier: 0.034,
      startAngle: 225 
    },
    uranus: { 
      radiusMultiplier: 5.5, 
      speedMultiplier: 0.012,
      startAngle: 270 
    },
    neptune: { 
      radiusMultiplier: 6.5, 
      speedMultiplier: 0.0061,
      startAngle: 315 
    }
  }), []);

  useEffect(() => {
    fetchCelestialBodies();
  }, []);

  const fetchCelestialBodies = async () => {
    try {
      const res = await api.get("/planets/");
      const allBodies = res.data;
      
      const sunBody = allBodies.find(p => p.name.toLowerCase() === "sun");
      const planetBodies = allBodies.filter(p => p.name.toLowerCase() !== "sun");
      
      
      const sortedPlanets = planetBodies.sort((a, b) => 
        a.distance_from_sun - b.distance_from_sun
      );
      
      setSun(sunBody);
      setPlanets(sortedPlanets);
    } catch (err) {
      console.error("Error fetching celestial bodies:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const getPlanetData = (planetName) => {
    const name = planetName.toLowerCase();
    if (name.includes("mercury")) return orbitalData.mercury;
    if (name.includes("venus")) return orbitalData.venus;
    if (name.includes("earth")) return orbitalData.earth;
    if (name.includes("mars")) return orbitalData.mars;
    if (name.includes("jupiter")) return orbitalData.jupiter;
    if (name.includes("saturn")) return orbitalData.saturn;
    if (name.includes("uranus")) return orbitalData.uranus;
    if (name.includes("neptune")) return orbitalData.neptune;
    return { radiusMultiplier: 1, speedMultiplier: 1, startAngle: 0 };
  };

  
  const getPlanetClass = (planetName) => {
    const name = planetName.toLowerCase();
    if (name.includes("mercury")) return "mercury";
    if (name.includes("venus")) return "venus";
    if (name.includes("earth")) return "earth";
    if (name.includes("mars")) return "mars";
    if (name.includes("jupiter")) return "jupiter";
    if (name.includes("saturn")) return "saturn";
    if (name.includes("uranus")) return "uranus";
    if (name.includes("neptune")) return "neptune";
    return "";
  };

  
  const getAnimationDuration = (planetName) => {
    const data = getPlanetData(planetName);
    
    const baseDuration = 10 / data.speedMultiplier;
    
    return `${baseDuration / speed}s`;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Starfield />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Solar System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Starfield />
      
      <h1 className="app-title"> Orbital View</h1>
      
     
      <div className="orbit-controls">
        <button onClick={() => setIsOrbiting(!isOrbiting)}>
          {isOrbiting ? "⏸ Pause Orbits" : "▶Resume Orbits"}
        </button>
        <button onClick={() => setSpeed(s => Math.max(0.1, s - 0.5))}>
           Slower
        </button>
        <span>Speed: {speed.toFixed(1)}x</span>
        <button onClick={() => setSpeed(s => s + 0.5)}>
           Faster
        </button>
        <button 
          onClick={() => setSpeed(1)}
          title="Reset to normal speed"
        >
           Reset Speed
        </button>
        <button onClick={() => window.location.href = "/"}>
           Grid View
        </button>
      </div>

      
      <div className="orbit-info">
    
      </div>

      
      <div className="orbital-container">
       
        {[1, 2, 3, 4, 5, 6, 7, 8].map((orbitNum) => (
          <div 
            key={`orbit-${orbitNum}`} 
            className={`orbit orbit-${orbitNum}`}
            title={`Orbit ${orbitNum}`}
          />
        ))}

     
        {sun && (
          <div className="sun-center">
            <div 
              className="sun-card" 
              title={`${sun.name}\n${sun.description}`}
              onClick={() => alert(`${sun.name}\n\n${sun.description}`)}
            >
              <div className="sun-label">SUN</div>
            </div>
          </div>
        )}

        
        {planets.map((planet, index) => {
          const planetClass = getPlanetClass(planet.name);
          const planetData = getPlanetData(planet.name);
          
          return (
            <div 
              key={planet.id}
              className={`planet-orbital ${planetClass} ${isOrbiting ? 'orbiting' : ''}`}
              style={{
                animationPlayState: isOrbiting ? 'running' : 'paused',
                animationDuration: getAnimationDuration(planet.name),
                '--start-angle': `${planetData.startAngle}deg`,
                '--orbit-radius': `${planetData.radiusMultiplier * 120}px`,
              }}
              title={`${planet.name}\n` +
                `Orbital Period: ${getOrbitalPeriod(planet.name)}\n` +
                `Distance: ${planet.distance_from_sun?.toLocaleString() || 'N/A'} km\n` +
                `Click for details`}
              onClick={() => showPlanetDetails(planet)}
            >
              <div className="orbital-planet">
                <div 
                  className="orbital-planet-icon"
                  style={{
                    backgroundImage: planet.image_url 
                      ? `url(${planet.image_url})`
                      : getPlanetColor(planet.name),
                  }}
                />
                <div className="orbital-planet-name">{planet.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="orbital-data-table">
        <h3>Orbital Data Comparison</h3>
        <table>
          <thead>
            <tr>
              <th>Planet</th>
              <th>Orbital Period</th>
              <th>Relative Speed</th>
              <th>Distance from Sun</th>
              <th>Orbit Radius</th>
            </tr>
          </thead>
          <tbody>
            {planets.map(planet => {
              const data = getPlanetData(planet.name);
              return (
                <tr key={planet.id}>
                  <td>
                    <div className="planet-row">
                      <div 
                        className="planet-dot"
                        style={{ background: getPlanetColor(planet.name) }}
                      />
                      {planet.name}
                    </div>
                  </td>
                  <td>{getOrbitalPeriod(planet.name)}</td>
                  <td>{data.speedMultiplier.toFixed(3)}x Earth</td>
                  <td>{planet.distance_from_sun?.toLocaleString() || 'N/A'} km</td>
                  <td>{data.radiusMultiplier.toFixed(1)} AU</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const getPlanetColor = (planetName) => {
  const colors = {
    mercury: "linear-gradient(135deg, #888, #aaa)",
    venus: "linear-gradient(135deg, #ff9966, #ff5e62)",
    earth: "linear-gradient(135deg, #1e90ff, #00bfff)",
    mars: "linear-gradient(135deg, #ff4500, #ff6347)",
    jupiter: "linear-gradient(135deg, #ffa500, #ff8c00)",
    saturn: "linear-gradient(135deg, #f0e68c, #daa520)",
    uranus: "linear-gradient(135deg, #40e0d0, #afeeee)",
    neptune: "linear-gradient(135deg, #4169e1, #1e90ff)",
  };
  
  const name = planetName.toLowerCase();
  for (const [key, value] of Object.entries(colors)) {
    if (name.includes(key)) return value;
  }
  return "linear-gradient(135deg, #667eea, #764ba2)";
};

const getOrbitalPeriod = (planetName) => {
  const periods = {
    mercury: "88 Earth days",
    venus: "225 Earth days",
    earth: "365.25 days (1 year)",
    mars: "687 Earth days (1.88 years)",
    jupiter: "11.86 Earth years",
    saturn: "29.46 Earth years",
    uranus: "84.01 Earth years",
    neptune: "164.8 Earth years",
  };
  
  const name = planetName.toLowerCase();
  for (const [key, value] of Object.entries(periods)) {
    if (name.includes(key)) return value;
  }
  return "N/A";
};

const showPlanetDetails = (planet) => {
  alert(
    `🌌 ${planet.name.toUpperCase()}\n\n` +
    `${planet.description}\n\n` +
    `📏 Distance from Sun: ${planet.distance_from_sun?.toLocaleString() || 'N/A'} km\n` +
    `🔴 Radius: ${planet.radius?.toLocaleString() || 'N/A'} km\n` +
    `⚖️ Mass: ${planet.mass_kg ? planet.mass_kg.toExponential(2) : 'N/A'} kg\n` +
    `🚀 Orbital Speed: ${planet.orbital_speed_km_s || 'N/A'} km/s\n` +
    `⏱️ Orbital Period: ${getOrbitalPeriod(planet.name)}\n` +
    `👤 Added by: ${planet.created_by || 'Unknown'}`
  );
};

export default OrbitalPage;