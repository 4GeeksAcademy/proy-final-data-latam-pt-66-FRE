import React, { useState, useEffect } from "react";

export const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ water: 0, calories: 0, meals: 0, fasting: "" });
    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const calculateSummary = (data) => {
        let totalWater = 0;
        let totalCalories = 0;
        let totalMeals = 0;
        let totalFastingSeconds = 0;

        data.forEach(item => {
            if (item.category === "Hidratación") totalWater += (item.water || 0);
            if (item.category === "Comida") {
                totalCalories += (item.calories || 0);
                totalMeals += 1;
            }
            if (item.category === "Ayuno" && item.duration) {
                // Extraemos horas, minutos y segundos del string "Xh Xm Xs"
                const parts = item.duration.match(/\d+/g);
                if (parts) {
                    const [h, m, s] = parts.map(Number);
                    totalFastingSeconds += (h * 3600) + (m * 60) + (s || 0);
                }
            }
        });

        const h = Math.floor(totalFastingSeconds / 3600);
        const m = Math.floor((totalFastingSeconds % 3600) / 60);

        setSummary({
            water: totalWater,
            calories: totalCalories,
            meals: totalMeals,
            fasting: `${h}h ${m}m`
        });
    };

    const loadHistory = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${backendUrl}/api/user-history`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
                calculateSummary(data); // Calculamos el resumen al cargar
            }
        } catch (error) {
            console.error("Error cargando historial", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadHistory(); }, []);

    if (loading) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <h2 className="fw-bold text-success mb-4 border-bottom pb-2">Resumen de Actividad</h2>

            {/* CUADRO RESUMEN (DASHBOARD) */}
            <div className="row g-3 mb-5">
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-primary text-white h-100 rounded-4">
                        <i className="fas fa-tint fa-2x mb-2"></i>
                        <h6 className="small text-uppercase opacity-75">Agua Total</h6>
                        <h4 className="fw-bold mb-0">{summary.water} ml</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-success text-white h-100 rounded-4">
                        <i className="fas fa-fire fa-2x mb-2"></i>
                        <h6 className="small text-uppercase opacity-75">Calorías</h6>
                        <h4 className="fw-bold mb-0">{summary.calories} kcal</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-warning text-dark h-100 rounded-4">
                        <i className="fas fa-utensils fa-2x mb-2"></i>
                        <h6 className="small text-uppercase opacity-75">Comidas</h6>
                        <h4 className="fw-bold mb-0">{summary.meals} regs</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-dark text-white h-100 rounded-4">
                        <i className="fas fa-stopwatch fa-2x mb-2"></i>
                        <h6 className="small text-uppercase opacity-75">Tiempo Ayuno</h6>
                        <h4 className="fw-bold mb-0">{summary.fasting}</h4>
                    </div>
                </div>
            </div>

            {/* TABLA DE DETALLE */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-secondary mb-0">Detalle Cronológico</h4>
                <button className="btn btn-outline-success btn-sm rounded-pill" onClick={loadHistory}>
                    <i className="fas fa-sync-alt me-2"></i>Actualizar
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        {/* ... (Aquí va el mismo <thead> y <tbody> que ya tenías) ... */}
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Fecha</th>
                                <th>Categoría</th>
                                <th>Detalle</th>
                                <th>Valor</th>
                                <th>Calorías</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td className="ps-4 text-muted small">{new Date(item.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${item.category === 'Comida' ? 'bg-success' : item.category === 'Hidratación' ? 'bg-primary' : 'bg-dark'}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="fw-bold">{item.food || "Ayuno"}</td>
                                    <td>{item.category === 'Hidratación' ? `${item.water} ml` : item.duration || "---"}</td>
                                    <td className="text-danger fw-bold">{item.calories > 0 ? `${item.calories} kcal` : "---"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};