import React, { useState, useEffect } from "react";

export const FastingPage = () => {
    const [fasting, setFasting] = useState(null);
    const [lastDuration, setLastDuration] = useState(null);
    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // TUS FUNCIONES ORIGINALES
    const fetchStatus = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/fasting/status`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFasting(data);
            }
        } catch (error) {
            console.error("Error al obtener status:", error);
        }
    };

    useEffect(() => {
        if (token) fetchStatus();
    }, []);

    const handleFastingAction = async (action) => {
        try {
            const res = await fetch(`${backendUrl}/api/fasting/${action}`, {
                method: action === 'start' ? "POST" : "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.ok) {
                if (action === 'stop') {
                    setLastDuration(data.duration);
                } else {
                    setLastDuration(null);
                }
                await fetchStatus();
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "850px" }}>
                <div className="row g-0">
                    {/* COLUMNA DE IMAGEN: YOGA */}
                    <div className="col-md-5 d-none d-md-block">
                        <div 
                            style={{ 
                                backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: "100%",
                                minHeight: "450px"
                            }}
                        ></div>
                    </div>

                    {/* COLUMNA DE CONTENIDO */}
                    <div className="col-md-7 p-5 text-center bg-white d-flex flex-column justify-content-center">
                        <h2 className="fw-bold mb-4" style={{ color: "#2d5a27" }}>Control de Ayuno</h2>
                        
                        {/* ICONO DE RELOJ MEJORADO */}
                        <div className="mb-4">
                            <div className="d-inline-block p-4 rounded-circle mb-3" style={{ backgroundColor: "#f1f8e9" }}>
                                <i className={`fas fa-history fa-4x ${fasting ? 'text-success animate__animated animate__pulse animate__infinite' : 'text-muted'}`}></i>
                            </div>
                        </div>

                        {fasting ? (
                            <div className="animate__animated animate__fadeIn">
                                <h4 className="text-success fw-bold mb-2">Ayuno en curso</h4>
                                <p className="text-muted small mb-4">Iniciado: {new Date(fasting.start_time).toLocaleString()}</p>
                                <button 
                                    className="btn btn-danger btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm" 
                                    onClick={() => handleFastingAction('stop')}
                                >
                                    DETENER AYUNO
                                </button>
                            </div>
                        ) : (
                            <div className="animate__animated animate__fadeIn">
                                {lastDuration && (
                                    <div className="alert alert-success border-0 rounded-4 mb-4 shadow-sm" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
                                        <i className="fas fa-trophy me-2"></i> ¡Logrado! Duración: <strong>{lastDuration}</strong>
                                    </div>
                                )}
                                <p className="text-muted mb-4 fs-5">Encuentra tu equilibrio y mejora tu metabolismo.</p>
                                <button 
                                    className="btn btn-success btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm" 
                                    onClick={() => handleFastingAction('start')}
                                >
                                    INICIAR AYUNO
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};