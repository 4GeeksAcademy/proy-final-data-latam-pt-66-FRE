import React, { useState, useEffect, useCallback } from "react";

export const NutritionPage = () => {
    const [userStats, setUserStats] = useState({ 
        diet_type: "Estándar", 
        goal: "adelgazar", 
        weight: 77, 
        age: 33, 
        height: 177 
    });
    const [foodList, setFoodList] = useState([]);
    const [foodEntry, setFoodEntry] = useState({ 
        food: "", calories: "", protein: "", carbs: "", fat: "", category: "Desayuno" 
    });

    const token = sessionStorage.getItem("token") || sessionStorage.getItem("access_token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const formatText = (text) => {
        if (!text) return "...";
        return text.replace(/_/g, ' ').toUpperCase();
    };

    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUserStats({ 
                    diet_type: data.diet_type || "Estándar", 
                    goal: data.goal || "adelgazar",
                    weight: data.weight || 77,
                    age: data.age || 33,
                    height: data.height || 177
                });
            }
        } catch (err) { console.error("Error al traer perfil", err); }
    }, [token, backendUrl]);

    const getLogs = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/api/daily-log`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFoodList(data);
            }
        } catch (err) { console.error("Error al traer logs", err); }
    }, [token, backendUrl]);

    useEffect(() => {
        if (token) {
            fetchUserProfile();
            getLogs();
        }
    }, [token, fetchUserProfile, getLogs]);

    // Esta función recalcula los límites cada vez que userStats cambia
    const calculateLimits = () => {
        const { weight, height, age, goal } = userStats;
        
        // Tasa Metabólica Basal (Harris-Benedict)
        let tmb = 66.47 + (13.75 * weight) + (5 * height) - (6.75 * age);
        let mantenimiento = tmb * 1.55; // Actividad moderada
        
        // Ajuste según el objetivo para "reiniciar" las metas
        let calLimit;
        if (goal.toLowerCase() === "adelgazar") {
            calLimit = mantenimiento - 500;
        } else if (goal.toLowerCase() === "masa_muscular") {
            calLimit = mantenimiento + 500;
        } else {
            calLimit = mantenimiento;
        }
        
        return {
            calories: Math.round(calLimit),
            protein: Math.round(weight * 2.0),
            fat: Math.round((calLimit * 0.25) / 9),
            carbs: Math.round((calLimit * 0.45) / 4)
        };
    };

    const limits = calculateLimits();
    const totals = {
        calories: foodList.reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0),
        protein: foodList.reduce((acc, curr) => acc + (Number(curr.protein) || 0), 0),
        carbs: foodList.reduce((acc, curr) => acc + (Number(curr.carbs) || 0), 0),
        fat: foodList.reduce((acc, curr) => acc + (Number(curr.fat) || 0), 0),
    };

    const ProgressCircle = ({ current, total, color, label, unit }) => {
        const percentage = Math.min((current / total) * 100, 100) || 0;
        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="text-center mx-2">
                <div className="position-relative d-inline-block">
                    <svg width="100" height="100">
                        <circle cx="50" cy="50" r={radius} stroke="#f0f0f0" strokeWidth="7" fill="transparent" />
                        <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="7" fill="transparent"
                            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }} transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{Math.round(percentage)}%</span>
                    </div>
                </div>
                <p className="small fw-bold text-muted mt-2 mb-0 text-uppercase" style={{fontSize: '0.7rem'}}>{label}</p>
                <p className="small text-secondary" style={{fontSize: '0.75rem'}}>{Math.round(current)}{unit} / {total}{unit}</p>
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${backendUrl}/api/daily-log`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...foodEntry, water: 0 })
        });
        if (res.ok) {
            setFoodEntry({ food: "", calories: "", protein: "", carbs: "", fat: "", category: "Desayuno" });
            getLogs();
        }
    };

    return (
        <div className="container py-4 text-start">
            {/* Banner con el Plan y Objetivo actualizados */}
            <div className="card border-0 shadow-sm overflow-hidden mb-4" style={{ backgroundColor: "#198754", borderRadius: "15px" }}>
                <div className="card-body p-4 text-white text-start">
                    <div className="row align-items-center">
                        <div className="col-md-6 border-end border-white border-opacity-25">
                            <h2 className="fw-bold mb-0 text-uppercase">MI PLAN: {formatText(userStats.diet_type)}</h2>
                            <p className="opacity-75 mb-0 fw-bold">OBJETIVO: {formatText(userStats.goal)}</p>
                        </div>
                        <div className="col-md-6 text-end">
                            <div className="d-flex justify-content-end align-items-baseline">
                                <h1 className="fw-bold mb-0 me-2">{totals.calories}</h1>
                                <span className="h4 mb-0 opacity-75">/ {limits.calories} Kcal</span>
                            </div>
                            <p className="small opacity-75 mb-0 text-uppercase fw-bold">Consumo vs Límite Actual</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-5">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm h-100 border-0">
                        <h5 className="fw-bold text-success mb-4 text-uppercase border-bottom pb-2">Registrar Alimento</h5>
                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">Nombre del Alimento</label>
                            <input className="form-control bg-light border-0" value={foodEntry.food} onChange={e => setFoodEntry({...foodEntry, food: e.target.value})} required />
                        </div>
                        <div className="row g-2 mb-3">
                            <div className="col-6 text-start">
                                <label className="small fw-bold text-muted">Kcal</label>
                                <input type="number" className="form-control bg-light border-0" value={foodEntry.calories} onChange={e => setFoodEntry({...foodEntry, calories: e.target.value})} required />
                            </div>
                            <div className="col-6 text-start">
                                <label className="small fw-bold text-muted">Proteína (g)</label>
                                <input type="number" className="form-control bg-light border-0" value={foodEntry.protein} onChange={e => setFoodEntry({...foodEntry, protein: e.target.value})} />
                            </div>
                        </div>
                        <div className="row g-2 mb-3">
                            <div className="col-6 text-start">
                                <label className="small fw-bold text-muted">Carbs (g)</label>
                                <input type="number" className="form-control bg-light border-0" value={foodEntry.carbs} onChange={e => setFoodEntry({...foodEntry, carbs: e.target.value})} />
                            </div>
                            <div className="col-6 text-start">
                                <label className="small fw-bold text-muted">Grasas (g)</label>
                                <input type="number" className="form-control bg-light border-0" value={foodEntry.fat} onChange={e => setFoodEntry({...foodEntry, fat: e.target.value})} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="small fw-bold text-muted text-uppercase">Momento del día</label>
                            <select className="form-select bg-light border-0" value={foodEntry.category} onChange={e => setFoodEntry({...foodEntry, category: e.target.value})}>
                                <option value="Desayuno">Desayuno</option>
                                <option value="Almuerzo">Almuerzo</option>
                                <option value="Cena">Cena</option>
                                <option value="Merienda">Merienda / Snack</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm text-uppercase">Registrar Consumo</button>
                    </form>
                </div>

                <div className="col-md-7">
                    <div className="card shadow-sm border-0 p-4 bg-white mb-4">
                        <h5 className="fw-bold text-muted mb-4 text-uppercase border-bottom pb-2">Progreso de Nutrientes</h5>
                        <div className="d-flex justify-content-around flex-wrap py-2">
                            <ProgressCircle current={totals.calories} total={limits.calories} color="#FFB800" label="Calorías" unit="" />
                            <ProgressCircle current={totals.protein} total={limits.protein} color="#00A3FF" label="Proteínas" unit="g" />
                            <ProgressCircle current={totals.fat} total={limits.fat} color="#FF4D4D" label="Grasas" unit="g" />
                            <ProgressCircle current={totals.carbs} total={limits.carbs} color="#27AE60" label="Carbohidratos" unit="g" />
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 p-4 bg-white">
                        <h5 className="fw-bold text-muted mb-3 text-uppercase border-bottom pb-2">Comidas de Hoy</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small">
                                        <th>ALIMENTO</th>
                                        <th>MOMENTO</th>
                                        <th className="text-center">KCAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodList.map((item, index) => (
                                        <tr key={index} className="small">
                                            <td className="fw-bold text-secondary">{item.food}</td>
                                            <td><span className="badge bg-light text-dark border">{item.category}</span></td>
                                            <td className="text-center fw-bold text-success">{item.calories}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};