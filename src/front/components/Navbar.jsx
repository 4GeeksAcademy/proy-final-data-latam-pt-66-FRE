import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#004d00", padding: "12px 0" }}>
            <div className="container">
                {/* LOGO ACTUALIZADO A NUTRIFIT */}
                <Link to="/" className="navbar-brand fw-bolder fs-2" style={{ color: "#B2FF9B", letterSpacing: "1px" }}>
                    NUTRIFIT
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {token && (
                        <>
                            {/* Menú Central Simplificado */}
                            <ul className="navbar-nav mx-auto gap-3">
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold px-3" style={{ color: "#E0FFDE" }} to="/">INICIO</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold px-3" style={{ color: "#E0FFDE" }} to="/calculadora">CALCULADORA</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold px-3" style={{ color: "#E0FFDE" }} to="/progreso">HISTORIAL</Link>
                                </li>
                            </ul>

                            {/* Sección Derecha: Usuario y Logout */}
                            <div className="ms-auto d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center bg-dark bg-opacity-25 px-3 py-1 rounded-pill">
                                    <i className="fas fa-user-circle me-2" style={{ color: "#B2FF9B" }}></i>
                                    <span style={{ color: "#B2FF9B", fontSize: "0.9rem", fontWeight: "600" }}>
                                        Raymon
                                    </span>
                                </div>
                                <button
                                    className="btn btn-sm px-3 fw-bold"
                                    style={{
                                        borderRadius: "20px",
                                        backgroundColor: "transparent",
                                        border: "2px solid #ff4d4d",
                                        color: "#ff4d4d"
                                    }}
                                    onClick={handleLogout}
                                >
                                    SALIR
                                </button>
                            </div>
                        </>
                    )}

                    {!token && (
                        <div className="ms-auto">
                            <Link to="/login" className="btn btn-sm px-4 py-2" style={{ backgroundColor: "#B2FF9B", color: "#004d00", fontWeight: "bold", borderRadius: "20px" }}>
                                INICIAR SESIÓN
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};