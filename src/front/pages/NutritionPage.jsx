import React, { useState, useEffect, useRef } from "react";

export const NutritionPage = () => {
    const [calories, setCalories] = useState(0);

    const formRef = useRef(null);
    const inputRef = useRef(null);

    // MACRONUTRIENTES
    const [macros, setMacros] = useState({
        protein: 0,
        carbs: 0,
        fat: 0
    });
    const [dietType, setDietType] = useState("Equilibrada");
    const [foodEntry, setFoodEntry] = useState({
        food: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        category: "Desayuno"
    });
    const [foodList, setFoodList] = useState([]);
    const [plan, setPlan] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    // RECOMENDACIONES SET INTERVAL
    const [currentRecIndex, setCurrentRecIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadNutritionData = async () => {
        const res = await fetch(`${backendUrl}/api/daily-summary`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setCalories(data.total_calories || 0);
            setDietType(data.diet_type || "Equilibrada");
            // MACRONUTRIENTES
            setMacros({
                protein: data.protein || 0,
                carbs: data.carbs || 0,
                fat: data.fat || 0
            });
        }
    };

    const loadPlan = async () => {
        const res = await fetch(`${backendUrl}/api/nutrition-plan`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setPlan(data);
    };

    const loadRecommendations = async () => {
        const res = await fetch(`${backendUrl}/api/ai-recommendations`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setRecommendations(data.recommendations);
    };

    const loadFoodList = async () => {
        const res = await fetch(`${backendUrl}/api/daily-log`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            const data = await res.json();
            setFoodList(data);
        }
    };

    useEffect(() => {
        if (!token) return;

        loadNutritionData();
        loadPlan();
        loadRecommendations();
        loadFoodList();
    }, [token]);


    // RECOMENDATIONS SET INTERVAL
    useEffect(() => {
        if (!recommendations.length) return;

        // Mostrar modal cuando llegan recomendaciones
        setShowModal(true);

        const interval = setInterval(() => {
            setCurrentRecIndex(prev =>
                (prev + 1) % recommendations.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [recommendations]);

    const handleAddFood = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${backendUrl}/api/daily-log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: foodEntry.category,
                    food: foodEntry.food,
                    calories: Number(foodEntry.calories || 0),

                    // MACRONUTRIENTES
                    protein: Number(foodEntry.protein || 0),
                    carbs: Number(foodEntry.carbs || 0),
                    fat: Number(foodEntry.fat || 0),

                    water: 0
                })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.msg || "Error");
                return;
            }

            const newItem = data.log || data;

            setFoodList(prev => [...prev, newItem]);

            setFoodEntry({
                food: "",
                calories: "",
                // MACRONUTRIENTES
                protein: "",
                carbs: "",
                fat: "",

                category: "Desayuno"
            });

            await loadFoodList();
            await loadNutritionData();
            await loadRecommendations();

        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    const [editingId, setEditingId] = useState(null);

    const handleEdit = (item) => {
        setEditingId(item.id);

        setFoodEntry({
            food: item.food,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            category: item.category
        });

        // 🚀 SCROLL AUTOMÁTICO AL FORM

        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            inputRef.current?.focus(); // auto focus
        }, 100);
    };

    const handleUpdateFood = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${backendUrl}/api/daily-log/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    food: foodEntry.food,
                    calories: Number(foodEntry.calories),
                    protein: Number(foodEntry.protein),
                    carbs: Number(foodEntry.carbs),
                    fat: Number(foodEntry.fat),
                    category: foodEntry.category
                })
            });

            if (!res.ok) return;

            setEditingId(null);

            setFoodEntry({
                food: "",
                calories: "",
                protein: "",
                carbs: "",
                fat: "",
                category: "Desayuno"
            });

            await loadFoodList();
            await loadNutritionData();

        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFood = async (id) => {

        const confirmDelete = window.confirm("¿Seguro que quieres eliminar este alimento?");

        if (!confirmDelete) return;

        try {
            const res = await fetch(`${backendUrl}/api/daily-log/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) return;

            setFoodList(prev => prev.filter(f => f.id !== id));

            await loadNutritionData();

        } catch (err) {
            console.error(err);
        }
    };

    const progress = plan?.calories ? (calories / plan?.calories) * 100 : 0;
    const remaining = plan?.calories ? plan?.calories - calories : 0;

    const CircularProgress = ({ value, max, label }) => {
        const radius = 45;
        const stroke = 8;
        const normalizedRadius = radius - stroke * 0.5;
        const circumference = normalizedRadius * 2 * Math.PI;

        const percentage = max ? (value / max) * 100 : 0;
        const strokeDashoffset =
            circumference - (Math.min(percentage, 100) / 100) * circumference;

        return (
            <div className="text-center">
                <svg height={radius * 2} width={radius * 2}>
                    {/* Fondo */}
                    <circle
                        stroke="#e9ecef"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />

                    {/* Progreso */}
                    <circle
                        stroke={
                            percentage < 70
                                ? "#ffc107"
                                : percentage <= 100
                                    ? "#28a745"
                                    : "#dc3545"
                        }
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{
                            strokeDashoffset,
                            transition: "stroke-dashoffset 0.6s ease"
                        }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />

                    {/* TEXTO CENTRAL */}
                    <text
                        x="50%"
                        y="50%"
                        dy="0.3em"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                    >
                        {Math.round(percentage)}%
                    </text>
                </svg>

                <div className="small mt-2 fw-bold">
                    {label}
                </div>

                <div className="small text-muted">
                    {value}g / {max}g
                </div>
            </div>
        );
    };



    return (
        <div className="container py-4">

            {/* HEADER RESUMEN */}
            <div className="card shadow border-0 p-4 mb-4 bg-success text-white text-center">
                <h4 className="fw-bold">TU DÍA NUTRICIONAL</h4>
                <h1 className="display-4 fw-bold mb-0">{calories} kcal</h1>
                <h5>Consumidas hoy</h5>
                <div className="mt-2">
                    <span className="badge bg-light text-success fs-5 px-4 py-1 rounded-pill">
                        {dietType}
                    </span>
                </div>
            </div>

            {/* PLAN + PROGRESO */}
            {plan && (
                <div className="card shadow border-0 p-4 mb-4">

                    <h5 className="fw-bold text-success mb-4 text-center">
                        PLAN PERSONALIZADO
                    </h5>

                    <div className="row text-center mb-4">
                        <div className="col">
                            <h4>{plan?.calories}</h4>
                            <small>Kcal</small>
                        </div>
                        <div className="col">
                            <h4>{plan?.protein}g</h4>
                            <small>Proteína</small>
                        </div>
                        <div className="col">
                            <h4>{plan?.carbs}g</h4>
                            <small>Carbs</small>
                        </div>
                        <div className="col">
                            <h4>{plan?.fat}g</h4>
                            <small>Grasas</small>
                        </div>
                    </div>

                </div>
            )}

            {/* FORM + RESUMEN */}
            <div className="row g-4">

                {/* FORM */}
                <div className="col-md-5" ref={formRef}>
                    <div className="card shadow border-0 p-4 h-100">
                        <h5 className="fw-bold text-success mb-3">
                            {editingId ? "Editar alimento" : "Registrar comida"}
                        </h5>

                        <form onSubmit={editingId ? handleUpdateFood : handleAddFood}>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control mb-3"
                                placeholder="¿Qué comiste?"
                                value={foodEntry.food}
                                onChange={e => setFoodEntry({ ...foodEntry, food: e.target.value })}
                                required
                            />

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Calorías"
                                value={foodEntry.calories}
                                onChange={e => setFoodEntry({ ...foodEntry, calories: e.target.value })}
                                required
                            />

                            {/* MACRONUTRIENTES */}
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Proteína (g)"
                                value={foodEntry.protein}
                                onChange={e => setFoodEntry({ ...foodEntry, protein: e.target.value })}
                            />

                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Carbohidratos (g)"
                                value={foodEntry.carbs}
                                onChange={e => setFoodEntry({ ...foodEntry, carbs: e.target.value })}
                            />

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Grasas (g)"
                                value={foodEntry.fat}
                                onChange={e => setFoodEntry({ ...foodEntry, fat: e.target.value })}
                            />

                            <select
                                className="form-control mb-3"
                                value={foodEntry.category}
                                onChange={e => setFoodEntry({ ...foodEntry, category: e.target.value })}
                            >
                                <option value="Desayuno">Desayuno</option>
                                <option value="Comida">Comida</option>
                                <option value="Cena">Cena</option>
                                <option value="Colación">Colación</option>
                            </select>

                            {/* EXTRA */}
                            <button className="btn btn-success w-100 fw-bold">
                                {editingId ? "Guardar cambios" : "+ Añadir"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RESUMEN LATERAL */}
                {/* RESUMEN PRO CON PROGRESO INTEGRADO */}
                <div className="col-md-7">
                    <div className="card shadow border-0 p-4 h-100 d-flex justify-content-center">

                        {/* MENSAJE INTELIGENTE */}
                        <div className="mt-2 mb-4 text-center small fw-bold">

                            {progress < 40 && (
                                <h5 className="text-warning">
                                    ⚠️ Aún puedes comer más
                                </h5>
                            )}

                            {progress >= 40 && progress < 80 && (
                                <h5 className="text-success">
                                    ⚠️ Vas equilibrado
                                </h5>
                            )}

                            {progress >= 80 && progress <= 100 && (
                                <h5 className="text-primary">
                                    ⚠️ Estás muy cerca de tu meta
                                </h5>
                            )}

                            {progress > 100 && (
                                <h5 className="text-danger">
                                    ⚠️ Excediste tu objetivo
                                </h5>
                            )}

                        </div>


                        {/* 🔥 BARRA DE CALORÍAS */}
                        <div className="mb-4">

                            <div className="d-flex justify-content-between small fw-bold mb-1">
                                <span className="fw-bold text-muted">
                                    {calories} / {plan?.calories} kcal
                                </span>
                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "12px",
                                    borderRadius: "10px",
                                    background: "#e9ecef"
                                }}
                            >
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${Math.min(progress, 100)}%`,
                                        transition: "width 0.6s ease",
                                        borderRadius: "10px",
                                        background:
                                            progress < 50
                                                ? "linear-gradient(90deg, #ffc107, #ff9800)"
                                                : progress < 80
                                                    ? "linear-gradient(90deg, #28a745, #20c997)"
                                                    : progress <= 100
                                                        ? "linear-gradient(90deg, #007bff, #6610f2)"
                                                        : "linear-gradient(90deg, #dc3545, #ff6b6b)"
                                    }}
                                />
                            </div>

                        </div>

                        {/* MACROS INLINE (COMPACTOS) */}
                        <div className="row text-center">

                            <div className="col">
                                <CircularProgress
                                    value={macros.protein}
                                    max={plan?.protein}
                                    label="Proteína"
                                />
                            </div>

                            <div className="col">
                                <CircularProgress
                                    value={macros.carbs}
                                    max={plan?.carbs}
                                    label="Carbs"
                                />
                            </div>

                            <div className="col">
                                <CircularProgress
                                    value={macros.fat}
                                    max={plan?.fat}
                                    label="Grasas"
                                />
                            </div>

                        </div>

                    </div>
                </div>

                {/* LISTA ALIMENTOS AGREGADOS POR CATEGORIA */}
                <div className="card shadow border-0 p-4 mt-4">
                    <h5 className="fw-bold text-success text-center mb-3">
                        REGISTRO DE ALIMENTOS
                    </h5>

                    {["Desayuno", "Comida", "Cena", "Colación"].map(category => {
                        const items = (foodList || []).filter(
                            f => (f.category || "").trim().toLowerCase() === category.toLowerCase()
                        ); const total = items.reduce((sum, i) => sum + Number(i.calories || 0), 0);

                        return (
                            <div key={category} className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <h6 className="fw-bold text-success">{category}</h6>
                                    <span className="small fw-bold">{total} kcal</span>
                                </div>

                                {items.length === 0 ? (
                                    <p className="text-muted small">Sin registros</p>
                                ) : (
                                    items.map((item, i) => (
                                        <div key={item.id || i} className="border-bottom py-2 small">

                                            <div className="d-flex justify-content-between align-items-center">

                                                {/* INFO DEL ALIMENTO */}
                                                <div>
                                                    <span>{item.food} - {item.calories} kcal</span>

                                                    <div className="text-muted small">
                                                        P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g
                                                    </div>
                                                </div>

                                                {/* BOTONES */}
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-outline-success me-2"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteFood(item.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* RECOMENDACIONES SET INTERVAL */}
                {showModal && recommendations.length > 0 && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 9999,
                            width: "300px"
                        }}
                    >
                        <div className="card shadow-lg border-0">
                            <div className="card-body text-center">

                                <h6 className="fw-bold text-success mb-2">
                                    Recomendación
                                </h6>

                                <p className="small mb-3">
                                    {recommendations[currentRecIndex]}
                                </p>

                                <button
                                    className="btn btn-sm btn-outline-danger w-100"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cerrar
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};