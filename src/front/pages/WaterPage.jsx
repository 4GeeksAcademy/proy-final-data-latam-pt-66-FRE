import React, { useState, useEffect, useCallback } from "react";

export const WaterPage = () => {
    const [totalWater, setTotalWater] = useState(0);
    const [sessionWater, setSessionWater] = useState(0); 
    const [recommendedWater, setRecommendedWater] = useState(2520);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("access_token");

    // 1. Cargar datos sumando los mililitros de los registros diarios
    const loadData = useCallback(async () => {
        if (!token) return;
        try {
            // Consultamos la ruta de logs diarios donde confirmamos que reside la info
            const resLogs = await fetch(`${backendUrl}/api/daily-log`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (resLogs.ok) {
                const logs = await resLogs.json();
                // Sumamos todos los valores de 'water' de los registros de hoy
                const sumaTotal = logs.reduce((acc, item) => acc + (item.water || 0), 0);
                setTotalWater(sumaTotal);
            }

            // Calculamos el agua recomendada basándonos en tu peso del perfil
            const resProfile = await fetch(`${backendUrl}/api/user-profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resProfile.ok) {
                const profile = await resProfile.json();
                if (profile.weight) {
                    // Fórmula estándar: 35ml por cada kg de peso
                    setRecommendedWater(Math.round(profile.weight * 35));
                }
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    }, [token, backendUrl]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // 2. Guardar nuevo consumo de agua
    const handleSaveWater = async () => {
        if (sessionWater <= 0) return;
        
        try {
            const res = await fetch(`${backendUrl}/api/daily-log`, { // Usamos la ruta principal de logs
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // Enviamos los datos necesarios para que el backend cree el registro
                body: JSON.stringify({ 
                    "food": "Consumo de Agua",
                    "category": "Hidratación",
                    "water": sessionWater,
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fat": 0
                })
            });

            if (res.ok) {
                // Actualizamos la suma total inmediatamente
                await loadData(); 
                setSessionWater(0); // Reiniciamos el contador de la sesión actual
            } else {
                const errorData = await res.json();
                alert(`❌ Error: ${errorData.msg || "No se pudo guardar"}`);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    // Cálculos de porcentaje para las barras de progreso
    const totalPercentage = Math.min((totalWater / recommendedWater) * 100, 100);
    const sessionPercentage = Math.min((sessionWater / recommendedWater) * 100, 100);

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-success p-4 text-white text-center">
                            <h3 className="fw-bold mb-0">Seguimiento de Hidratación</h3>
                            <p className="small mb-0 opacity-75 fw-bold text-uppercase">Meta Diaria: {recommendedWater}ml</p>
                        </div>
                        
                        <div className="card-body p-4 p-md-5">
                            <div className="border rounded-4 p-4 bg-light mb-4 shadow-sm">
                                <div className="row text-center mb-4">
                                    <div className="col-6 border-end">
                                        <h6 className="text-muted small fw-bold mb-1">CONSUMO HOY</h6>
                                        <div className="h2 fw-bold text-success mb-0">{totalWater}ml</div>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="text-muted small fw-bold mb-1">RESTANTE</h6>
                                        <div className="h2 fw-bold text-dark mb-0">
                                            {Math.max(recommendedWater - totalWater, 0)}ml
                                        </div>
                                    </div>
                                </div>

                                <hr className="text-muted opacity-25" />

                                {/* Barra de Progreso Total */}
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                                        <span>Progreso Total</span>
                                        <span>{Math.round(totalPercentage)}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "12px", borderRadius: "50px" }}>
                                        <div 
                                            className="progress-bar progress-bar-striped bg-success" 
                                            style={{ width: `${totalPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Barra de Progreso de la Selección Actual */}
                                <div className="mb-0">
                                    <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                                        <span>Añadir ahora</span>
                                        <span className="text-info">+{sessionWater}ml</span>
                                    </div>
                                    <div className="progress" style={{ height: "12px", borderRadius: "50px", backgroundColor: "#dee2e6" }}>
                                        <div 
                                            className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                                            style={{ width: `${sessionPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 text-center">
                                <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Selecciona cantidad</h6>
                                <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                                    <button onClick={() => setSessionWater(prev => prev + 250)} className="btn btn-outline-success rounded-pill px-4 fw-bold">+250ml</button>
                                    <button onClick={() => setSessionWater(prev => prev + 500)} className="btn btn-outline-success rounded-pill px-4 fw-bold">+500ml</button>
                                    <button onClick={() => setSessionWater(0)} className="btn btn-sm text-danger text-decoration-none fw-bold ms-2">Reset</button>
                                </div>

                                <button 
                                    disabled={sessionWater <= 0}
                                    onClick={handleSaveWater} 
                                    className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow py-3"
                                >
                                    <i className="fas fa-tint me-2"></i>
                                    GUARDAR {sessionWater}ml
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};