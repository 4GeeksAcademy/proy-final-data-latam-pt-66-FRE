import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // CORRECCIÓN: Usamos ruta relativa para evitar el bloqueo de Codespaces
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: password 
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardamos el token y los datos en el store global
                dispatch({ 
                    type: "login", 
                    payload: { token: data.token, user: data.user } 
                });
                
                // Guardamos en localStorage para que la sesión persista al refrescar
                localStorage.setItem("token", data.token);
                
                alert("¡Bienvenido a NutriUNET!");
                navigate("/"); // Te redirige automáticamente al Home
            } else {
                // Si los datos no coinciden con la base de datos (image_8705c5.png)
                alert("Error: " + (data.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error en el login:", error);
            alert("Error de conexión. Asegúrate de que el backend esté corriendo en el puerto 3001.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto shadow" style={{ maxWidth: "400px", borderTop: "5px solid #198754" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success">NutriUNET</h2>
                    <p className="text-muted">Ingresa a tu plan nutricional</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold mb-3">
                        ENTRAR
                    </button>
                    <div className="text-center">
                        <span className="text-muted small">¿No tienes cuenta? </span>
                        <button 
                            type="button" 
                            className="btn btn-link btn-sm text-success p-0 fw-bold"
                            onClick={() => navigate("/signup")}
                        >
                            Regístrate aquí
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};