import React, { useState, useEffect } from "react";

export const Dashboard = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        weight: "",
        age: "",
        height: "",
        goal: "adelgazar", // Valor por defecto
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
                alert("✅ ¡Perfil y plan nutricional actualizados!");
                loadProfile();
            } else {
                alert("❌ Error al guardar los cambios");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="row g-4">
                {/* FORMULARIO */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4 bg-white">
                        <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-utensils me-2"></i>Perfil Nutricional
                        </h4>
                        <form onSubmit={handleSave}>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="small fw-bold text-muted">NOMBRES</label>
                                    <input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="small fw-bold text-muted">APELLIDOS</label>
                                    <input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold text-muted">OBJETIVO PRINCIPAL</label>
                                <select className="form-select" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
                                    <option value="adelgazar">Adelgazar / Definición</option>
                                    <option value="masa_muscular">Subir Masa Muscular</option>
                                    <option value="mantenimiento">Mantenimiento Saludable</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" checked={formData.isGlutenFree} 
                                        onChange={e => setFormData({...formData, isGlutenFree: e.target.checked})} />
                                    <label className="form-check-label fw-bold small text-muted">DIETA SIN TACC (CELIAQUÍA)</label>
                                </div>
                                <div className="form-check form-switch mt-2">
                                    <input className="form-check-input" type="checkbox" checked={formData.dietType === "vegan"} 
                                        onChange={e => setFormData({...formData, dietType: e.target.checked ? "vegan" : "standard"})} />
                                    <label className="form-check-label fw-bold small text-muted">DIETA 100% VEGANA</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4 mb-3">
                                    <label className="small fw-bold text-muted">PESO (KG)</label>
                                    <input type="number" step="0.1" className="form-control" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
                                </div>
                                <div className="col-4 mb-3">
                                    <label className="small fw-bold text-muted">ALTURA</label>
                                    <input type="number" className="form-control" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} required />
                                </div>
                                <div className="col-4 mb-3">
                                    <label className="small fw-bold text-muted">EDAD</label>
                                    <input type="number" className="form-control" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
                                </div>
                            </div>
                            
                            <button className="btn btn-success w-100 fw-bold py-2 shadow-sm mt-3">
                                <i className="fas fa-sync-alt me-2"></i>ACTUALIZAR PLAN
                            </button>
                        </form>
                    </div>
                </div>

                {/* RESUMEN */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 p-4 h-100 bg-white">
                        <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-clipboard-check me-2"></i>Resumen de Perfil
                        </h4>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">OBJETIVO</td>
                                        <td className="py-3 fw-bold text-uppercase text-primary">
                                            {profile?.goal === "masa_muscular" ? "Subir Masa Muscular" : "Adelgazar"}
                                        </td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">TIPO DE DIETA</td>
                                        <td className="py-3">
                                            <span className={`badge ${profile?.diet_type === 'vegan' ? 'bg-success' : 'bg-secondary'} me-2`}>
                                                {profile?.diet_type === 'vegan' ? 'VEGANA' : 'ESTÁNDAR'}
                                            </span>
                                            {profile?.is_gluten_free && <span className="badge bg-warning text-dark">SIN TACC</span>}
                                        </td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">PESO ACTUAL</td>
                                        <td className="py-3 fw-bold text-success">{profile?.weight ? `${profile.weight} kg` : "---"}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">ESTATURA / EDAD</td>
                                        <td className="py-3">{profile?.height} cm / {profile?.age} años</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};