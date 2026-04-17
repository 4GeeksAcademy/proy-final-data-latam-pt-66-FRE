<<<<<<< HEAD
import React from "react";
=======
>>>>>>> 44054c3 (Agregar alimentos, editarlos, borrarlos, categorizar, progreso)
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
<<<<<<< HEAD
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
=======
import { Layout } from "./pages/Layout";
import { NutritionTracker } from "./pages/NutritionTracker";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<NutritionTracker />} />

    </Route>
  )
>>>>>>> 44054c3 (Agregar alimentos, editarlos, borrarlos, categorizar, progreso)
);