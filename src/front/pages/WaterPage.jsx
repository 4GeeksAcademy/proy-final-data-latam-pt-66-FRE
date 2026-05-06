import React, { useState, useEffect } from "react";

export const WaterPage = () => {
    const [totalWater, setTotalWater] = useState(0);
    const [sessionWater, setSessionWater] = useState(0);
    const [recommendedWater, setRecommendedWater] = useState(2520);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = sessionStorage.getItem("token");

    const loadData = async () => {
        if (!token) return;
        try {
            const resSummary = await fetch(`${backendUrl}/api/daily-summary`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resSummary.ok) {
                const data = await resSummary.json();
                setTotalWater(data.total_water || 0);
            }
            const resProfile = await fetch(`${backendUrl}/api/user-profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resProfile.ok) {
                const profile = await resProfile.json();
                if (profile.weight) {
                    setRecommendedWater(Math.round(profile.weight * 35));
                }
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    const handleSaveWater = async () => {
        if (sessionWater <= 0) return;
        try {
            const res = await fetch(`${backendUrl}/api/daily-log/water`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "water": sessionWater })
            });
            if (res.ok) {
                await loadData();
                setSessionWater(0);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const totalPercentage = Math.min((totalWater / recommendedWater) * 100, 100);
    const sessionPercentage = Math.min((sessionWater / recommendedWater) * 100, 100);

    // Renderizado del SVG de la botella personalizada
    const WaterBottleSVG = ({ percentage }) => (
        <svg width="80" height="120" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="bottleClip">
                    <path d="M30,15 L70,15 L70,30 L85,45 L85,135 Q85,145 75,145 L25,145 Q15,145 15,135 L15,45 L30,30 Z" />
                </clipPath>
            </defs>
            {/* Fondo de la botella (vacía) */}
            <path d="M30,15 L70,15 L70,30 L85,45 L85,135 Q85,145 75,145 L25,145 Q15,145 15,135 L15,45 L30,30 Z" 
                  fill="#f8f9fa" stroke="#198754" strokeWidth="3" />
            
            {/* Líquido (se llena de abajo hacia arriba) */}
            <rect x="0" y={145 - (percentage * 1.3)} width="100" height="150" 
                  fill="#0dcaf0" clipPath="url(#bottleClip)" style={{ transition: "y 0.5s ease-in-out" }} />
            
            {/* Brillo de la botella */}
            <path d="M25,50 L25,130" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        </svg>
    );

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="bg-success p-4 text-white text-center">
                            <h3 className="fw-bold mb-0">Seguimiento de Hidratación</h3>
                            <p className="small mb-0 opacity-75 fw-bold">ONU/OMS: 35ML POR KG DE PESO</p>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <div className="border rounded-4 p-4 bg-light mb-4 shadow-sm">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-4 d-none d-sm-block text-center">
                                        <WaterBottleSVG percentage={totalPercentage} />
                                        <div className="mt-2 fw-bold text-success small">{Math.round(totalPercentage)}%</div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="row text-center text-sm-start">
                                            <div className="col-6 border-end">
                                                <h6 className="text-muted small fw-bold mb-1">CONSUMO HOY</h6>
                                                <div className="h2 fw-bold text-success mb-0">{totalWater}ml</div>
                                            </div>
                                            <div className="col-6 ps-md-4">
                                                <h6 className="text-muted small fw-bold mb-1">RECOMENDADO</h6>
                                                <div className="h2 fw-bold text-dark mb-0">{recommendedWater}ml</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="text-muted opacity-25" />

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                                        <span>Progreso Total Acumulado</span>
                                        <span>{Math.round(totalPercentage)}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "12px", borderRadius: "50px" }}>
                                        <div className="progress-bar bg-success" style={{ width: `${totalPercentage}%` }}></div>
                                    </div>
                                </div>

                                <div className="mb-0">
                                    <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                                        <span>Nueva entrada actual</span>
                                        <span className="text-info">+{Math.round(sessionPercentage)}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "12px", borderRadius: "50px", backgroundColor: "#dee2e6" }}>
                                        <div className="progress-bar bg-info" style={{ width: `${sessionPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 text-center">
                                <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Añadir Mililitros</h6>
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
                                    GUARDAR CONSUMO ({sessionWater}ml)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};