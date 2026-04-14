import React, { useState } from 'react';
import api from "../../api/axios";
import './userDetailsForm.css';

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    isDiabetic: false,
    hasHypertension: false,
    hasThyroid: false,
    hasHeartDisease: false,
    hasKidneyDisease: false,
    hasOtherAllergies: '',
    cholesterolLevel: 'Normal',
    foodAllergies: '',
    lifestyle: {
      exerciseFrequency: '',
      sleepHours: '',
      smoke: false,
      alcohol: false,
      waterIntake: '',
      stressLevel: '',
    },
    additionalDetails: {
      medications: '',
      dietaryPreference: '',
    }
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.lifestyle) {
      setFormData(prevData => ({
        ...prevData,
        lifestyle: { ...prevData.lifestyle, [name]: type === 'checkbox' ? checked : value }
      }));
    } else if (name in formData.additionalDetails) {
      setFormData(prevData => ({
        ...prevData,
        additionalDetails: { ...prevData.additionalDetails, [name]: value }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user-details', formData); // Corrected URL
      setMessage(response.data.message);

      // Reset form after successful submission
      setFormData({
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        isDiabetic: false,
        hasHypertension: false,
        hasThyroid: false,
        hasHeartDisease: false,
        hasKidneyDisease: false,
        hasOtherAllergies: '',
        cholesterolLevel: 'Normal',
        foodAllergies: '',
        lifestyle: {
          exerciseFrequency: '',
          sleepHours: '',
          smoke: false,
          alcohol: false,
          waterIntake: '',
          stressLevel: '',
        },
        additionalDetails: {
          medications: '',
          dietaryPreference: '',
        }
      });
    } catch (error) {
      console.error("Error saving details:", error);
      setMessage("Failed to save details. Please try again.");
    }
  };

  return (
    <div className="user-details-form-container">
      <div className="form-content">
        <div className="form-header">
          <h2>Health Profile Setup </h2>
          <p>Fill your health, lifestyle, and allergy info to save your profile.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Personal Information */}
          <fieldset className="form-section">
            <legend>1. Personal Information</legend>
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Jane Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age:</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g., 28" required />
              </div>
            </div>
          </fieldset>

          {/* Gender */}
          <fieldset className="form-section">
            <legend>2. Gender</legend>
            <div className="check-radio-group radio-group">
              <label className="radio-label">
                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} /> Female
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} /> Male
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleInputChange} /> Other
              </label>
            </div>
          </fieldset>

          {/* Vitals */}
          <fieldset className="form-section">
            <legend>3. Height & Weight</legend>
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm):</label>
                <input type="number" id="height" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g., 175" required />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg):</label>
                <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 70" required />
              </div>
            </div>
          </fieldset>

          {/* Pre-Medical Conditions */}
          <fieldset className="form-section">
            <legend>4. Pre-Medical Conditions</legend>
            <label className="input-label">Existing Chronic Conditions:</label>
            <div className="check-radio-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isDiabetic" checked={formData.isDiabetic} onChange={handleInputChange} /> Diabetic
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="hasHypertension" checked={formData.hasHypertension} onChange={handleInputChange} /> Hypertension
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="hasThyroid" checked={formData.hasThyroid} onChange={handleInputChange} /> Thyroid
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="hasHeartDisease" checked={formData.hasHeartDisease} onChange={handleInputChange} /> Heart Disease
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="hasKidneyDisease" checked={formData.hasKidneyDisease} onChange={handleInputChange} /> Kidney Disease
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="hasOtherAllergies">Other Allergies:</label>
              <input type="text" id="hasOtherAllergies" name="hasOtherAllergies" value={formData.hasOtherAllergies} onChange={handleInputChange} placeholder="e.g., Pollen, Dust" />
            </div>

            <label className="input-label radio-label-top">Cholesterol Level:</label>
            <div className="check-radio-group radio-group">
              <label className="radio-label">
                <input type="radio" name="cholesterolLevel" value="Normal" checked={formData.cholesterolLevel === 'Normal'} onChange={handleInputChange} /> Normal
              </label>
              <label className="radio-label">
                <input type="radio" name="cholesterolLevel" value="Borderline" checked={formData.cholesterolLevel === 'Borderline'} onChange={handleInputChange} /> Borderline
              </label>
              <label className="radio-label">
                <input type="radio" name="cholesterolLevel" value="High" checked={formData.cholesterolLevel === 'High'} onChange={handleInputChange} /> High
              </label>
            </div>
          </fieldset>

          {/* Food Allergies */}
          <fieldset className="form-section">
            <legend>5. Food Allergies</legend>
            <label className="input-label">Enter your food allergies (comma separated):</label>
            <input
              type="text"
              name="foodAllergies"
              value={formData.foodAllergies}
              onChange={handleInputChange}
              placeholder="e.g., Lactose, Gluten, Peanuts"
            />
          </fieldset>

          {/* Lifestyle */}
          <fieldset className="form-section">
            <legend>6. Lifestyle</legend>
            <div className="form-group">
              <label htmlFor="exerciseFrequency">Exercise Frequency (per week):</label>
              <input type="number" id="exerciseFrequency" name="exerciseFrequency" value={formData.lifestyle.exerciseFrequency} onChange={handleInputChange} placeholder="e.g., 3" />
            </div>
            <div className="form-group">
              <label htmlFor="sleepHours">Average Sleep (hours per night):</label>
              <input type="number" id="sleepHours" name="sleepHours" value={formData.lifestyle.sleepHours} onChange={handleInputChange} placeholder="e.g., 7" />
            </div>
            <div className="check-radio-group">
              <label className="checkbox-label">
                <input type="checkbox" name="smoke" checked={formData.lifestyle.smoke} onChange={handleInputChange} /> Do you smoke?
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="alcohol" checked={formData.lifestyle.alcohol} onChange={handleInputChange} /> Consume alcohol?
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="waterIntake">Daily Water Intake (liters):</label>
              <input type="number" id="waterIntake" name="waterIntake" value={formData.lifestyle.waterIntake} onChange={handleInputChange} placeholder="e.g., 2.5" />
            </div>
            <div className="form-group">
              <label htmlFor="stressLevel">Stress Level:</label>
              <select id="stressLevel" name="stressLevel" value={formData.lifestyle.stressLevel} onChange={handleInputChange}>
                <option value="">-- Select --</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </fieldset>

          {/* Additional Details */}
          <fieldset className="form-section">
            <legend>7. Additional Information</legend>
            <div className="form-group">
              <label htmlFor="medications">Current Medications:</label>
              <input type="text" id="medications" name="medications" value={formData.additionalDetails.medications} onChange={handleInputChange} placeholder="e.g., Metformin, Vitamin D" />
            </div>
            <div className="form-group">
              <label htmlFor="dietaryPreference">Dietary Preference:</label>
              <select id="dietaryPreference" name="dietaryPreference" value={formData.additionalDetails.dietaryPreference} onChange={handleInputChange}>
                <option value="">-- Select --</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Keto">Keto</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </fieldset>

          <button type="submit" className="nutriwise-button">Save My Details 💾</button>
        </form>

        {message && <p style={{ marginTop: '15px', textAlign: 'center', color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
};

export default UserDetailsForm;
