import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Importaciones de NutriFit
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { NutritionPage } from "./pages/NutritionPage";
import { WaterPage } from "./pages/WaterPage";
import { FastingPage } from "./pages/FastingPage";
import { HistoryPage } from "./pages/HistoryPage";
import { RecipesPage } from "./pages/RecipesPage";

// IMPORTACIÓN DEL COMPONENTE DE PROTECCIÓN
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    /* El Layout envuelve todo para que el Navbar aparezca en todas las páginas */
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Rutas de acceso público */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 
          RUTAS PROTEGIDAS 
          Envolvemos cada una con <ProtectedRoute> para validar el token
      */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/nutricion" 
        element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} 
      />
      <Route 
        path="/recetas" 
        element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hidratacion" 
        element={<ProtectedRoute><WaterPage /></ProtectedRoute>} 
      />
      <Route 
        path="/ayuno" 
        element={<ProtectedRoute><FastingPage /></ProtectedRoute>} 
      />
      <Route 
        path="/historial" 
        element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} 
      />

      {/* Rutas de ejemplo/demo */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/single/:theId" element={<Single />} />

    </Route>
  )
);