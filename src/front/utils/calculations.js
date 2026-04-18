// PROYECTO FINAL
export const calculateTMB = ({ weight, height, age, gender }) => {
  if (!weight || !height || !age) return 0;

  return gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateCalories = (tmb, goal, activity) => {
  let calories = tmb * activityFactor(activity);
  if (goal === "lose") return calories - 400;
  if (goal === "gain") return calories + 400;
  return calories;
};

export const calculateMacros = (calories) => ({
  protein: (calories * 0.3) / 4,
  carbs: (calories * 0.4) / 4,
  fat: (calories * 0.3) / 9,
});

export const activityFactor = (level) => {
  if (level === "low") return 1.2;
  if (level === "moderate") return 1.55;
  if (level === "high") return 1.9;
  return 1.2;
};
