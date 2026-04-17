// PROYECTO FINAL
import { useApp } from "../context/AppContext";
import { calculateTMB, calculateCalories, calculateMacros } from "../utils/calculations";

export const NutritionDashboard = () => {
    const { state } = useApp();

    const tmb = calculateTMB(state.user);

    const calories = calculateCalories(tmb, state.goal);
    const macros = calculateMacros(calories);

    return (
        <div className="card shadow p-4 mb-4 bg-light">
            <h4 className="text-success mb-3">Resumen Nutricional</h4>

            <div className="row text-center">
                <div className="col">
                    <h6>TMB</h6>
                    <p>{Math.round(tmb)}</p>
                </div>

                <div className="col">
                    <h6>Calorías</h6>
                    <p>{Math.round(calories)}</p>
                </div>
            </div>

            <hr />

            <div className="row text-center">
                <div className="col">
                    <h6>Proteína</h6>
                    <p>{Math.round(macros.protein)}g</p>
                </div>

                <div className="col">
                    <h6>Carbohidrato</h6>
                    <p>{Math.round(macros.carbs)}g</p>
                </div>

                <div className="col">
                    <h6>Grasa</h6>
                    <p>{Math.round(macros.fat)}g</p>
                </div>
            </div>
        </div>
    );
};