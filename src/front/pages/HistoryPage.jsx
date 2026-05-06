import React, { useState, useEffect } from "react";

export const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ water: 0, calories: 0, meals: 0, fasting: "0h 0m" });
    
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
                calculateSummary(data);
            }
        } catch (error) {
            console.error("Error cargando historial", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        loadHistory(); 
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            {/* ENCABEZADO CON ICONO */}
            <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                <i className="fas fa-history fa-2x text-success me-3"></i>
                <h2 className="fw-bold text-success mb-0">Resumen de Actividad</h2>
            </div>

            {/* BANNER DE ESTILO DE VIDA (MEZCLA DE RECOMENDACIONES) */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ height: "180px" }}>
                        <img 
                            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80" 
                            alt="Nutrición y Bienestar" 
                            className="w-100 h-100"
                            style={{ objectFit: "cover", filter: "brightness(0.7)" }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
                            <div className="ps-4 text-white">
                                <h3 className="fw-bold mb-1">Tu Historial Saludable</h3>
                                <p className="mb-0 opacity-75">Cada pequeño paso cuenta para un gran cambio.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CUADRO RESUMEN (DASHBOARD) */}
            <div className="row g-3 mb-5">
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-primary text-white h-100 rounded-4">
                        <i className="fas fa-tint fa-2x mb-2 opacity-50"></i>
                        <h6 className="small text-uppercase opacity-75 fw-bold">Agua Total</h6>
                        <h4 className="fw-bold mb-0">{summary.water} ml</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-success text-white h-100 rounded-4">
                        <i className="fas fa-fire fa-2x mb-2 opacity-50"></i>
                        <h6 className="small text-uppercase opacity-75 fw-bold">Calorías</h6>
                        <h4 className="fw-bold mb-0">{summary.calories} kcal</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-warning text-dark h-100 rounded-4">
                        <i className="fas fa-utensils fa-2x mb-2 opacity-50"></i>
                        <h6 className="small text-uppercase opacity-75 fw-bold">Comidas</h6>
                        <h4 className="fw-bold mb-0">{summary.meals} regs</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center p-3 bg-dark text-white h-100 rounded-4">
                        <i className="fas fa-stopwatch fa-2x mb-2 opacity-50"></i>
                        <h6 className="small text-uppercase opacity-75 fw-bold">Tiempo Ayuno</h6>
                        <h4 className="fw-bold mb-0">{summary.fasting}</h4>
                    </div>
                </div>
            </div>

            {/* TABLA DE DETALLE */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-secondary mb-0">Detalle Cronológico</h4>
                <button className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm" onClick={loadHistory}>
                    <i className="fas fa-sync-alt me-2"></i>Actualizar
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-secondary">
                            <tr>
                                <th className="ps-4 py-3 small fw-bold">FECHA</th>
                                <th className="py-3 small fw-bold">CATEGORÍA</th>
                                <th className="py-3 small fw-bold">DETALLE</th>
                                <th className="py-3 small fw-bold">VALOR</th>
                                <th className="py-3 text-end pe-4 small fw-bold">CALORÍAS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((item, index) => {
                                    const rawDate = item.dates; 
                                    const formattedDate = rawDate 
                                        ? new Date(rawDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                                        : "---";

                                    return (
                                        <tr key={index}>
                                            <td className="ps-4 text-muted small">{formattedDate}</td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    item.category === 'Comida' ? 'bg-success bg-opacity-75' : 
                                                    item.category === 'Hidratación' ? 'bg-primary bg-opacity-75' : 
                                                    'bg-dark'
                                                }`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-dark">{item.food || "Ayuno / Sesión"}</td>
                                            <td className="text-muted">
                                                {item.category === 'Hidratación' ? `${item.water} ml` : (item.duration || "---")}
                                            </td>
                                            <td className="text-end pe-4 fw-bold text-danger">
                                                {item.calories > 0 ? `${item.calories} kcal` : "---"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No hay actividad registrada todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};