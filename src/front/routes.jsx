import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Single } from "./pages/Single.jsx";
import { Demo } from "./pages/Demo.jsx";

/* 1. Importamos las nuevas vistas que vas a crear */
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        /* La ruta principal "/" carga el Layout (Navbar + Footer) */
        <Route path="/" element={<Layout />}>
            <Route element={<Home />} path="/" />
            
            {/* Rutas originales del Boilerplate por si las necesitas de referencia */}
            <Route element={<Demo />} path="/demo" />
            <Route element={<Single />} path="/single/:theid" />

            {/* 2. Estas son las rutas nuevas para NutriUNET */}
            <Route element={<Login />} path="/login" />
            <Route element={<Signup />} path="/signup" />

            {/* Ruta para manejar errores 404 dentro del Layout */}
            <Route element={<h1>Página no encontrada</h1>} path="*" />
        </Route>
    )
);