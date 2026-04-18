import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx"; 
import { GoalSelector } from "../components/GoalSelector.jsx";

export const Home = () => {
    const { store, actions } = useApp();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [logs, setLogs] = useState([]);

    // 1. Cargar el historial desde el servidor
    const fetchLogs = async () => {
        const token = localStorage.getItem("token");
        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/daily-log`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Error cargando historial:", error);
        }
    };

    // 2. FUNCIÓN PARA GUARDAR (Botón ahora en verde)
    const handleSaveEntry = async () => {
        const token = localStorage.getItem("token");
        
        // Protección con ?. para evitar el error de "undefined user"
        const entryData = {
            weight: parseFloat(store?.user?.weight),
            height: parseFloat(store?.user?.height),
            diet_type: store?.goal || "No definida",
            date: new Date().toISOString().split('T')[0]
        };

        if (!entryData.weight || !entryData.height) {
            alert("Raymon, ingresa peso y altura antes de guardar.");
            return;
        }

        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/daily-log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(entryData)
            });

            if (resp.ok) {
                alert("¡Registro guardado correctamente!");
                await fetchLogs(); // Refresca la tabla automáticamente
                setShowForm(false); // Cierra el formulario
            } else {
                alert("Error al guardar. Verifica el backend.");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            fetchLogs();
        }
    }, []);

    const latest = logs[0] || {};

    return (
        <div className="container mt-4 pb-5">
            {/* PANEL PRINCIPAL */}
            <div className="card shadow border-0 mb-4" style={{ backgroundColor: "#A1C9A1", borderRadius: "25px" }}>
                <div className="card-body p-4 text-center text-md-start">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <div className="mx-auto d-flex flex-column align-items-center justify-content-center bg-white shadow-sm"
                                style={{ width: "130px", height: "130px", border: "6px solid #2E7D32", borderRadius: "50%" }}>
                                <small className="fw-bold text-success">META</small>
                                <span className="fw-bold text-dark">{latest.diet_type || "---"}</span>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <h2 className="fw-bold text-success">Panel de NUTRIFIT</h2>
                            <p className="text-dark">Peso: <strong>{latest.weight || "--"} kg</strong> | Altura: <strong>{latest.height || "--"} cm</strong></p>
                            <button className="btn btn-success fw-bold px-4" onClick={() => setShowForm(!showForm)}>
                                {showForm ? "✕ Cancelar" : "+ Actualizar Progreso"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FORMULARIO ACTUALIZADO */}
            {showForm && (
                <div className="card p-4 shadow-sm border-0 mb-4 animate__animated animate__fadeIn" style={{ borderRadius: "20px" }}>
                    <div className="row g-4 text-start">
                        <div className="col-md-6">
                            <h5 className="fw-bold text-success mb-3">Tus Medidas</h5>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Peso (kg)</label>
                                <input 
                                    type="number" 
                                    className="form-control shadow-sm" 
                                    value={store?.user?.weight || ""} 
                                    onChange={(e) => actions.updateUser({ weight: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Altura (cm)</label>
                                <input 
                                    type="number" 
                                    className="form-control shadow-sm" 
                                    value={store?.user?.height || ""} 
                                    onChange={(e) => actions.updateUser({ height: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="fw-bold text-success mb-3">Tu Objetivo</h5>
                            <GoalSelector />
                        </div>
                    </div>

                    {/* EL BOTÓN AHORA ES VERDE (btn-success) */}
                    <div className="text-center mt-4">
                        <button className="btn btn-success btn-lg fw-bold px-5 shadow" onClick={handleSaveEntry} style={{ borderRadius: "15px" }}>
                            <i className="fas fa-save me-2"></i> GUARDAR REGISTRO
                        </button>
                    </div>
                </div>
            )}

            {/* TABLA DE HISTORIAL */}
            <h5 className="text-success fw-bold mb-3">HISTORIAL DE PROGRESO</h5>
            <div className="table-responsive rounded-4 shadow-sm border bg-white">
                <table className="table table-hover text-center align-middle mb-0">
                    <thead style={{ backgroundColor: "#2E7D32", color: "white" }}>
                        <tr>
                            <th className="py-3">FECHA</th>
                            <th>PESO</th>
                            <th>ALTURA</th>
                            <th>META</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td className="small text-muted">{log.date}</td>
                                <td className="fw-bold text-primary">{log.weight} kg</td>
                                <td>{log.height} cm</td>
                                <td><span className="badge bg-light text-success border border-success">{log.diet_type}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};