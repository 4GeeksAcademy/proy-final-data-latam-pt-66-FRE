// Import necessary components and functions from react-router-dom.
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Importaciones específicas de NutriFit
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute"; //

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path="/" element={<Signup />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />

        {/* Agregamos las rutas de NutriFit manteniendo el Layout (Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />

      </Route>
    )
);