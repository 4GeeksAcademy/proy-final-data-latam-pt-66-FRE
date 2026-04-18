import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export const Calculator = () => {
    const { store } = useApp();
    const [result, setResult] = useState(null);

    const runCalculation = () => {
        const w = parseFloat(store?.user?.weight);
        const h = parseFloat(store?.user?.height);
        // Usamos 25 como edad base si no existe en el store
        const age = 25; 

        if (!w || !h) {
            alert("Raymon, primero registra tu peso y altura en el Inicio.");
            return;
        }

        // Fórmula de Harris-Benedict revisada
        let tmb = (10 * w) + (6.25 * h) - (5 * age) + 5;
        
        // Ajuste por objetivo
        const goal = store?.goal?.toLowerCase() || "";
        if (goal.includes("perder")) tmb -= 500;
        if (goal.includes("ganar")) tmb += 500;

        setResult(Math.round(tmb));
    };

    return (
        <div className="container mt-5 text-center">
            <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "600px", borderRadius: "25px", backgroundColor: "#f8f9fa" }}>
                <div className="card-body p-5">
                    <h2 className="fw-bold text-success mb-4">Calculadora de Calorías</h2>
                    <p className="text-muted mb-4">Calculamos tu requerimiento diario basado en tu último registro:</p>
                    
                    <div className="d-flex justify-content-around mb-4">
                        <div className="p-3 bg-white rounded shadow-sm">
                            <small className="d-block text-success fw-bold">PESO</small>
                            <span className="fs-4">{store?.user?.weight || "--"} kg</span>
                        </div>
                        <div className="p-3 bg-white rounded shadow-sm">
                            <small className="d-block text-success fw-bold">ALTURA</small>
                            <span className="fs-4">{store?.user?.height || "--"} cm</span>
                        </div>
                    </div>

                    {result && (
                        <div className="alert alert-success py-4 mb-4" style={{ borderRadius: "15px" }}>
                            <h4 className="mb-0">Tu objetivo diario:</h4>
                            <span className="display-4 fw-bold">{result}</span>
                            <span className="ms-2 fs-5">kcal</span>
                        </div>
                    )}

                    <button className="btn btn-success btn-lg w-100 fw-bold shadow" onClick={runCalculation} style={{ borderRadius: "15px" }}>
                        <i className="fas fa-calculator me-2"></i> CALCULAR AHORA
                    </button>
                </div>
            </div>
        </div>
    );
};