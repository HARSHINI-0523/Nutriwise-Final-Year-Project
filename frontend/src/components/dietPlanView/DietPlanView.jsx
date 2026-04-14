import "./DietPlanView.css";

export default function DietPlanView({ dietPlan }) {
  if (!dietPlan || !dietPlan.plan) {
    return <div className="diet-empty">No diet plan available.</div>;
  }

  const { plan, avoidList } = dietPlan;

  return (
    <div className="diet-view-container">
      <h2 className="diet-title">Your 7-Day Diet Plan</h2>

      {Object.entries(plan).map(([day, meals]) => (
        <div key={day} className="day-card">
          <h3 className="day-title">{day}</h3>

          <div className="meal-grid">
            {Object.entries(meals).map(([mealType, meal]) => (
              <div key={mealType} className="meal-card">
                <h4 className="meal-title">{mealType}</h4>

                <p className="food-name">{meal.food_name}</p>

                <div className="meal-meta">
                  <span>{meal.portion_g} g</span>
                  <span>{meal.calories} kcal</span>
                </div>

                <div className="macros">
                  <span>P: {meal.protein_g} g</span>
                  <span>C: {meal.carbs_g} g</span>
                  <span>F: {meal.fat_g} g</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {avoidList?.length > 0 && (
        <div className="avoid-card">
          <h3>Foods to Avoid</h3>
          <ul>
            {avoidList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
