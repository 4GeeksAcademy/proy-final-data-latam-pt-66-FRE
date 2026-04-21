import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        // Usamos la URL completa de tu backend para asegurar la conexión

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                alert("¡Cuenta de NutriFit creada con éxito!");
                navigate("/login");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "No se pudo crear la cuenta"));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Hubo un problema de conexión. Asegúrate de que el puerto 3001 esté en 'Public' en la pestaña de PORTS.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card p-4 shadow border-success" style={{ borderRadius: "15px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success">NutriFit</h2>
                    <p className="text-muted">Crea tu cuenta de salud</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2">
                        CREAR CUENTA
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-muted small">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="text-success fw-bold text-decoration-none small">
                        Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};