import React, { useState, useEffect } from "react";

export const Dashboard = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        weight: "",
        age: "",
        height: "",
        goal: "masa_muscular",
        dietType: "standard",
        isGlutenFree: false
    });
    
    const [profile, setProfile] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadProfile = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
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
                    goal: data.goal || "masa_muscular",
                    dietType: data.diet_type || "standard",
                    isGlutenFree: data.is_gluten_free ?? false
                });
            }
        } catch (error) { console.error("Error:", error); }
    };

    useEffect(() => { loadProfile(); }, []);

    const calculateStats = () => {
        if (!profile?.weight || !profile?.height || !profile?.age) return null;
        const w = parseFloat(profile.weight);
        const h = parseFloat(profile.height);
        const a = parseInt(profile.age);

        const imc = (w / ((h/100) ** 2)).toFixed(1);
        
        // TMB - Fórmula Harris-Benedict revisada
        let tmb = 66.47 + (13.75 * w) + (5 * h) - (6.75 * a);
        let mantenimiento = tmb * 1.55;
        
        let calorias;
        let proteMulti;

        // Lógica de 3 pilares: Subir, Bajar o Mantener
        if (profile.goal === "masa_muscular") {
            calorias = mantenimiento + 500;
            proteMulti = 2.2;
        } else if (profile.goal === "adelgazar") {
            calorias = mantenimiento - 500;
            proteMulti = 2.0;
        } else {
            // MANTENER / EQUILIBRIO
            calorias = mantenimiento;
            proteMulti = 1.8;
        }
        
        return {
            imc,
            calorias: Math.round(calorias),
            protes: Math.round(w * proteMulti),
            grasas: Math.round((calorias * 0.25) / 9),
            carbos: Math.round((calorias * 0.45) / 4)
        };
    };

    const stats = calculateStats();

    const handleSave = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
            if (res.ok) { loadProfile(); alert("¡Plan de nutrición reiniciado con éxito!"); }
        } catch (error) { console.error("Error:", error); }
    };

    return (
        <div className="container mt-4 pb-5 text-start">
            <div className="row g-4">
                {/* FORMULARIO */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4 bg-white h-100">
                        <h5 className="fw-bold text-success mb-4 text-uppercase border-bottom pb-2">Perfil Nutricional</h5>
                        <form onSubmit={handleSave}>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="small fw-bold text-muted text-uppercase">Nombres</label>
                                    <input type="text" className="form-control bg-light border-0" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                </div>
                                <div className="col-6">
                                    <label className="small fw-bold text-muted text-uppercase">Apellidos</label>
                                    <input type="text" className="form-control bg-light border-0" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="small fw-bold text-muted text-uppercase">Objetivo Principal</label>
                                <select className="form-select bg-light border-0" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
                                    <option value="adelgazar">Adelgazar</option>
                                    <option value="mantener">Mantenerse en Equilibrio</option>
                                    <option value="masa_muscular">Subir Masa Muscular</option>
                                </select>
                            </div>

                            <div className="mb-3 p-3 bg-light rounded shadow-sm border">
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" checked={formData.isGlutenFree} 
                                        onChange={e => setFormData({...formData, isGlutenFree: e.target.checked})} />
                                    <label className="form-check-label fw-bold small text-secondary">DIETA SIN TACC</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" checked={formData.dietType === "vegan"} 
                                        onChange={e => setFormData({...formData, dietType: e.target.checked ? "vegan" : "standard"})} />
                                    <label className="form-check-label fw-bold small text-secondary">DIETA VEGANA</label>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-4">
                                    <label className="small fw-bold text-muted">PESO (KG)</label>
                                    <input type="number" className="form-control bg-light border-0" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                                </div>
                                <div className="col-4">
                                    <label className="small fw-bold text-muted">ALTURA (CM)</label>
                                    <input type="number" className="form-control bg-light border-0" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                                </div>
                                <div className="col-4">
                                    <label className="small fw-bold text-muted">EDAD</label>
                                    <input type="number" className="form-control bg-light border-0" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                                </div>
                            </div>
                            <button className="btn btn-success w-100 fw-bold py-2 shadow-sm text-uppercase">Actualizar Plan</button>
                        </form>
                    </div>
                </div>

                {/* LIMITES DIARIOS Y RESUMEN */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 mb-4 bg-white overflow-hidden">
                        <div className="p-3 text-center text-white" style={{ backgroundColor: "#198754" }}>
                            <h5 className="fw-bold mb-0 text-uppercase">Límites Diarios Sugeridos</h5>
                        </div>
                        <div className="card-body p-4 text-center">
                            {stats ? (
                                <div className="row g-0">
                                    <div className="col-3 border-end">
                                        <h2 className="fw-bold mb-0" style={{ color: "#FFB800" }}>{stats.calorias}</h2>
                                        <p className="small text-muted fw-bold mb-0 mt-1">CALORÍAS</p>
                                    </div>
                                    <div className="col-3 border-end">
                                        <h2 className="fw-bold mb-0" style={{ color: "#00A3FF" }}>{stats.protes}g</h2>
                                        <p className="small text-muted fw-bold mb-0 mt-1" style={{ fontSize: "0.75rem" }}>PROTEÍNAS</p>
                                    </div>
                                    <div className="col-3 border-end">
                                        <h2 className="fw-bold mb-0" style={{ color: "#FF4D4D" }}>{stats.grasas}g</h2>
                                        <p className="small text-muted fw-bold mb-0 mt-1">GRASAS</p>
                                    </div>
                                    <div className="col-3">
                                        <h2 className="fw-bold mb-0" style={{ color: "#27AE60" }}>{stats.carbos}g</h2>
                                        <p className="small text-muted fw-bold mb-0 mt-1" style={{ fontSize: "0.7rem" }}>CARBOHIDRATOS</p>
                                    </div>
                                </div>
                            ) : <p className="text-muted">Calculando parámetros...</p>}
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 p-4 bg-white">
                        <h5 className="fw-bold mb-3 border-bottom pb-2 text-uppercase small text-muted">Resumen de Perfil</h5>
                        <table className="table table-borderless align-middle mb-0">
                            <tbody>
                                <tr className="border-bottom">
                                    <td className="text-muted small fw-bold py-3">USUARIO</td>
                                    <td className="text-end py-3 fw-bold text-uppercase">{profile?.name || "SIN NOMBRE"}</td>
                                </tr>
                                <tr className="border-bottom">
                                    <td className="text-muted small fw-bold py-3">OBJETIVO</td>
                                    <td className="text-end py-3 fw-bold text-primary text-uppercase">{profile?.goal?.replace("_", " ")}</td>
                                </tr>
                                <tr className="border-bottom">
                                    <td className="text-muted small fw-bold py-3">ÍNDICE DE MASA CORPORAL (IMC)</td>
                                    <td className="text-end py-3 fw-bold">
                                        {stats?.imc} <span className={`badge ms-2 ${stats?.imc > 25 ? 'bg-danger' : 'bg-success'}`}>
                                            {stats?.imc > 25 ? 'Sobrepeso' : 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-bottom">
                                    <td className="text-muted small fw-bold py-3">TIPO DE DIETA</td>
                                    <td className="text-end py-3">
                                        <span className={`badge ${profile?.diet_type === 'vegan' ? 'bg-success' : 'bg-secondary'} me-1`}>
                                            {profile?.diet_type === 'vegan' ? 'VEGANA' : 'ESTÁNDAR'}
                                        </span>
                                        {profile?.is_gluten_free && <span className="badge bg-warning text-dark">SIN TACC</span>}
                                    </td>
                                </tr>
                                <tr className="border-bottom">
                                    <td className="text-muted small fw-bold py-3">PESO ACTUAL</td>
                                    <td className="text-end py-3 fw-bold text-success">{profile?.weight} kg</td>
                                </tr>
                                <tr>
                                    <td className="text-muted small fw-bold py-3">ESTATURA / EDAD</td>
                                    <td className="text-end py-3 fw-bold">{profile?.height} cm / {profile?.age} años</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};