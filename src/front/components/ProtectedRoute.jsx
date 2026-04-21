import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    // Revisamos si existe el token en el navegador
    const token = sessionStorage.getItem("token");

    // Si NO hay token, lo mandamos al login inmediatamente
    // "replace" evita que el usuario pueda volver atrás con el botón del navegador
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, permitimos que entre a la página (children)
    return children;
};