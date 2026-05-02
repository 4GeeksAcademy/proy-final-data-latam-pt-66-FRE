import { createContext, useReducer, useContext } from "react";

const NutritionContext = createContext();

const initialState = {
  calories: 0,
  macros: {
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  dietType: "Equilibrada",
  foodEntry: {
    food: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    category: "Desayuno",
  },
  foodList: [],
  plan: null,
  recommendations: [],
  currentRecIndex: 0,
  showModal: false,
  editingId: null,
};

function nutritionReducer(state, action) {
  switch (action.type) {
    case "SET_SUMMARY":
      return {
        ...state,
        calories: action.payload.calories,
        dietType: action.payload.dietType,
        macros: action.payload.macros,
      };

    case "SET_PLAN":
      return { ...state, plan: action.payload };

    case "SET_RECOMMENDATIONS":
      return {
        ...state,
        recommendations: action.payload,
        showModal: true,
      };

    case "SET_FOOD_LIST":
      return { ...state, foodList: action.payload };

    case "SET_FOOD_ENTRY":
      return {
        ...state,
        foodEntry: { ...state.foodEntry, ...action.payload },
      };

    case "RESET_FOOD_ENTRY":
      return {
        ...state,
        foodEntry: initialState.foodEntry,
      };

    case "SET_EDITING":
      return {
        ...state,
        editingId: action.payload.id,
        foodEntry: action.payload.data,
      };

    case "CLEAR_EDITING":
      return {
        ...state,
        editingId: null,
        foodEntry: initialState.foodEntry,
      };

    case "SET_REC_INDEX":
      return {
        ...state,
        currentRecIndex: action.payload,
      };

    case "HIDE_MODAL":
      return {
        ...state,
        showModal: false,
      };

    default:
      return state;
  }
}

export const NutritionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);

  const token = sessionStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ---------------- API CALLS ----------------

  const loadNutritionData = async () => {
    const res = await fetch(`${backendUrl}/api/daily-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();

      dispatch({
        type: "SET_SUMMARY",
        payload: {
          calories: data.total_calories || 0,
          dietType: data.diet_type || "Equilibrada",
          macros: {
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fat: data.fat || 0,
          },
        },
      });
    }
  };

  const loadPlan = async () => {
    const res = await fetch(`${backendUrl}/api/nutrition-plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) dispatch({ type: "SET_PLAN", payload: data });
  };

  const loadRecommendations = async () => {
    const res = await fetch(`${backendUrl}/api/ai-recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      dispatch({
        type: "SET_RECOMMENDATIONS",
        payload: data.recommendations,
      });
    }
  };

  const loadFoodList = async () => {
    const res = await fetch(`${backendUrl}/api/daily-log`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({ type: "SET_FOOD_LIST", payload: data });
    }
  };

  const addFood = async (foodEntry) => {
    const res = await fetch(`${backendUrl}/api/daily-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodEntry),
    });

    if (res.ok) {
      dispatch({ type: "RESET_FOOD_ENTRY" });

      await Promise.all([
        loadFoodList(),
        loadNutritionData(),
        loadRecommendations(),
      ]);
    }
  };

  const updateFood = async (id, foodEntry) => {
    const res = await fetch(`${backendUrl}/api/daily-log/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodEntry),
    });

    if (res.ok) {
      dispatch({ type: "CLEAR_EDITING" });

      await Promise.all([loadFoodList(), loadNutritionData()]);
    }
  };

  const deleteFood = async (id) => {
    const res = await fetch(`${backendUrl}/api/daily-log/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await Promise.all([loadFoodList(), loadNutritionData()]);
    }
  };

  // ---------------- EXPORT ----------------

  return (
    <NutritionContext.Provider
      value={{
        state,
        dispatch,
        loadNutritionData,
        loadPlan,
        loadRecommendations,
        loadFoodList,
        addFood,
        updateFood,
        deleteFood,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error("useNutrition must be used within NutritionProvider");
  }
  return context;
};
