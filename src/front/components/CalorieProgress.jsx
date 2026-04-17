import { useApp } from "../context/AppContext";
import { calculateTMB, calculateCalories } from "../utils/calculations";

export const CalorieProgress = () => {
    const { state } = useApp();

    // calorías consumidas
    const consumed = state.foods.reduce(
        (sum, food) => sum + Number(food.calories),
        0
    );

    // calorías objetivo
    const tmb = calculateTMB(state.user);
    const goalCalories = calculateCalories(tmb, state.goal);

    if (!goalCalories) {
        return (
            <div className="alert alert-warning text-center">
                Completa tu meta para ver tu progreso
            </div>
        );
    }

    // porcentaje
    const percentage = Math.min((consumed / goalCalories) * 100, 100);

    let barColor = "success";

    if (percentage > 80) barColor = "warning";
    if (percentage >= 100) barColor = "danger";

    return (
        <div className="card shadow p-4 mb-4">

            <h5 className="text-center mb-3">
                {consumed} / {Math.round(goalCalories)} cal
            </h5>

            <div className="progress" style={{ height: "25px" }}>
                <div
                    className={`progress-bar bg-${barColor}`}
                    role="progressbar"
                    style={{ width: `${percentage}%` }}
                >
                    {Math.round(percentage)}%
                </div>
            </div>

            <p className="text-center mt-2">
                {isOver
                    ? "⚠️ Has superado tu meta"
                    : "✅ Vas bien con tu objetivo"}
            </p>

        </div>
    );
};