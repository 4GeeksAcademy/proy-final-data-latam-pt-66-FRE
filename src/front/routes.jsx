import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Importaciones de NutriFit
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { NutritionPage } from "./pages/NutritionPage"; // Página de Alimentación
import { WaterPage } from "./pages/WaterPage";       // Página de Hidratación
import { FastingPage } from "./pages/FastingPage";   // Página de Ayuno
import { HistoryPage } from "./pages/HistoryPage";   // Página de Historial

export const router = createBrowserRouter(
    createRoutesFromElements(
      /* El Layout envuelve todo para que el Navbar aparezca en todas las páginas */
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Rutas de acceso público */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Rutas de la Aplicación */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nutricion" element={<NutritionPage />} />
        <Route path="/hidratacion" element={<WaterPage />} />
        <Route path="/ayuno" element={<FastingPage />} />
        <Route path="/historial" element={<HistoryPage />} />

        {/* Rutas de ejemplo/demo */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/single/:theId" element={<Single />} />

      </Route>
    )
);