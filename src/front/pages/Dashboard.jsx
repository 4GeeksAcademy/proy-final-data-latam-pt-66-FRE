import React, { useState, useEffect } from "react";

export const Dashboard = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        weight: "",
        age: "",
        height: ""
    });
    
    const [profile, setProfile] = useState(null);

    // Usamos import.meta.env que es el estándar de Vite
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = sessionStorage.getItem("token");

    // 1. Cargar datos del perfil
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

                // Separamos el string 'name' para los inputs del formulario
                const nameParts = data.name ? data.name.split(" ") : ["", ""];
                setFormData({
                    firstName: nameParts[0] || "",
                    lastName: nameParts.slice(1).join(" ") || "",
                    weight: data.weight || "",
                    age: data.age || "",
                    height: data.height || ""
                });
            } else {
                console.error("Error al obtener perfil:", res.status);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    useEffect(() => {
        if (token) loadProfile();
    }, [token]);

    // 2. Guardar cambios
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
                    height: parseFloat(formData.height)
                })
            });

            if (res.ok) {
                alert("✅ ¡Perfil actualizado correctamente!");
                loadProfile(); // Refrescamos la tabla
            } else {
                const errorLog = await res.json();
                alert(`❌ Error: ${errorLog.msg || "No se pudo guardar"}`);
            }
        } catch (error) {
            console.error("Error en la petición PUT:", error);
            alert("❌ Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="row g-4">
                {/* LADO IZQUIERDO: FORMULARIO */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4 bg-white">
                        <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-user-edit me-2"></i>Mis Datos
                        </h4>
                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted">NOMBRES</label>
                                <input type="text" className="form-control form-control-lg fs-6" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted">APELLIDOS</label>
                                <input type="text" className="form-control form-control-lg fs-6" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="small fw-bold text-muted">PESO (KG)</label>
                                    <input type="number" step="0.1" className="form-control" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="small fw-bold text-muted">ALTURA (CM)</label>
                                    <input type="number" className="form-control" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="small fw-bold text-muted">EDAD</label>
                                <input type="number" className="form-control" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
                            </div>
                            <button className="btn btn-success w-100 fw-bold py-2 shadow-sm">
                                <i className="fas fa-sync-alt me-2"></i>GUARDAR Y ACTUALIZAR
                            </button>
                        </form>
                    </div>
                </div>

                {/* LADO DERECHO: TABLA INFORMATIVA */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 p-4 h-100 bg-white">
                        <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-clipboard-check me-2"></i>Resumen de Perfil
                        </h4>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3" style={{ width: "40%" }}>NOMBRE COMPLETO</td>
                                        <td className="py-3 fw-bold text-capitalize">{profile?.name || "---"}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">PESO ACTUAL</td>
                                        <td className="py-3 fw-bold text-success">{profile?.weight ? `${profile.weight} kg` : "---"}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">ESTATURA</td>
                                        <td className="py-3">{profile?.height ? `${profile.height} cm` : "---"}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="text-muted small fw-bold py-3">EDAD</td>
                                        <td className="py-3">{profile?.age ? `${profile.age} años` : "---"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="alert alert-light border-0 mt-auto mb-0 text-center">
                            <small className="text-muted italic">
                                "Toda tu información está cifrada y solo tú puedes verla."
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};