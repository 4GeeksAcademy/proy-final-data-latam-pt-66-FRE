// PROYECTO FINAL
export const calculateTMB = ({ weight, height, age, gender }) => {
  if (!weight || !height || !age) return 0;

  return gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateCalories = (tmb, goal) => {
  if (goal === "lose") return tmb - 500;
  if (goal === "gain") return tmb + 500;
  return tmb;
};

export const calculateMacros = (calories) => ({
  protein: (calories * 0.3) / 4,
  carbs: (calories * 0.4) / 4,
  fat: (calories * 0.3) / 9,
});
