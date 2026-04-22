import React, { useState, useEffect } from "react";

export const FastingPage = () => {
    const [fasting, setFasting] = useState(null);
    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const checkFasting = async () => {
        const res = await fetch(`${backendUrl}/api/fasting/status`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setFasting(await res.json());
    };

    useEffect(() => { checkFasting(); }, []);

    const toggleFasting = async (action) => {
        const res = await fetch(`${backendUrl}/api/fasting/${action}`, {
            method: action === 'start' ? "POST" : "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) checkFasting();
    };

    return (
        <div className="container mt-5 text-center">
            <div className="card shadow border-0 p-5 mx-auto" style={{maxWidth: "500px"}}>
                <h2 className="fw-bold mb-4">Control de Ayuno</h2>
                <div className="mb-4"><i className={`fas fa-stopwatch fa-5x ${fasting ? 'text-success' : 'text-muted'}`}></i></div>
                {fasting ? (
                    <div>
                        <h4 className="text-success fw-bold">Ayuno en curso</h4>
                        <p>Iniciado: {new Date(fasting.start_time).toLocaleTimeString()}</p>
                        <button className="btn btn-danger btn-lg w-100 rounded-pill" onClick={() => toggleFasting('stop')}>DETENER AYUNO</button>
                    </div>
                ) : (
                    <button className="btn btn-success btn-lg w-100 rounded-pill" onClick={() => toggleFasting('start')}>INICIAR AYUNO</button>
                )}
            </div>
        </div>
    );
};