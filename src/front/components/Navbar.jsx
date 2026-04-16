import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        // Usamos navigate para una transición suave, o window.location para resetear el estado
        window.location.href = "/login";
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#006400", padding: "10px 0" }}>
            <div className="container">
                {/* Logo principal */}
                <Link to="/" className="navbar-brand fw-bold fs-3" style={{ color: "#E0FFDE" }}>
                    NutriUNET
                </Link>

                {/* Botón de hamburguesa para móviles */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {token && (
                        <>
                            {/* Menú Central */}
                            <ul className="navbar-nav d-flex flex-row gap-2 ms-lg-4 mt-2 mt-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link px-2" style={{ color: "#B2FF9B", fontSize: "0.85rem" }} to="/">INICIO</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-2" style={{ color: "#B2FF9B", fontSize: "0.85rem" }} to="/perfil">MIS DATOS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-2 fw-bold text-white" style={{ fontSize: "0.85rem" }} to="/">DIARIO ALIMENTOS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-2" style={{ color: "#B2FF9B", fontSize: "0.85rem" }} to="/">METAS MACROS</Link>
                                </li>
                            </ul>

                            {/* Sección Derecha: Usuario y Logout */}
                            <div className="ms-auto d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-user-circle me-2" style={{ color: "#E0FFDE" }}></i>
                                    <span style={{ color: "#E0FFDE", fontSize: "0.9rem", fontWeight: "500" }}>
                                        Hola, Raymon
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-outline-light btn-sm px-3" 
                                    style={{ 
                                        borderRadius: "20px", 
                                        fontSize: "0.75rem", 
                                        fontWeight: "600",
                                        border: "1px solid #B2FF9B",
                                        color: "#B2FF9B"
                                    }} 
                                    onClick={handleLogout}
                                >
                                    CERRAR SESIÓN
                                </button>
                            </div>
                        </>
                    )}

                    {!token && (
                        <div className="ms-auto">
                            <Link to="/login" className="btn btn-sm px-4" style={{ backgroundColor: "#B2FF9B", color: "#006400", fontWeight: "bold", borderRadius: "20px" }}>
                                ENTRAR
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};