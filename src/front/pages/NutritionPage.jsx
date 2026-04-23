import React, { useState, useEffect } from "react";

export const NutritionPage = () => {
    const [calories, setCalories] = useState(0);
    const [dietType, setDietType] = useState("Equilibrada");
    const [foodEntry, setFoodEntry] = useState({ food: "", calories: "" });
    const [plan, setPlan] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadNutritionData = async () => {
        const res = await fetch(`${backendUrl}/api/daily-summary`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setCalories(data.total_calories || 0);
            setDietType(data.diet_type || "Equilibrada");
        }
    };

    const loadPlan = async () => {
        const res = await fetch(`${backendUrl}/api/nutrition-plan`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setPlan(data);
    };

    const loadRecommendations = async () => {
        const res = await fetch(`${backendUrl}/api/ai-recommendations`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setRecommendations(data.recommendations);
    };

    useEffect(() => {
        loadNutritionData();
        loadPlan();
        loadRecommendations();
    }, []);

    const handleAddFood = async (e) => {
        e.preventDefault();
        const res = await fetch(`${backendUrl}/api/daily-log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                category: "Comida",
                food: foodEntry.food,
                calories: parseInt(foodEntry.calories || 0),
                water: 0
            })
        });
        if (res.ok) {
            setFoodEntry({ food: "", calories: "" });
            loadNutritionData();
            loadPlan();
        }
    };

    const progress = plan ? (calories / plan.calories) * 100 : 0;
    const remaining = plan ? plan.calories - calories : 0;

    return (
        <div className="container py-4">

            {/* 🔥 HEADER RESUMEN */}
            <div className="card shadow border-0 p-4 mb-4 bg-success text-white text-center">
                <h5 className="fw-bold">TU DÍA NUTRICIONAL</h5>
                <h1 className="display-4 fw-bold mb-0">{calories} kcal</h1>
                <small>Consumidas hoy</small>
                <div className="mt-2">
                    <span className="badge bg-light text-success">{dietType}</span>
                </div>
            </div>

            {/* 📊 PLAN + PROGRESO */}
            {plan && (
                <div className="card shadow border-0 p-4 mb-4">

                    <h5 className="fw-bold text-success mb-4 text-center">
                        PLAN PERSONALIZADO
                    </h5>

                    <div className="row text-center mb-4">
                        <div className="col">
                            <h4>{plan.calories}</h4>
                            <small>Kcal</small>
                        </div>
                        <div className="col">
                            <h4>{plan.protein}g</h4>
                            <small>Proteína</small>
                        </div>
                        <div className="col">
                            <h4>{plan.carbs}g</h4>
                            <small>Carbs</small>
                        </div>
                        <div className="col">
                            <h4>{plan.fat}g</h4>
                            <small>Grasas</small>
                        </div>
                    </div>

                    {/* PROGRESO */}
                    <div className="mb-2 d-flex justify-content-between">
                        <small>{calories} / {plan.calories} kcal</small>
                        <small className={remaining < 0 ? "text-danger" : "text-success"}>
                            {remaining < 0
                                ? `+${Math.abs(remaining)} exceso`
                                : `${remaining} restantes`}
                        </small>
                    </div>

                    <div className="progress" style={{ height: "12px" }}>
                        <div
                            className={`progress-bar ${progress > 100 ? "bg-danger" : "bg-success"
                                }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <div className="mt-3 text-center small fw-bold">
                        {progress < 50 && "🍽️ Come un poco más"}
                        {progress >= 50 && progress <= 100 && "👌 Excelente progreso"}
                        {progress > 100 && "⚠️ Exceso hoy"}
                    </div>

                </div>
            )}

            {/* 🍽️ FORM + RESUMEN */}
            <div className="row g-4">

                {/* FORM */}
                <div className="col-md-5">
                    <div className="card shadow border-0 p-4 h-100">
                        <h5 className="fw-bold text-success mb-3">Registrar comida</h5>

                        <form onSubmit={handleAddFood}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="¿Qué comiste?"
                                value={foodEntry.food}
                                onChange={e => setFoodEntry({ ...foodEntry, food: e.target.value })}
                                required
                            />

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Calorías"
                                value={foodEntry.calories}
                                onChange={e => setFoodEntry({ ...foodEntry, calories: e.target.value })}
                                required
                            />

                            <button className="btn btn-success w-100 fw-bold">
                                + Añadir
                            </button>
                        </form>
                    </div>
                </div>

                {/* RESUMEN LATERAL */}
                <div className="col-md-7">
                    <div className="card shadow border-0 p-4 h-100 d-flex justify-content-center text-center">
                        <h2 className="fw-bold text-success">Consumidas: {calories} kcal</h2>
                        <h2 className="fw-bold text-warning"> Restantes: {remaining} kcal</h2>

                        {plan && (
                            <p>
                                Meta: {plan.calories} kcal
                            </p>
                        )}
                    </div>
                </div>

                {/* 🤖 RECOMENDACIONES */}
                {recommendations.length > 0 && (
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <h5 className="fw-bold text-success mb-3 text-center">
                            RECOMENDACIONES
                        </h5>

                        {recommendations.map((rec, i) => (
                            <div key={i} className="alert alert-light border small mb-2">
                                {rec}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};