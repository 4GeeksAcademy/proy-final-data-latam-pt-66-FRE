import { useReducer, useEffect, useRef } from "react";
import swal from "sweetalert";

export const NutritionPage = () => {

    const formRef = useRef(null);
    const inputRef = useRef(null);

    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const initialState = {
        calories: 0,
        macros: { protein: 0, carbs: 0, fat: 0 },
        dietType: "",

        user: {
            weight: 0,
            height: 0,
            age: 0,
            gender: "", // male | female
            goal: "" // lose | maintain | gain
        },

        foodEntry: {
            food: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            category: ""
        },

        foodList: [],
        plan: null,
        recommendations: [],
        currentRecIndex: 0,
        showModal: false,
        editingId: null
    };

    const reducer = (state, action) => {
        switch (action.type) {

            case "SET_SUMMARY":
                return {
                    ...state,
                    calories: action.payload.total_calories || 0,
                    dietType: action.payload.diet_type || "Equilibrada",
                    macros: {
                        protein: action.payload.protein || 0,
                        carbs: action.payload.carbs || 0,
                        fat: action.payload.fat || 0
                    }
                };

            case "SET_PLAN":
                return { ...state, plan: action.payload };

            case "SET_FOOD_LIST":
                return {
                    ...state,
                    foodList: (action.payload || []).map(item => ({
                        id: item.id,

                        // FIX CLAVE AQUÍ
                        food: item.food_name || item.food || "Sin nombre",

                        category: item.meal_category || item.category || "Desayuno",

                        calories: Number(item.calories || 0),
                        protein: Number(item.protein || 0),
                        carbs: Number(item.carbs || 0),
                        fat: Number(item.fat || 0)
                    }))
                };

            case "SET_RECOMMENDATIONS":
                return {
                    ...state,
                    recommendations: action.payload || [],
                    showModal: action.payload?.length > 0,
                    currentRecIndex: 0
                };

            case "NEXT_RECOMMENDATION":
                return {
                    ...state,
                    currentRecIndex:
                        state.recommendations.length > 0
                            ? (state.currentRecIndex + 1) % state.recommendations.length
                            : 0
                };

            case "UPDATE_FOOD_ENTRY":
                return {
                    ...state,
                    foodEntry: {
                        ...state.foodEntry,
                        [action.field]: action.value
                    }
                };

            case "RESET_FORM":
                return {
                    ...state,
                    foodEntry: initialState.foodEntry,
                    editingId: null
                };

            case "SET_EDIT":
                return {
                    ...state,
                    editingId: action.payload.id,
                    foodEntry: {
                        food: action.payload.food || "",
                        calories: action.payload.calories || "",
                        protein: action.payload.protein || "",
                        carbs: action.payload.carbs || "",
                        fat: action.payload.fat || "",
                        category: action.payload.category || "Desayuno"
                    }
                };

            case "CLOSE_MODAL":
                return { ...state, showModal: false };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    // ========================
    // API
    // ========================
    const apiFetch = async (endpoint, options = {}) => {
        try {
            const res = await fetch(`${backendUrl}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    ...(options.headers || {})
                }
            });

            if (!res.ok) throw new Error(await res.text());

            return await res.json();

        } catch (err) {
            console.error("API ERROR:", err.message);
            return null;
        }
    };

    // ========================
    // LOADERS
    // ========================
    const loadAll = async () => {
        const [summary, plan, foods, recs] = await Promise.all([
            apiFetch("/api/daily-summary"),
            apiFetch("/api/nutrition-plan"),
            apiFetch("/api/daily-log"),
            apiFetch("/api/ai-recommendations")
        ]);

        if (summary) dispatch({ type: "SET_SUMMARY", payload: summary });
        if (plan) dispatch({ type: "SET_PLAN", payload: plan });
        if (foods) dispatch({ type: "SET_FOOD_LIST", payload: foods });
        if (recs) dispatch({ type: "SET_RECOMMENDATIONS", payload: recs?.recommendations });
    };

    useEffect(() => {
        if (token) loadAll();
    }, [token]);

    // ========================
    // INTERVALO RECOMMENDATIONS
    // ========================
    useEffect(() => {
        if (!state.recommendations.length || !state.showModal) return;

        const interval = setInterval(() => {
            dispatch({ type: "NEXT_RECOMMENDATION" });
        }, 5000);

        return () => clearInterval(interval);
    }, [state.recommendations, state.showModal]);


    // ========================
    // CRUD
    // ========================
    const handleAddFood = async (e) => {
        e.preventDefault();

        const payload = {
            food: state.foodEntry.food,
            category: state.foodEntry.category,
            calories: Number(state.foodEntry.calories || 0),
            protein: Number(state.foodEntry.protein || 0),
            carbs: Number(state.foodEntry.carbs || 0),
            fat: Number(state.foodEntry.fat || 0),
            water: 0
        };

        const res = await apiFetch("/api/daily-log", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!res) return;

        dispatch({ type: "RESET_FORM" });
        await loadAll();
    };

    const handleUpdateFood = async (e) => {
        e.preventDefault();

        const payload = {
            food: state.foodEntry.food,
            category: state.foodEntry.category,
            calories: Number(state.foodEntry.calories || 0),
            protein: Number(state.foodEntry.protein || 0),
            carbs: Number(state.foodEntry.carbs || 0),
            fat: Number(state.foodEntry.fat || 0)
        };

        await apiFetch(`/api/daily-log/${state.editingId}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });

        dispatch({ type: "RESET_FORM" });
        await loadAll();
    };

    const handleEdit = (item) => {
        dispatch({ type: "SET_EDIT", payload: item });

        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
            inputRef.current?.focus();
        }, 100);
    };

    const handleDeleteFood = async (id) => {
        const confirmDelete = window.confirm("¿Eliminar alimento?");
        if (!confirmDelete) return;

        const res = await apiFetch(`/api/daily-log/${id}`, {
            method: "DELETE"
        });

        if (!res) {
            swal("❌ Error al eliminar");
            return;
        }

        // ACTUALIZACIÓN LOCAL (sin reload)
        dispatch({
            type: "SET_FOOD_LIST",
            payload: state.foodList.filter(item => item.id !== id)
        });

        // OPCIONAL: actualizar resumen sin recargar todo
        await loadAll(); // puedes quitar esto si luego haces cálculo local
    };

    // PLAN ADAPTADO
    const calculatePlan = (user) => {
        const { weight, height, age, gender, goal } = user;

        // TMB
        const bmr =
            gender === "male"
                ? 10 * weight + 6.25 * height - 5 * age + 5
                : 10 * weight + 6.25 * height - 5 * age - 161;

        // Actividad (puedes hacerlo dinámico luego)
        const activityFactor = 1.55;

        let calories = bmr * activityFactor;

        // Ajuste por objetivo
        if (goal === "lose") calories -= 400;
        if (goal === "gain") calories += 400;

        // Macros estándar fitness
        const protein = weight * 2; // 2g/kg
        const fat = weight * 0.8;   // 0.8g/kg
        const carbs = (calories - (protein * 4 + fat * 9)) / 4;

        return {
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat)
        };
    };

    useEffect(() => {
        if (!state.plan) {
            const calculatedPlan = calculatePlan(state.user);

            dispatch({
                type: "SET_PLAN",
                payload: calculatedPlan
            });
        }
    }, [state.user]);

    // ========================
    // DERIVED
    // ========================
    const MacroRing = ({ value, max, label, color, unit = "g" }) => {
        const radius = 50;
        const stroke = 10;
        const normalizedRadius = radius - stroke / 2;
        const circumference = 2 * Math.PI * normalizedRadius;

        const percentage = max ? (value / max) * 100 : 0;
        const strokeDashoffset =
            circumference - (Math.min(percentage, 100) / 100) * circumference;

        return (
            <div className="text-center">
                <svg width="120" height="120">

                    <circle
                        cx="60"
                        cy="60"
                        r={normalizedRadius}
                        stroke="#e9ecef"
                        strokeWidth={stroke}
                        fill="transparent"
                    />

                    <circle
                        cx="60"
                        cy="60"
                        r={normalizedRadius}
                        stroke={color}
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />

                    <text
                        x="50%"
                        y="50%"
                        dy="0.3em"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                    >
                        {Math.round(percentage)}%
                    </text>
                </svg>

                <div className="fw-bold mt-2">{label}</div>

                <small className="text-muted">
                    {value} / {max || 0} {unit}
                </small>
            </div>
        );
    };

    const remaining = state.plan?.calories
        ? state.plan.calories - state.calories
        : 0;


    const calculateMacrosFromCalories = (calories, plan) => {
        if (!plan || !calories) return { protein: "", carbs: "", fat: "" };

        const proteinRatio = (plan.protein * 4) / plan.calories;
        const carbsRatio = (plan.carbs * 4) / plan.calories;
        const fatRatio = (plan.fat * 9) / plan.calories;

        return {
            protein: Math.round((calories * proteinRatio) / 4),
            carbs: Math.round((calories * carbsRatio) / 4),
            fat: Math.round((calories * fatRatio) / 9)
        };
    };

    // ========================
    // UI
    // ========================
    return (
        <div className="container py-4">

            {/* PLAN */}
            <div className="card shadow border-0 rounded-4 p-3 mb-4">

                {/* TIPO DE DIETA */}
                <span className="badge bg-success m-3 align-self-center">
                    {state.dietType}
                </span>

                {/* HEADER */}
                <div className="text-center mb-3">
                    <h6 className="text-muted mb-1">Objetivo diario</h6>
                    <h3 className="fw-bold mb-0 text-success">
                        {state.plan?.calories} kcal
                    </h3>
                </div>

                {/* MACROS */}
                <div className="row text-center">

                    <div className="col">
                        <div className="p-2 rounded-3 bg-light">
                            <div className="fw-bold text-primary">
                                {state.plan?.protein}g
                            </div>
                            <small className="text-muted">Proteína</small>
                        </div>
                    </div>

                    <div className="col">
                        <div className="p-2 rounded-3 bg-light">
                            <div className="fw-bold text-warning">
                                {state.plan?.carbs}g
                            </div>
                            <small className="text-muted">Carbs</small>
                        </div>
                    </div>

                    <div className="col">
                        <div className="p-2 rounded-3 bg-light">
                            <div className="fw-bold text-danger">
                                {state.plan?.fat}g
                            </div>
                            <small className="text-muted">Grasas</small>
                        </div>
                    </div>

                </div>

            </div>

            <div className="row g-4">

                {/* FORM */}
                <div className="col-md-6" ref={formRef}>
                    <div className="card rounded-4 shadow border-0 p-4 h-100">

                        {/* HEADER */}
                        <div className="mb-3 text-center">
                            <h5 className="fw-bold text-success mb-1">
                                {state.editingId ? "Editar alimento" : "Agregar comida"}
                            </h5>
                            <small className="text-muted">
                            </small>
                        </div>

                        <form onSubmit={state.editingId ? handleUpdateFood : handleAddFood}>

                            {/* 🍽 FOOD */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Alimento</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Manzana"
                                    value={state.foodEntry.food}
                                    onChange={e =>
                                        dispatch({
                                            type: "UPDATE_FOOD_ENTRY",
                                            field: "food",
                                            value: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* 🔥 CALORÍAS */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Calorías</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ej: 50 kcal"
                                    value={state.foodEntry.calories}
                                    onChange={e => {
                                        const value = e.target.value;

                                        dispatch({
                                            type: "UPDATE_FOOD_ENTRY",
                                            field: "calories",
                                            value
                                        });

                                        // AUTO-CÁLCULO
                                        if (value) {
                                            const macros = calculateMacrosFromCalories(Number(value), state.plan);

                                            dispatch({ type: "UPDATE_FOOD_ENTRY", field: "protein", value: macros.protein });
                                            dispatch({ type: "UPDATE_FOOD_ENTRY", field: "carbs", value: macros.carbs });
                                            dispatch({ type: "UPDATE_FOOD_ENTRY", field: "fat", value: macros.fat });
                                        }
                                    }}
                                    required
                                />
                            </div>

                            {/* 🧬 MACROS EN GRID */}
                            <div className="row g-2 mb-3">

                                <div className="col">
                                    <label className="form-label small">Proteína</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="g"
                                        value={state.foodEntry.protein}
                                        onChange={e =>
                                            dispatch({
                                                type: "UPDATE_FOOD_ENTRY",
                                                field: "protein",
                                                value: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col">
                                    <label className="form-label small">Carbs</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="g"
                                        value={state.foodEntry.carbs}
                                        onChange={e =>
                                            dispatch({
                                                type: "UPDATE_FOOD_ENTRY",
                                                field: "carbs",
                                                value: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col">
                                    <label className="form-label small">Grasas</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="g"
                                        value={state.foodEntry.fat}
                                        onChange={e =>
                                            dispatch({
                                                type: "UPDATE_FOOD_ENTRY",
                                                field: "fat",
                                                value: e.target.value
                                            })
                                        }
                                    />
                                </div>

                            </div>

                            {/* 🍽 CATEGORY */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Tipo de comida</label>
                                <select
                                    className="form-select"
                                    value={state.foodEntry.category}
                                    onChange={e =>
                                        dispatch({
                                            type: "UPDATE_FOOD_ENTRY",
                                            field: "category",
                                            value: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Selecciona</option>
                                    <option>Desayuno</option>
                                    <option>Comida</option>
                                    <option>Cena</option>
                                    <option>Colación</option>
                                </select>
                            </div>

                            {/* BOTÓN */}
                            <button className="btn btn-success w-100 py-2 fw-semibold">
                                {state.editingId ? "Actualizar alimento" : "Agregar alimento"}
                            </button>

                        </form>
                    </div>
                </div>


                {/* PROGRESOS */}
                <div className="col-md-6">
                    <div className="card shadow-lg rounded-4 border-0 p-4 h-100 d-flex justify-content-center">

                        {/* 🔥 CALORÍAS (TOP) */}
                        <div className="w-100 mb-4">

                            {/* HEADER */}
                            <div className="text-center mb-2">
                                <h6 className="text-muted mb-1">Calorías consumidas</h6>
                                <h4 className="fw-bold text-success mb-0">
                                    {state.calories} / {state.plan?.calories || 0} kcal
                                </h4>
                            </div>

                            {/* MAIN CALORIAS */}
                            <div
                                className="progress"
                                style={{ height: "14px", borderRadius: "12px" }}
                            >
                                <div
                                    className={`progress-bar ${state.calories > state.plan?.calories
                                        ? "bg-danger"
                                        : "bg-success"
                                        }`}
                                    role="progressbar"
                                    style={{
                                        width: `${state.plan?.calories
                                            ? Math.min(
                                                (state.calories / state.plan.calories) * 100,
                                                100
                                            )
                                            : 0
                                            }%`,
                                        transition: "width 0.5s ease"
                                    }}
                                />
                            </div>

                            {/* FOOTER */}
                            <div className="d-flex justify-content-between mt-1">

                                <div className="text-center mt-2">
                                    <span
                                        className={`badge ${state.calories > state.plan?.calories
                                            ? "bg-danger"
                                            : "bg-success"
                                            }`}
                                    >
                                        {state.plan?.calories
                                            ? Math.round(
                                                (state.calories / state.plan.calories) * 100
                                            )
                                            : 0}
                                        %
                                    </span>
                                </div>


                                <small
                                    className={`fw-semibold ${remaining < 0 ? "text-danger" : "text-success"
                                        }`}
                                >
                                    {remaining >= 0
                                        ? `Te quedan ${remaining} kcal`
                                        : `Excediste ${Math.abs(remaining)} kcal`}
                                </small>


                            </div>

                        </div>

                        {/* DIVIDER */}
                        <hr className="my-3" />

                        {/* 🧬 MACROS (BOTTOM ROW) */}
                        <div className="row text-center">

                            <div className="col">
                                <MacroRing
                                    value={state.macros.protein}
                                    max={state.plan?.protein}
                                    label="Proteína"
                                    color="#007bff"
                                />
                            </div>

                            <div className="col">
                                <MacroRing
                                    value={state.macros.carbs}
                                    max={state.plan?.carbs}
                                    label="Carbs"
                                    color="#ffc107"
                                />
                            </div>

                            <div className="col">
                                <MacroRing
                                    value={state.macros.fat}
                                    max={state.plan?.fat}
                                    label="Grasas"
                                    color="#dc3545"
                                />
                            </div>

                        </div>
                    </div>
                </div>


            </div>


            {/* LISTA */}
            <div className="card rounded-4 overflow-hidden shadow border-0 p-4 mt-4">

                <h5 className="text-center text-success fw-bold mb-3">Registro diario</h5>

                {["Desayuno", "Comida", "Cena", "Colación"].map(category => {

                    const items = state.foodList.filter(
                        f => (f.category || "").toLowerCase() === category.toLowerCase()
                    );

                    const total = items.reduce(
                        (sum, i) => sum + Number(i.calories || 0),
                        0
                    );

                    return (
                        <div key={category} className="mb-4">

                            <div className="d-flex justify-content-between">
                                <strong>{category}</strong>
                                <span>{total} kcal</span>
                            </div>

                            {items.length === 0 ? (
                                <small className="text-muted">Sin registros</small>
                            ) : (
                                items.map(item => (
                                    <div
                                        key={item.id}
                                        className="d-flex justify-content-between border-bottom py-2"
                                    >


                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>
                                                {item.food}
                                            </div>

                                            <small className="text-success">
                                                {item.calories} kcal •
                                                <span className="text-primary"> P:{item.protein}</span> •
                                                <span className="text-warning"> C:{item.carbs}</span> •
                                                <span className="text-danger"> G:{item.fat}</span>
                                            </small>
                                        </div>

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
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}

            </div>

            {/* RECOMENDACIONES */}
            {state.showModal && state.recommendations.length > 0 && (
                <div
                    className="position-fixed"
                    style={{
                        bottom: "20px",
                        right: "20px",
                        zIndex: 9999,
                        width: "300px",
                        animation: "fadeInUp 0.4s ease"
                    }}
                >
                    <div className="rounded-4 shadow-lg border-0 bg-white overflow-hidden">

                        {/* HEADER */}
                        <div className="d-flex justify-content-end align-items-center px-3 pt-3 pb-2">

                            <button
                                className="btn-close"
                                style={{ fontSize: "0.7rem" }}
                                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                            />
                        </div>

                        {/* BODY */}
                        <div className="px-3 pb-3 text-center">

                            <div
                                key={state.currentRecIndex}
                                style={{
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}
                            >
                                {state.recommendations[state.currentRecIndex]}
                            </div>

                            {/* PROGRESO */}
                            <div className="mt-3">
                                <div className="progress" style={{ height: "5px" }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{
                                            width: `${((state.currentRecIndex + 1) / state.recommendations.length) * 100}%`
                                        }}
                                    />
                                </div>

                                <small className="text-muted">
                                    {state.currentRecIndex + 1} / {state.recommendations.length}
                                </small>
                            </div>

                            {/* BOTÓN */}
                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => dispatch({ type: "NEXT_RECOMMENDATION" })}
                                >
                                    Siguiente →
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};