export const initialState = {
  foods: [],
  category: "All",
  goal: "maintain",
  diet: "balanced", // 🆕 tipo de dieta
  user: {
    weight: "",
    height: "",
    age: "",
    gender: "",
    activity: "moderate", // 🆕 nivel de actividad
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FOODS":
      return { ...state, foods: action.payload };

    case "ADD_FOOD":
      return { ...state, foods: [...state.foods, action.payload] };

    case "UPDATE_FOOD":
      return {
        ...state,
        foods: state.foods.map((food) =>
          food.id === action.payload.id ? action.payload : food,
        ),
      };

    case "DELETE_FOOD":
      return {
        ...state,
        foods: state.foods.filter((food) => food.id !== action.payload),
      };

    case "SET_CATEGORY":
      return { ...state, category: action.payload };

    case "SET_GOAL":
      return { ...state, goal: action.payload };

    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.payload } };

    case "SET_DIET":
      return { ...state, diet: action.payload };

    case "SET_ACTIVITY":
      return {
        ...state,
        user: { ...state.user, activity: action.payload },
      };

    default:
      return state;
  }
};
