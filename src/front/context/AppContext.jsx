// PROYECTO FINAL
import { createContext, useReducer, useContext } from "react";
import { reducer, initialState } from "./reducer";

const AppContext = createContext();

const backendUrl = "https://laughing-funicular-pjjw9g7v5p4j29xv-3001.app.github.dev";

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadFoods = async () => {
        try {
            const resp = await fetch(`${backendUrl}/foods`);
            const data = await resp.json();
            dispatch({ type: "SET_FOODS", payload: data });
        } catch (error) {
            console.error("Error cargando alimentos:", error);
        }
    };

    const addFood = async (food) => {
        const newFood = {
            ...food,
            id: Date.now(), // id temporal
            calories: Number(food.calories)
        };

        dispatch({ type: "ADD_FOOD", payload: newFood });

        try {
            await fetch(`${backendUrl}/foods`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFood)
            });

            loadFoods();

        } catch (error) {
            console.error("Error agregando:", error);
        }
    };

    const updateFood = async (id, updatedFood) => {

        const updated = {
            ...updatedFood,
            id,
            calories: Number(updatedFood.calories)
        };

        dispatch({ type: "UPDATE_FOOD", payload: updated });

        try {
            await fetch(`${backendUrl}/foods/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });

        } catch (error) {
            console.error("Error actualizando:", error);
        }
    };

    const deleteFood = async (id) => {

        dispatch({ type: "DELETE_FOOD", payload: id });

        try {
            await fetch(`${backendUrl}/foods/${id}`, {
                method: "DELETE"
            });

        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    const deleteAllFoods = async () => {
        dispatch({ type: "SET_FOODS", payload: [] });

        try {
            await fetch(`${backendUrl}/foods`, {
                method: "DELETE"
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppContext.Provider value={{
            state,
            dispatch,
            loadFoods,
            addFood,
            updateFood,
            deleteFood,
            deleteAllFoods
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);