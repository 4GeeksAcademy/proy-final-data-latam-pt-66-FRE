import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();
    
    // Estados para datos persistentes
    const [water, setWater] = useState(0);
    const [calories, setCalories] = useState(0);
    const [stats, setStats] = useState({ 
        age: "", 
        height: "", 
        weight: "", 
        dietType: "Equilibrada" 
    });

    // Estado para el formulario de consumo diario (Postman style)
    const [foodEntry, setFoodEntry] = useState({ 
        food: "", 
        calories: "", 
        water: "" 
    });

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("user_id");
    // Asegúrate de que esta URL sea la de tu puerto 3001
    const BACKEND_URL = "https://solid-broccoli-97rj4r4r5p543rgg-3001.app.github.dev";

    // --- 1. CARGA DE DATOS (GET) ---
    const loadData = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${BACKEND_URL}/api/daily-summary`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWater(data.total_water || 0);
                setCalories(data.total_calories || 0);
                setStats({
                    age: data.age || "",
                    height: data.height || "",
                    weight: data.weight || "",
                    dietType: data.diet_type || "Equilibrada"
                });
            } else if (response.status === 401) {
                sessionStorage.clear();
                navigate("/login");
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => {
        if (!token) navigate("/login");
        else loadData();
    }, [token]);

    // --- 2. GUARDAR PERFIL (PUT) ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: parseInt(stats.age),
                    height: parseFloat(stats.height),
                    weight: parseFloat(stats.weight),
                    diet_type: stats.dietType
                })
            });

            if (response.ok) {
                alert("✅ ¡Perfil actualizado correctamente!");
                loadData(); // Recarga para ver reflejado en la barra superior
            } else {
                alert("❌ Error al guardar el perfil");
            }
        } catch (error) {
            alert("❌ Error de conexión con el servidor");
        }
    };

    // --- 3. REGISTRAR COMIDA/AGUA (POST) ---
    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/daily-log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: "Comida",
                    food: foodEntry.food,
                    calories: parseInt(foodEntry.calories || 0),
                    water: parseInt(foodEntry.water || 0)
                })
            });

            if (response.ok) {
                setFoodEntry({ food: "", calories: "", water: "" }); // Limpia formulario
                loadData(); // Actualiza totales inmediatamente
            }
        } catch (error) {
            console.error("Error al registrar comida:", error);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar Bootstrap Verde */}
            <nav className="navbar navbar-dark bg-success shadow mb-4 px-4">
                <span className="navbar-brand fw-bold">NutriFit Dashboard 🍏</span>
                <div className="text-white d-flex align-items-center">
                    <span className="me-3 small border-end pe-3 border-white border-opacity-25">ID: {userId}</span>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline-light rounded-pill">Salir</button>
                </div>
            </nav>

            <div className="container">
                {/* TARJETAS SUPERIORES (RESUMEN) */}
                <div className="row g-3 mb-4 text-center">
                    {[
                        { label: "PESO", val: stats.weight, unit: "kg" },
                        { label: "ALTURA", val: stats.height, unit: "cm" },
                        { label: "EDAD", val: stats.age, unit: "años" },
                        { label: "DIETA", val: stats.dietType, unit: "" }
                    ].map((item, i) => (
                        <div key={i} className="col-md-3 col-6">
                            <div className="card shadow-sm border-0 border-top border-success border-4 py-3 h-100">
                                <small className="text-muted fw-bold small">{item.label}</small>
                                <h3 className="fw-bold text-success mb-0">{item.val || "--"} <small className="fs-6">{item.unit}</small></h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* FORMULARIO EDITABLE (IZQUIERDA) */}
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0 p-4 h-100">
                            <h5 className="fw-bold text-success mb-3">Configuración de Perfil</h5>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="mb-2">
                                    <label className="small fw-bold">EDAD</label>
                                    <input type="number" className="form-control" value={stats.age} onChange={e => setStats({...stats, age: e.target.value})} />
                                </div>
                                <div className="mb-2">
                                    <label className="small fw-bold">ESTATURA (CM)</label>
                                    <input type="number" className="form-control" value={stats.height} onChange={e => setStats({...stats, height: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold">PESO ACTUAL (KG)</label>
                                    <input type="number" className="form-control border-success border-opacity-50" value={stats.weight} onChange={e => setStats({...stats, weight: e.target.value})} />
                                </div>
                                <div className="mb-4">
                                    <label className="small fw-bold">PLAN NUTRICIONAL</label>
                                    <select className="form-select" value={stats.dietType} onChange={e => setStats({...stats, dietType: e.target.value})}>
                                        <option value="Equilibrada">Equilibrada</option>
                                        <option value="Vegana">Vegana</option>
                                        <option value="Keto">Keto</option>
                                    </select>
                                </div>
                                <button className="btn btn-success w-100 fw-bold shadow-sm py-2 text-uppercase">Guardar Perfil</button>
                            </form>
                        </div>
                    </div>

                    {/* REGISTRO DE CONSUMO (DERECHA) */}
                    <div className="col-md-7">
                        <div className="card shadow-sm border-0 p-4 h-100">
                            <h5 className="fw-bold text-muted mb-4">Registro Diario (Comida/Agua)</h5>
                            
                            <form onSubmit={handleAddFood} className="row g-2 mb-4 p-3 bg-light rounded shadow-sm border border-success border-opacity-10">
                                <div className="col-md-5">
                                    <input type="text" className="form-control form-control-sm" placeholder="¿Qué consumiste?" value={foodEntry.food} onChange={e => setFoodEntry({...foodEntry, food: e.target.value})} required />
                                </div>
                                <div className="col-md-3">
                                    <input type="number" className="form-control form-control-sm" placeholder="Calorías" value={foodEntry.calories} onChange={e => setFoodEntry({...foodEntry, calories: e.target.value})} />
                                </div>
                                <div className="col-md-2">
                                    <input type="number" className="form-control form-control-sm" placeholder="ml agua" value={foodEntry.water} onChange={e => setFoodEntry({...foodEntry, water: e.target.value})} />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-success btn-sm w-100 fw-bold">+</button>
                                </div>
                            </form>

                            <div className="row text-center mt-auto p-4 bg-success bg-opacity-10 rounded-4">
                                <div className="col-6 border-end border-success border-opacity-25">
                                    <h1 className="fw-bold text-success display-4 mb-0">{calories}</h1>
                                    <p className="text-muted small fw-bold mb-0">CALORÍAS TOTALES</p>
                                </div>
                                <div className="col-6">
                                    <h1 className="fw-bold text-primary display-4 mb-0">{(water/1000).toFixed(2)}L</h1>
                                    <p className="text-muted small fw-bold mb-0">AGUA CONSUMIDA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};