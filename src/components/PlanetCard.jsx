import React, { useState } from "react";
import api from "../api";

const PlanetCard = ({ planet, isAdmin, refreshPlanets }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: planet.name || "",
    description: planet.description || "",
    distance_from_sun: planet.distance_from_sun || "",
    radius: planet.radius || "",
    mass_kg: planet.mass_kg || "",
    orbital_speed_km_s: planet.orbital_speed_km_s || "",
    image_url: planet.image_url || ""
  });

  console.log("PlanetCard props - isAdmin:", isAdmin, "Planet:", planet.name);

  const toNumber = (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = parseFloat(v);
    return isNaN(n) ? undefined : n;
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${planet.name}"?`)) return;
    
    try {
      await api.delete(`/planets/${planet.id}/`);
      refreshPlanets();
      alert(`Planet "${planet.name}" deleted successfully!`);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete planet: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      distance_from_sun: toNumber(form.distance_from_sun),
      radius: toNumber(form.radius),
      mass_kg: toNumber(form.mass_kg),
      orbital_speed_km_s: toNumber(form.orbital_speed_km_s),
      image_url: form.image_url.trim() || null
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    try {
      await api.put(`/planets/${planet.id}/`, payload);
      setIsEditing(false);
      refreshPlanets();
      alert(`Planet "${form.name}" updated successfully!`);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data) {
        const errors = Object.values(err.response.data).flat().join(', ');
        setError(`Error: ${errors}`);
      } else {
        setError("Failed to update planet. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="planet-card">
      <div className="planet-orbit">
        <div
          className="planet-3d"
          style={{
            backgroundImage: planet.image_url
              ? `url(${planet.image_url})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}
        />
      </div>

      <h2 className="planet-title">{planet.name}</h2>

      <div className="planet-info">
        <p><b>Description:</b> {planet.description || "No description"}</p>
        <p><b>Distance from Sun:</b> {formatNumber(planet.distance_from_sun)} km</p>
        <p><b>Radius:</b> {formatNumber(planet.radius)} km</p>
        <p><b>Mass:</b> {formatNumber(planet.mass_kg)} kg</p>
        <p><b>Orbital Speed:</b> {formatNumber(planet.orbital_speed_km_s)} km/s</p>
        {planet.created_by && (
          <p className="created-by"><small>Added by: {planet.created_by}</small></p>
        )}
      </div>

      {isAdmin === true && (
        <div className="planet-buttons">
          <button 
            className="edit-btn" 
            onClick={() => setIsEditing(true)}
            disabled={submitting}
            title="Edit planet"
          >
            Edit
          </button>
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={submitting}
            title="Delete planet"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {isAdmin === false && (
        <div className="not-admin-message">
          <p><small>Login as admin to edit/delete</small></p>
        </div>
      )}

      {isEditing && (
        <div className="modal-overlay" onClick={() => !submitting && setIsEditing(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Edit {planet.name}</h3>
            
            {error && <div className="modal-error">{error}</div>}

            <form onSubmit={handleEditSubmit} className="edit-form">
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Name *" 
                required
                disabled={submitting}
              />
              
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Description" 
                rows="3"
                disabled={submitting}
              />
              
              <div className="form-row">
                <input 
                  name="distance_from_sun" 
                  value={form.distance_from_sun} 
                  onChange={handleChange} 
                  placeholder="Distance from Sun" 
                  type="number"
                  step="any"
                  disabled={submitting}
                />
                <input 
                  name="radius" 
                  value={form.radius} 
                  onChange={handleChange} 
                  placeholder="Radius" 
                  type="number"
                  step="any"
                  disabled={submitting}
                />
              </div>
              
              <div className="form-row">
                <input 
                  name="mass_kg" 
                  value={form.mass_kg} 
                  onChange={handleChange} 
                  placeholder="Mass (kg)" 
                  type="number"
                  step="any"
                  disabled={submitting}
                />
                <input 
                  name="orbital_speed_km_s" 
                  value={form.orbital_speed_km_s} 
                  onChange={handleChange} 
                  placeholder="Orbital Speed" 
                  type="number"
                  step="any"
                  disabled={submitting}
                />
              </div>
              
              <input 
                name="image_url" 
                value={form.image_url} 
                onChange={handleChange} 
                placeholder="Image URL" 
                disabled={submitting}
              />

              <div className="modal-buttons">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetCard;



