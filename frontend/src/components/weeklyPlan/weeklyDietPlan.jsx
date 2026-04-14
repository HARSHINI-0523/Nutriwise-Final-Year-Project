import { useEffect, useState } from "react";
import { getLatestDietPlan } from "../../services/dietService";
import "./WeeklyDietPlan.css";
import { PiCookingPotFill } from "react-icons/pi";

export default function WeeklyDietPlan() {
  const [dietPlan, setDietPlan] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState("today"); // 🔥 NEW

  useEffect(() => {
    getLatestDietPlan()
      .then((data) => setDietPlan(data))
      .catch((err) => console.error(err));
  }, []);

  if (!dietPlan || !dietPlan.plan) {
    return <div className="diet-empty">No diet plan found.</div>;
  }

  const plan = dietPlan.plan;

  const openModal = (meal) => setSelectedMeal(meal);
  const closeModal = () => setSelectedMeal(null);

  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todayMeals = plan[todayName];

  return (
    <div className="weekly-container">
      {/* ---- Tabs ---- */}
      <div className="today-wrapper">
        <button
          className={`tab-button ${activeTab === "today" ? "active" : ""}`}
          onClick={() => setActiveTab("today")}
        >
          🟢 Today's Diet Plan
        </button>

        <button
          className={`tab-button ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          📅 Weekly Diet Plan
        </button>
        <button
          className={`tab-button ${activeTab === "grocery" ? "active" : ""}`}
          onClick={() => setActiveTab("grocery")}
        >
          🛒 Grocery List
        </button>
      </div>

      {/* ---- TODAY TAB ---- */}
      {activeTab === "today" && (
        <div className="today-card">
          <h2 className="section-title">{todayName}</h2>

          {Object.entries(todayMeals).map(([type, meal]) => (
            <div key={type} className="today-meal-row">
              <strong>{type}:</strong> {meal?.food_name || "-"}
              {meal && (
                <button className="cook-icon" onClick={() => openModal(meal)}>
                  <PiCookingPotFill />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---- WEEKLY TAB ---- */}
      {activeTab === "weekly" && (
        <>
          <div className="week-grid">
            {Object.entries(plan).map(([day, meals]) => (
              <div key={day} className="day-box">
                <h3>{day}</h3>

                {Object.entries(meals).map(([mealType, meal]) => (
                  <div key={mealType} className="meal-row">
                    {meal && (
                      <button
                        className="cook-icon"
                        onClick={() => openModal(meal)}
                      >
                        <PiCookingPotFill />
                      </button>
                    )}

                    <span className="meal-label">{mealType}:</span>
                    <span className="meal-name">{meal?.food_name || "-"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === "grocery" && (
        <div className="grocery-card">
          <h2 className="section-title">Weekly Grocery List</h2>

          <ul className="grocery-list">
            {Object.entries(dietPlan.groceryList || {}).map(([item, count]) => (
              <li key={item}>
                <span className="grocery-item">{item}</span>
                <span className="grocery-count">x {count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- Modal ---- */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMeal.food_name}</h2>

            <p>
              <strong>Meal Type:</strong> {selectedMeal.meal_type}
            </p>
            <p>
              <strong>Diet Type:</strong> {selectedMeal.diet_type}
            </p>
            <p>
              <strong>Prep Time:</strong> {selectedMeal.prep_time_min} min
            </p>
            <p>
              <strong>Cook Time:</strong> {selectedMeal.cook_time_min} min
            </p>
            <p>
              <strong>Cuisine:</strong> {selectedMeal.cuisine}
            </p>

            <h3>Ingredients</h3>
            <p>{selectedMeal.ingredient}</p>

            <h3>Instructions</h3>
            <p>{selectedMeal.instructions}</p>

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
