import React, { useState, useEffect, useCallback } from "react";

export const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ water: 0, calories: 0, meals: 0, fasting: "0h 0m" });
    
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("access_token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const calculateSummary = useCallback((data) => {
        let totalWater = 0;
        let totalCalories = 0;
        let totalMeals = 0;
        let totalFastingSeconds = 0;

        data.forEach(item => {
            // Soporte dual para water o water_ml
            const waterVal = item.water_ml || item.water || 0;
            if (waterVal > 0) totalWater += waterVal;
            
            if (item.calories > 0) {
                totalCalories += item.calories;
                totalMeals += 1;
            }
            if (item.category === "Ayuno" && item.duration) {
                const parts = item.duration.match(/\d+/g);
                if (parts) {
                    const [h, m, s] = parts.map(Number);
                    totalFastingSeconds += (h * 3600) + (m * 60) + (s || 0);
                }
            }
        });

        const h = Math.floor(totalFastingSeconds / 3600);
        const m = Math.floor((totalFastingSeconds % 3600) / 60);
        setSummary({ water: totalWater, calories: totalCalories, meals: totalMeals, fasting: `${h}h ${m}m` });
    }, []);

    const loadHistory = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${backendUrl}/api/user-history`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
                calculateSummary(data);
            }
        } catch (error) {
            console.error("Error cargando historial", error);
        } finally {
            setLoading(false);
        }
    }, [token, backendUrl, calculateSummary]);

    useEffect(() => { 
        loadHistory(); 
    }, [loadHistory]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
            <div className="spinner-border text-success" role="status"></div>
        </div>
    );

    return (
        <div className="container py-4 text-start animate__animated animate__fadeIn">
            <h2 className="fw-bold text-dark mb-4 text-uppercase">Resumen de Actividad</h2>

            {/* DASHBOARD */}
            <div className="row g-3 mb-5">
                <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm p-3 text-center text-white h-100" style={{ backgroundColor: "#0d6efd", borderRadius: "15px" }}>
                        <i className="fas fa-tint mb-2 fs-3"></i>
                        <h3 className="fw-bold mb-0">{summary.water} ml</h3>
                        <small className="opacity-75 fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Agua Total</small>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm p-3 text-center text-white h-100" style={{ backgroundColor: "#198754", borderRadius: "15px" }}>
                        <i className="fas fa-fire mb-2 fs-3"></i>
                        <h3 className="fw-bold mb-0">{summary.calories} kcal</h3>
                        <small className="opacity-75 fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Calorías</small>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm p-3 text-center text-white h-100" style={{ backgroundColor: "#ffb800", borderRadius: "15px" }}>
                        <i className="fas fa-utensils mb-2 fs-3"></i>
                        <h3 className="fw-bold mb-0">{summary.meals} regs</h3>
                        <small className="opacity-75 fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Comidas</small>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm p-3 text-center text-white h-100" style={{ backgroundColor: "#212529", borderRadius: "15px" }}>
                        <i className="fas fa-stopwatch mb-2 fs-3"></i>
                        <h3 className="fw-bold mb-0">{summary.fasting}</h3>
                        <small className="opacity-75 fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Tiempo Ayuno</small>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <h5 className="fw-bold text-muted mb-0 text-uppercase">Detalle Cronológico</h5>
                <button className="btn btn-outline-success btn-sm fw-bold px-3 rounded-pill shadow-sm" onClick={loadHistory}>
                    <i className="fas fa-sync-alt me-2"></i> ACTUALIZAR
                </button>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "20px" }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small fw-bold">
                            <tr>
                                <th className="ps-4 py-3">FECHA</th>
                                <th className="py-3">CATEGORÍA</th>
                                <th className="py-3">DETALLE / COMIDA</th>
                                <th className="py-3 text-center">MACROS</th>
                                <th className="pe-4 py-3 text-end">VALOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, idx) => {
                                // Detectamos el valor del agua y si es comida
                                const waterAmount = item.water_ml || item.water || 0;
                                const isWater = waterAmount > 0;
                                const isFood = item.calories > 0;
                                const isFast = item.category === "Ayuno";

                                return (
                                    <tr key={idx} className="border-bottom">
                                        <td className="ps-4 py-3 text-secondary small">
                                            {item.dates ? new Date(item.dates).toLocaleDateString() : "---"}
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                isWater ? 'bg-primary-subtle text-primary' : 
                                                isFast ? 'bg-dark-subtle text-dark' : 'bg-success-subtle text-success'
                                            }`} style={{ fontSize: '0.7rem', fontWeight: '800' }}>
                                                {isWater ? "HIDRATACIÓN" : (isFast ? "AYUNO" : item.meal_category || "COMIDA")}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="fw-bold text-capitalize" style={{ color: "#2c3e50" }}>
                                                {isWater ? "Consumo de Agua" : 
                                                 isFast ? "Sesión de Ayuno" :
                                                 (item.food_name || item.food || item.meal_category || "Comida")}
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            {isFood ? (
                                                <div className="d-flex justify-content-center gap-1">
                                                    <span className="badge rounded-pill bg-light text-primary border border-primary-subtle" style={{fontSize: '0.65rem'}}>P: {item.protein}g</span>
                                                    <span className="badge rounded-pill bg-light text-success border border-success-subtle" style={{fontSize: '0.65rem'}}>C: {item.carbs}g</span>
                                                    <span className="badge rounded-pill bg-light text-danger border border-danger-subtle" style={{fontSize: '0.65rem'}}>G: {item.fat}g</span>
                                                </div>
                                            ) : <span className="text-muted small">---</span>}
                                        </td>
                                        <td className="pe-4 py-3 text-end">
                                            <span className={`fw-bold h5 mb-0 ${isFood ? 'text-success' : (isWater ? 'text-primary' : 'text-dark')}`}>
                                                {isWater ? `${waterAmount}ml` : (isFast ? item.duration : `${item.calories} kcal`)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};