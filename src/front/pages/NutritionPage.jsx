import React, { useState, useEffect } from "react";

export const NutritionPage = () => {
    const [calories, setCalories] = useState(0);
    const [dietType, setDietType] = useState("Equilibrada");
    const [foodEntry, setFoodEntry] = useState({ food: "", calories: "" });

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

    useEffect(() => { loadNutritionData(); }, []);

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
        }
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow border-0 p-4 mb-4">
                        <h4 className="fw-bold text-success mb-3">Registrar Alimento</h4>
                        <form onSubmit={handleAddFood}>
                            <div className="mb-3">
                                <label className="small fw-bold">NOMBRE DEL ALIMENTO</label>
                                <input
                                    type="text" className="form-control"
                                    placeholder="Ej: Pechuga de pollo"
                                    value={foodEntry.food}
                                    onChange={e => setFoodEntry({ ...foodEntry, food: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold">CALORÍAS (KCAL)</label>
                                <input
                                    type="number" className="form-control"
                                    placeholder="0"
                                    value={foodEntry.calories}
                                    onChange={e => setFoodEntry({ ...foodEntry, calories: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn btn-success w-100 fw-bold shadow-sm">AÑADIR A MI DÍA</button>
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow border-0 p-5 text-center bg-success text-white h-100 d-flex justify-content-center">
                        <h5 className="fw-bold">TOTAL CONSUMIDO</h5>
                        <h1 className="display-1 fw-bold">{calories}</h1>
                        <p className="mb-0 fs-4">Kcal</p>
                        <hr className="my-4 opacity-25" />
                        <p className="small fw-bold">TIPO DE DIETA ACTUAL:</p>
                        <span className="badge bg-white text-success fs-6">{dietType}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};