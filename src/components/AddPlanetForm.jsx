import React, { useState, useEffect } from 'react';
import api from '../api';

const AddPlanetForm = ({ refreshPlanets }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    radius: '',
    distance_from_sun: '',
    mass_kg: '',
    orbital_speed_km_s: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.is_superuser || false);
      } catch (e) {
        console.error("JWT decode failed:", e);
      }
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="admin-only-message">
        <h3>⚠️ Admin Access Required</h3>
        <p>Only administrators can add new planets.</p>
        <p>Please contact an admin or login with admin credentials.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cleanNumber = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      radius: cleanNumber(formData.radius),
      distance_from_sun: cleanNumber(formData.distance_from_sun),
      mass_kg: cleanNumber(formData.mass_kg),
      orbital_speed_km_s: cleanNumber(formData.orbital_speed_km_s),
      image_url: formData.image_url.trim() || null
    };

    if (!payload.name) {
      setError('Planet name is required');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/planets/', payload);
      
      setFormData({
        name: '',
        description: '',
        radius: '',
        distance_from_sun: '',
        mass_kg: '',
        orbital_speed_km_s: '',
        image_url: ''
      });

      setSuccess('Planet added successfully!');
      refreshPlanets();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error while adding planet:", err);
      if (err.response?.data) {
        const errors = Object.values(err.response.data).flat().join(', ');
        setError(`Error: ${errors}`);
      } else {
        setError('Failed to add planet. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-planet-form">
      <h3>➕ Add New Planet (Admin Only)</h3>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <input 
        type="text" 
        name="name" 
        placeholder="Planet Name *" 
        value={formData.name} 
        onChange={handleChange}
        required
      />

      <textarea 
        name="description" 
        placeholder="Description" 
        value={formData.description} 
        onChange={handleChange}
        rows="3"
      />

      <div className="form-row">
        <input 
          type="number" 
          name="distance_from_sun" 
          placeholder="Distance from Sun (km)" 
          value={formData.distance_from_sun} 
          onChange={handleChange}
          step="any"
        />
        <input 
          type="number" 
          name="radius" 
          placeholder="Radius (km)" 
          value={formData.radius} 
          onChange={handleChange}
          step="any"
        />
      </div>

      <div className="form-row">
        <input 
          type="number" 
          name="mass_kg" 
          placeholder="Mass (kg)" 
          value={formData.mass_kg} 
          onChange={handleChange}
          step="any"
        />
        <input 
          type="number" 
          name="orbital_speed_km_s" 
          placeholder="Orbital Speed (km/s)" 
          value={formData.orbital_speed_km_s} 
          onChange={handleChange}
          step="any"
        />
      </div>

      <input 
        type="text" 
        name="image_url" 
        placeholder="Image URL (optional)" 
        value={formData.image_url} 
        onChange={handleChange}
      />

      <div className="form-note">
        <p><small>Only administrators can add new planets</small></p>
      </div>

      <button 
        type="submit" 
        disabled={submitting}
        className={submitting ? 'submitting-btn' : ''}
      >
        {submitting ? 'Adding...' : 'Add Planet'}
      </button>
    </form>
  );
};

export default AddPlanetForm;
