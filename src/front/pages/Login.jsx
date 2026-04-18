import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Login = () => {
    const { state, dispatch } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
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
                dispatch({
                    type: "login",
                    payload: { token: data.token, user: data.user }
                });

                localStorage.setItem("token", data.token);

                alert("¡Bienvenido a NUTRIFIT!");
                navigate("/"); 
            } else {
                alert("Error: " + (data.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error en el login:", error);
            alert("Error de conexión. Asegúrate de que el backend esté corriendo en el puerto 3001.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto shadow" style={{ maxWidth: "400px", borderTop: "5px solid #004d00" }}>
                <div className="text-center mb-4">
                    {/* Solo un título principal aquí */}
                    <h2 className="fw-bold" style={{ color: "#004d00" }}>NUTRIFIT</h2>
                    <p className="text-muted small">Ingresa a tu plan nutricional</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Correo Electrónico</label>
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
                        <label className="form-label fw-bold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold mb-3" style={{ backgroundColor: "#198754" }}>
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