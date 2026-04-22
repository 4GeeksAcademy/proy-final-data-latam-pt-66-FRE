import React, { useState, useEffect } from "react";

export const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadHistory = async () => {
        try {
            // Asegúrate de tener un endpoint que devuelva todos los logs del usuario
            const res = await fetch(`${backendUrl}/api/user-history`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Error cargando el historial", error);
        }
    };

    useEffect(() => { loadHistory(); }, []);

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <h2 className="fw-bold text-success mb-4 border-bottom pb-2">Historial de Actividad</h2>
            
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Fecha</th>
                                <th>Categoría</th>
                                <th>Detalle / Alimento</th>
                                <th>Valor / Cantidad</th>
                                <th>Calorías</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((item, index) => (
                                <tr key={index}>
                                    <td className="ps-4 text-muted small">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${
                                            item.category === 'Comida' ? 'bg-success' : 
                                            item.category === 'Agua' ? 'bg-primary' : 'bg-warning text-dark'
                                        }`}>
                                            {item.category === 'Comida' ? 'Alimentación' : 
                                             item.category === 'Agua' ? 'Hidratación' : item.category}
                                        </span>
                                    </td>
                                    <td className="fw-bold">{item.food || item.detail || "---"}</td>
                                    <td>
                                        {item.water > 0 ? `${item.water} ml` : 
                                         item.weight > 0 ? `${item.weight} kg` : 
                                         item.duration ? `${item.duration}h ayuno` : "---"}
                                    </td>
                                    <td className="text-danger fw-bold">
                                        {item.calories > 0 ? `${item.calories} kcal` : "---"}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No hay registros guardados todavía.
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