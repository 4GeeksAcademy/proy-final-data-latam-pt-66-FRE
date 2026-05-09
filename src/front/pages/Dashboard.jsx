import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { Link } from "react-router-dom";

export const Dashboard = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        weight: "",
        age: "",
        height: "",
        goal: "adelgazar",
        dietType: "vegan",
        isGlutenFree: true
    });

    const [profile, setProfile] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = sessionStorage.getItem("token");

    const loadProfile = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);

                const nameParts = data.name ? data.name.split(" ") : ["", ""];
                setFormData({
                    firstName: nameParts[0] || "",
                    lastName: nameParts.slice(1).join(" ") || "",
                    weight: data.weight || "",
                    age: data.age || "",
                    height: data.height || "",
                    goal: data.goal || "adelgazar",
                    dietType: data.diet_type || "vegan",
                    isGlutenFree: data.is_gluten_free ?? true
                });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    useEffect(() => {
        if (token) loadProfile();
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    weight: parseFloat(formData.weight),
                    age: parseInt(formData.age),
                    height: parseFloat(formData.height),
                    goal: formData.goal,
                    diet_type: formData.dietType,
                    is_gluten_free: formData.isGlutenFree
                })
            });

            if (res.ok) {
                swal("✅ ¡Perfil y plan nutricional actualizados!");
                loadProfile();
            } else {
                swal("❌ Error al guardar los cambios");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">

            {/* NUEVA SECCIÓN: TARJETAS DE INSPIRACIÓN */}
            <div className="row mb-4 g-3">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
                            className="card-img-top" alt="Dieta saludable" style={{ height: "160px", objectFit: "cover" }} />
                        <div className="card-img-overlay d-flex align-items-end p-2 bg-dark bg-opacity-25">
                            <span className="badge bg-success shadow">Planes Veganos</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                            className="card-img-top" alt="Ingredientes frescos" style={{ height: "160px", objectFit: "cover" }} />
                        <div className="card-img-overlay d-flex align-items-end p-2 bg-dark bg-opacity-25">
                            <span className="badge bg-primary shadow">Enfoque Nutricional</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80"
                            className="card-img-top" alt="Recetas equilibrio" style={{ height: "160px", objectFit: "cover" }} />
                        <div className="card-img-overlay d-flex align-items-end p-2 bg-dark bg-opacity-25">
                            <span className="badge bg-warning text-dark shadow">Sin Gluten</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 align-items-stretch">

                {/* FORMULARIO */}
                <div className="col-lg-6">

                    <div
                        className="card border-0 shadow-lg h-100 overflow-hidden"
                        style={{
                            borderRadius: "28px",
                            background: "linear-gradient(180deg, #ffffff 0%, #f8fffb 100%)"
                        }}
                    >

                        {/* HEADER */}
                        <div
                            className="p-4 text-white"
                            style={{
                                background: "linear-gradient(135deg, #198754 0%, #157347 100%)"
                            }}
                        >

                            <div className="d-flex align-items-center justify-content-between">

                                <div>
                                    <h3 className="fw-bold mb-1">
                                        <i className="fas fa-leaf me-2"></i>
                                        Mi NutriFit
                                    </h3>

                                    <p className="mb-0 opacity-75 small">
                                        Personaliza tu experiencia nutricional
                                    </p>
                                </div>


                            </div>

                        </div>

                        {/* BODY */}
                        <div className="p-4">

                            <form onSubmit={handleSave}>

                                {/* NOMBRES */}
                                <div className="row g-3">

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-muted small">
                                            Nombre
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-0">
                                                <i className="fas fa-user text-success"></i>
                                            </span>

                                            <input
                                                type="text"
                                                className="form-control border-0 bg-light py-2"
                                                placeholder="Nombre"
                                                value={formData.firstName}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        firstName: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-muted small">
                                            Apellidos
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control border-0 bg-light py-2"
                                            placeholder="Apellidos"
                                            value={formData.lastName}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    lastName: e.target.value
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                </div>

                                {/* OBJETIVO */}
                                <div className="mt-4">

                                    <label className="form-label fw-semibold text-muted small">
                                        Objetivo Principal
                                    </label>

                                    <select
                                        className="form-select border-0 bg-light py-3"
                                        value={formData.goal}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                goal: e.target.value
                                            })
                                        }
                                    >
                                        <option value="adelgazar">
                                            Adelgazar / Definición
                                        </option>

                                        <option value="masa_muscular">
                                            Subir Masa Muscular
                                        </option>

                                        <option value="mantenimiento">
                                            Mantenimiento Saludable
                                        </option>
                                    </select>

                                </div>

                                {/* SWITCHES */}
                                <div className="mt-4">

                                    <div
                                        className="d-flex justify-content-between align-items-center bg-light rounded-4 p-3 mb-3"
                                    >

                                        <div>
                                            <div className="fw-bold">
                                                Dieta Sin TACC
                                            </div>

                                            <small className="text-muted">
                                                Ideal para celiaquía
                                            </small>
                                        </div>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={formData.isGlutenFree}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        isGlutenFree: e.target.checked
                                                    })
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div
                                        className="d-flex justify-content-between align-items-center bg-light rounded-4 p-3"
                                    >

                                        <div>
                                            <div className="fw-bold">
                                                Dieta Vegana
                                            </div>

                                            <small className="text-muted">
                                                Alimentación 100% vegetal
                                            </small>
                                        </div>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={formData.dietType === "vegan"}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        dietType: e.target.checked
                                                            ? "vegan"
                                                            : "standard"
                                                    })
                                                }
                                            />
                                        </div>

                                    </div>

                                </div>

                                {/* MÉTRICAS */}
                                <div className="row g-3 mt-2">

                                    <div className="col-md-4">

                                        <div className="bg-light rounded-4 p-3 text-center">

                                            <i className="fas fa-weight text-muted mb-2"></i>

                                            <label className="small text-muted d-block">
                                                Peso
                                            </label>

                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-control border-0 bg-white text-center fw-bold"
                                                value={formData.weight}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        weight: e.target.value
                                                    })
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="bg-light rounded-4 p-3 text-center">

                                            <i className="fas fa-ruler-vertical text-muted mb-2"></i>

                                            <label className="small text-muted d-block">
                                                Altura
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control border-0 bg-white text-center fw-bold"
                                                value={formData.height}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        height: e.target.value
                                                    })
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="bg-light rounded-4 p-3 text-center">

                                            <i className="fas fa-calendar text-muted mb-2"></i>

                                            <label className="small text-muted d-block">
                                                Edad
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control border-0 bg-white text-center fw-bold"
                                                value={formData.age}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        age: e.target.value
                                                    })
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* BUTTONS */}
                                <div className="d-grid gap-3 mt-4">

                                    <button
                                        className="btn btn-success fw-bold py-3 shadow"
                                        style={{
                                            borderRadius: "14px"
                                        }}
                                    >
                                        <i className="fas fa-sync-alt me-2"></i>
                                        Actualizar Plan
                                    </button>
                                </div>

                            </form>

                        </div>

                    </div>

                </div>

                {/* RESUMEN */}
                <div className="col-lg-6 d-flex">

                    <div
                        className="card border-0 shadow-lg h-100 w-100 d-flex flex-column justify-content-center"
                        style={{
                            borderRadius: "28px",
                            minHeight: "100%"
                        }}
                    >

                        {/* HEADER */}
                        <div className="p-4 border-bottom text-center">

                            <h3 className="fw-bold text-success mb-1">
                                <i className="fas fa-chart-line me-2"></i>
                                Resumen de Perfil
                            </h3>

                            <small className="text-muted">
                                Estado actual de tu progreso nutricional
                            </small>

                        </div>



                        {/* BODY */}
                        <div className="p-4 flex-grow-1 d-flex flex-column">

                            <div className="row g-4 w-100 justify-content-center mx-auto">

                                {/* OBJETIVO */}
                                <div className="col-md-6 d-flex justify-content-center">

                                    <div className="bg-light rounded-4 p-4 h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center">

                                        <small className="text-muted fw-semibold">
                                            OBJETIVO
                                        </small>

                                        <h4 className="fw-bold text-primary mt-2">
                                            {profile?.goal === "masa_muscular"
                                                ? "Subir Masa"
                                                : "Adelgazar"}
                                        </h4>

                                        <p className="small text-muted mb-0">
                                            Meta nutricional principal configurada
                                        </p>

                                    </div>

                                </div>

                                {/* DIETA */}
                                <div className="col-md-6 d-flex justify-content-center">

                                    <div className="bg-light rounded-4 p-4 h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center">

                                        <small className="text-muted fw-semibold">
                                            TIPO DE DIETA
                                        </small>

                                        <div className="mt-3">

                                            <span
                                                className={`badge px-3 py-2 fs-6 ${profile?.diet_type === "vegan"
                                                        ? "bg-success"
                                                        : "bg-secondary"
                                                    }`}
                                            >
                                                {profile?.diet_type === "vegan"
                                                    ? "VEGANA"
                                                    : "ESTÁNDAR"}
                                            </span>

                                            {profile?.is_gluten_free && (
                                                <span className="badge bg-warning text-dark px-3 py-2 fs-6 ms-2">
                                                    SIN TACC
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* PESO */}
                                <div className="col-md-6 d-flex justify-content-center">

                                    <div className="bg-light rounded-4 p-4 h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center">

                                        <small className="fw-semibold text-muted">
                                            PESO ACTUAL
                                        </small>

                                        <h2 className="fw-bold mt-2 text-dark">
                                            {profile?.weight || "--"} kg
                                        </h2>

                                        <i className="fas fa-weight fs-3 text-muted opacity-50"></i>

                                    </div>

                                </div>

                                {/* ALTURA */}
                                <div className="col-md-6 d-flex justify-content-center">

                                    <div className="bg-light rounded-4 p-4 h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center">

                                        <small className="fw-semibold text-muted">
                                            ALTURA / EDAD
                                        </small>

                                        <h2 className="fw-bold text-dark mt-2">
                                            {profile?.height || "--"} cm
                                        </h2>

                                        <div className="text-dark fw-semibold">
                                            {profile?.age || "--"} años
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* BOTÓN ABAJO */}
                            <div className="mt-auto pt-4 text-center">

                                <Link
                                    to="/nutricion"
                                    className="btn btn-success fw-bold py-3 px-5 shadow w-100"
                                    style={{
                                        borderRadius: "14px"
                                    }}
                                >
                                    <i className="fas fa-utensils me-2"></i>
                                    Registra tus alimentos
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};