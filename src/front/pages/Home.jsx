import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({
        weight: "", height: "", age: "",
        diet_type: "Dieta Balanceada",
        calories: "", protein: "", carbs: "", fat: ""
    });

    const foodDatabase = {
        "Aumentar Masa Muscular": [
            { tiempo: "Desayuno", nombre: "Omelet Proteico", kcal: 450, p: 35, c: 10, g: 25 },
            { tiempo: "Almuerzo", nombre: "Pollo y Arroz", kcal: 650, p: 52, c: 45, g: 12 }
        ],
        "Adelgazar": [
            { tiempo: "Desayuno", nombre: "Yogur Griego", kcal: 180, p: 18, c: 12, g: 2 },
            { tiempo: "Almuerzo", nombre: "Ensalada Atún", kcal: 320, p: 30, c: 8, g: 12 }
        ],
        "Dieta Balanceada": [
            { tiempo: "Cena", nombre: "Crema Calabacín", kcal: 250, p: 12, c: 20, g: 8 }
        ]
    };

    const fetchLogs = async () => {
        const token = localStorage.getItem("token");
        try {
            const resp = await fetch(process.env.BACKEND_URL + "/api/daily-log", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (resp.ok) {
                const data = await resp.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Error cargando historial:", error);
        }
    };

    const seleccionarPlato = (plato) => {
        setFormData({
            ...formData,
            calories: plato.kcal,
            protein: plato.p,
            carbs: plato.c,
            fat: plato.g
        });
        setShowForm(true);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const resp = await fetch(process.env.BACKEND_URL + "/api/daily-log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    weight: parseFloat(formData.weight),
                    height: parseFloat(formData.height),
                    age: parseInt(formData.age),
                    diet_type: formData.diet_type,
                    calories: parseInt(formData.calories) || 0,
                    protein: parseInt(formData.protein) || 0,
                    carbs: parseInt(formData.carbs) || 0,
                    fat: parseInt(formData.fat) || 0,
                    date: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD para la DB
                })
            });

            if (resp.ok) {
                await fetchLogs();
                setShowForm(false);
                alert("¡Progreso de Raymon guardado con éxito!");
            } else {
                const errorData = await resp.json();
                alert("Error: " + (errorData.msg || "Verifica los datos enviados"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión. Asegúrate de que el puerto 3001 sea PÚBLICO.");
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
            {/* PANEL DE CONTROL */}
            <div className="card shadow border-0 mb-4" style={{ backgroundColor: "#A1C9A1" }}>
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <div className="mx-auto d-flex flex-column align-items-center justify-content-center bg-white shadow-sm"
                                style={{ width: "140px", height: "140px", border: "8px solid #2E7D32", borderRadius: "50%" }}>
                                <small className="fw-bold text-success">OBJETIVO</small>
                                <div className="fw-bold px-2 text-center" style={{ fontSize: "0.8rem" }}>
                                    {latest.diet_type || "No definida"}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 ps-4 border-start border-white border-opacity-50">
                            <h4 className="fw-bold text-success">Panel de NutriUNET</h4>
                            <p className="mb-3">Peso: <strong>{latest.weight || "--"} kg</strong> | Altura: <strong>{latest.height || "--"} cm</strong></p>
                            <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => setShowForm(!showForm)}>
                                {showForm ? "✕ Cancelar" : "+ Añadir Registro Hoy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FORMULARIO */}
            {showForm && (
                <div className="card shadow border-0 mb-5 p-4 bg-light">
                    <h5 className="text-success fw-bold border-bottom pb-2 mb-4">Ingresa tus datos del día</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Meta Actual</label>
                            <select className="form-select shadow-sm" value={formData.diet_type} onChange={e => setFormData({ ...formData, diet_type: e.target.value })}>
                                <option value="Dieta Balanceada">Dieta Balanceada</option>
                                <option value="Aumentar Masa Muscular">Aumentar Masa Muscular</option>
                                <option value="Adelgazar">Adelgazar</option>
                            </select>
                        </div>
                        <div className="col-md-3"><label className="small fw-bold">Peso (kg)</label><input type="number" step="0.1" className="form-control" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Altura (cm)</label><input type="number" step="0.1" className="form-control" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Edad</label><input type="number" className="form-control" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required /></div>

                        <div className="col-md-3 mt-4"><label className="small text-primary fw-bold">Calorías Totales</label><input type="number" className="form-control border-primary" value={formData.calories} onChange={e => setFormData({ ...formData, calories: e.target.value })} /></div>
                        <div className="col-md-3 mt-4"><label className="small">Proteína (g)</label><input type="number" className="form-control" value={formData.protein} onChange={e => setFormData({ ...formData, protein: e.target.value })} /></div>
                        <div className="col-md-3 mt-4"><label className="small">Carbohidratos (g)</label><input type="number" className="form-control" value={formData.carbs} onChange={e => setFormData({ ...formData, carbs: e.target.value })} /></div>
                        <div className="col-md-3 mt-4"><label className="small">Grasas (g)</label><input type="number" className="form-control" value={formData.fat} onChange={e => setFormData({ ...formData, fat: e.target.value })} /></div>

                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-primary fw-bold px-5 py-2 shadow">GUARDAR REGISTRO</button>
                        </div>
                    </form>
                </div>
            )}

            {/* RECOMENDACIONES */}
            <h5 className="text-success fw-bold mb-3">Sugerencias para {formData.diet_type}</h5>
            <div className="row g-3 mb-5">
                {(foodDatabase[formData.diet_type] || foodDatabase["Dieta Balanceada"]).map((plato, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="card h-100 border-0 shadow-sm p-3" style={{ backgroundColor: "#F0F7F0" }}>
                            <span className="badge bg-success mb-2 w-fit" style={{ width: "fit-content" }}>{plato.tiempo}</span>
                            <h6 className="fw-bold">{plato.nombre}</h6>
                            <p className="text-muted small mb-2">{plato.kcal} kcal | P:{plato.p}g C:{plato.c}g G:{plato.g}g</p>
                            <button className="btn btn-sm btn-outline-success fw-bold" onClick={() => seleccionarPlato(plato)}>Usar estos macros</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABLA DE HISTORIAL */}
            <h5 className="text-success fw-bold mb-3">HISTORIAL DE PROGRESO</h5>
            <div className="table-responsive rounded shadow-sm border">
                <table className="table table-hover text-center align-middle mb-0">
                    <thead style={{ backgroundColor: "#2E7D32", color: "white" }}>
                        <tr>
                            <th>FECHA</th>
                            <th>PESO</th>
                            <th>EDAD / ALT</th>
                            <th>CALORÍAS</th>
                            <th>MACROS (P/C/G)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map((log, index) => (
                            <tr key={index}>
                                <td className="small text-muted">{log.date}</td>
                                <td className="fw-bold text-primary">{log.weight} kg</td>
                                <td className="small">{log.age} añ / {log.height} cm</td>
                                <td className="text-success fw-bold">{log.calories} kcal</td>
                                <td className="small text-secondary">{log.protein}g / {log.carbs}g / {log.fat}g</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="py-4 text-muted">No hay registros aún.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
