import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // URL directa de tu backend en el puerto 3001
        const backendUrl = "https://solid-broccoli-97rj4r4r5p543rgg-3001.app.github.dev/api/login";

        try {
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Guardamos los datos necesarios para la sesión
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user_id", data.user_id);
                
                alert("¡Bienvenido de nuevo a NutriFit!");
                navigate("/dashboard"); 
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error de login:", error);
            alert("No se pudo conectar con el servidor. Revisa el puerto 3001.");
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success display-5">NutriFit</h2>
                    <p className="text-muted fw-semibold">Ingresa a tu panel de salud</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-success">CORREO ELECTRÓNICO</label>
                        <input 
                            type="email" 
                            className="form-control form-control-lg border-2 shadow-sm" 
                            placeholder="tu@correo.com"
                            style={{ borderRadius: "10px" }}
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-success">CONTRASEÑA</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg border-2 shadow-sm" 
                            placeholder="Tu contraseña"
                            style={{ borderRadius: "10px" }}
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow-sm py-2" style={{ borderRadius: "10px" }}>
                        ENTRAR
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">¿No tienes cuenta? </span>
                    <Link to="/signup" className="text-success fw-bold text-decoration-none small">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};