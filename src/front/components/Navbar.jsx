import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: "", age: "" });
    
    const token = sessionStorage.getItem("token");
    const isAuth = !!token;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Función para cargar los datos del perfil desde el Backend
    const loadUserProfile = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${backendUrl}/api/user-profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                
                // IMPORTANTE: Usamos 'data.name' porque así está en tu models.py
                setUserData({
                    name: data.name || "Usuario",
                    age: data.age || ""
                });
            }
        } catch (error) {
            console.error("Error al cargar perfil en navbar:", error);
        }
    };

    // Solo carga el perfil si el usuario está autenticado
    useEffect(() => {
        if (isAuth) {
            loadUserProfile();
        }
    }, [isAuth]);

    const handleLogout = () => {
        sessionStorage.clear();
        setUserData({ name: "", age: "" });
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm mb-4 py-3">
            <div className="container">
                {/* Lado Izquierdo: Logo y Datos del Usuario debajo */}
                <div className="d-flex flex-column">
                    <Link to={isAuth ? "/dashboard" : "/"} className="text-decoration-none">
                        <span className="navbar-brand mb-0 h1 fw-bold text-white fs-3">NutriFit 🍏</span>
                    </Link>
                    
                    {/* Renderizado condicional del Nombre y Edad */}
                    {isAuth && userData.name && (
                        <span className="text-white small opacity-75 fw-bold animate__animated animate__fadeIn" style={{ marginTop: "-5px", fontSize: "0.85rem" }}>
                            {userData.name.toUpperCase()} {userData.age ? `| ${userData.age} AÑOS` : ""}
                        </span>
                    )}
                </div>

                {/* Botón Toggler (Solo visible si está logueado y en móviles) */}
                {isAuth && (
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                )}

                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuth ? (
                        <>
                            {/* Centro: Links de navegación con Iconos */}
                            <ul className="navbar-nav mx-auto">
                                <li className="nav-item mx-2">
                                    <Link to="/dashboard" className="nav-link text-white text-center">
                                        <i className="fas fa-user-circle d-block mb-1 fs-5"></i>
                                        <span className="small fw-bold text-uppercase">Perfil</span>
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link to="/nutricion" className="nav-link text-white text-center">
                                        <i className="fas fa-apple-alt d-block mb-1 fs-5"></i>
                                        <span className="small fw-bold text-uppercase">Nutrición</span>
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link to="/hidratacion" className="nav-link text-white text-center">
                                        <i className="fas fa-tint d-block mb-1 fs-5"></i>
                                        <span className="small fw-bold text-uppercase">Hidratación</span>
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link to="/ayuno" className="nav-link text-white text-center">
                                        <i className="fas fa-clock d-block mb-1 fs-5"></i>
                                        <span className="small fw-bold text-uppercase">Ayuno</span>
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link to="/historial" className="nav-link text-white text-center">
                                        <i className="fas fa-history d-block mb-1 fs-5"></i>
                                        <span className="small fw-bold text-uppercase">Historial</span>
                                    </Link>
                                </li>
                            </ul>

                            {/* Derecha: Botón Salir */}
                            <div className="d-flex justify-content-center mt-3 mt-lg-0">
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow-sm"
                                >
                                    SALIR
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Si no está logueado, solo mostramos opción de entrar */
                        <div className="ms-auto">
                            <Link to="/login" className="btn btn-light btn-sm rounded-pill px-4 fw-bold shadow-sm">
                                ENTRAR
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};