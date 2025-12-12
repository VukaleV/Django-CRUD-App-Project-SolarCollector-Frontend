import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Starfield from "../components/Starfield";

const PlanetPage = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);

  useEffect(() => {
    api.get(`/planets/${id}/`).then((res) => setPlanet(res.data));
  }, [id]);

  if (!planet) return <h2>Loading...</h2>;

  return (
    <div className="app-container">
      <Starfield />

      <h1>{planet.name}</h1>
      <img src={planet.image_url} alt={planet.name} width="300" />
      <p>{planet.description}</p>

      <p>Radius: {planet.radius} km</p>
      <p>Distance: {planet.distance_from_sun} km</p>
    </div>
  );
};

export default PlanetPage;
