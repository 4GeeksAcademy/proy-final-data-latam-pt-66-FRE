import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            // USAMOS RUTA RELATIVA: Vite la pasará al puerto 3001 gracias al proxy
            const response = await fetch("/api/signup", {
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
                alert("¡Usuario creado con éxito!");
                navigate("/login");
            } else {
                alert("Error: " + (data.msg || "No se pudo registrar"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión. Revisa que el backend (puerto 3001) esté corriendo.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 border p-4 shadow bg-white">
                    <h2 className="text-center text-success mb-4">Registro NutriUNET</h2>
                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label className="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="ejemplo@correo.com"
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
                                placeholder="Ingresa tu contraseña"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 fw-bold">
                            CREAR CUENTA
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p>¿Ya tienes cuenta? <span className="text-primary" style={{cursor: 'pointer'}} onClick={() => navigate("/login")}>Inicia sesión</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};