import { useApp } from "../context/AppContext";

export const FoodList = ({ setEditingFood }) => {
    const { state, deleteFood, deleteAllFoods } = useApp();

    const handleDelete = (id) => {
        if (confirm("¿Eliminar este alimento?")) {
            deleteFood(id);
        }
    };

    const categoryColors = {
        Desayuno: "success",
        Comida: "success",
        Cena: "success",
        Snack: "success"
    };

    const handleDeleteAll = () => {
        if (confirm("¿Confirmas que deseas eliminar todos los alimentos?")) {
            deleteAllFoods();
        }
    };

    // Agrupar alimentos
    const groupedFoods = state.foods.reduce((acc, food) => {
        const category = food.mealtime || "Otros";

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(food);
        return acc;
    }, {});

    const totalDayCalories = state.foods.reduce(
        (sum, food) => sum + Number(food.calories),
        0
    );

    if (!state.foods.length) {
        return <div className="alert alert-info">No hay alimentos aún</div>;
    }

    return (
        <div className="card shadow p-3">

            {/* HEADER + BOTÓN */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-success m-0">Tus alimentos</h4>

                <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteAll}
                    disabled={!state.foods.length}
                >
                    🗑️ Eliminar todo
                </button>
            </div>

            {Object.entries(groupedFoods).map(([category, foods]) => {

                const totalCalories = foods.reduce(
                    (sum, food) => sum + Number(food.calories),
                    0
                );

                return (
                    <div key={category} className="mb-4">

                        {/* 🧠 Título + total */}
                        <h5 className={`text-${categoryColors[category] || "secondary"} border-bottom pb-2`}>
                            {category} ({totalCalories} cal)
                        </h5>

                        <ul className="list-group mt-2">
                            {foods.map(food => (
                                <li
                                    key={food.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{food.name}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {food.calories} cal  •  {food.category}
                                        </small>
                                    </div>

                                    <div>
                                        <button
                                            className="btn btn-sm me-2"
                                            onClick={() => setEditingFood(food)}
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            className="btn btn-sm"
                                            onClick={() => handleDelete(food.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
            <h5 className="text-center text-success mb-4">
                Calorias totales: {totalDayCalories} cal
            </h5>

        </div>
    );
};